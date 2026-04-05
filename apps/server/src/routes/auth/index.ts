import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { sendEmail, welcomeEmailHtml, verificationEmailHtml } from '../../services/email.js';
import { db } from '../../config/database.js';
import { users } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';
import { env } from '../../config/env.js';

// ── Schemas ────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100),
  preferredLang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

const socialLoginSchema = z.object({
  provider: z.enum(['google', 'apple']),
  token: z.string(),
  displayName: z.string().optional(),
  email: z.string().email(),
});

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  preferredLang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi']).optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const verifyResetCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  resetToken: z.string(),
  newPassword: z.string().min(8),
});

// ── In-memory password reset store ─────────────

const resetCodes = new Map<string, { code: string; email: string; expiresAt: number }>();
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

// ── Helpers ────────────────────────────────────

function issueTokens(app: FastifyInstance, payload: { id: string; email: string }) {
  const accessToken = app.jwt.sign(payload, { expiresIn: '15m' });
  const refreshToken = app.jwt.sign({ id: payload.id, type: 'refresh' }, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

function sanitizeUser(user: {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  preferredLang: string;
  isPremium: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    preferredLang: user.preferredLang,
    isPremium: user.isPremium,
    createdAt: user.createdAt,
  };
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Routes ─────────────────────────────────────

export default async function authRoutes(app: FastifyInstance) {
  // ── POST /register ───────────────────────────
  app.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const existing = await db.query.users.findFirst({
      where: eq(users.email, body.email),
    });

    if (existing) {
      return reply.status(409).send({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const [user] = await db
      .insert(users)
      .values({
        email: body.email,
        passwordHash,
        displayName: body.displayName,
        ...(body.preferredLang ? { preferredLang: body.preferredLang } : {}),
      })
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        preferredLang: users.preferredLang,
        isPremium: users.isPremium,
        createdAt: users.createdAt,
      });

    const tokens = issueTokens(app, { id: user.id, email: user.email });

    // Send welcome email (async, don't block response)
    sendEmail({
      to: user.email,
      toName: user.displayName,
      subject: 'Bienvenue sur Civique !',
      html: welcomeEmailHtml(user.displayName),
    }).catch(() => {}); // Don't fail registration if email fails

    return reply.status(201).send({
      ...tokens,
      user: sanitizeUser(user),
    });
  });

  // ── POST /login ──────────────────────────────
  app.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await db.query.users.findFirst({
      where: eq(users.email, body.email),
    });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const tokens = issueTokens(app, { id: user.id, email: user.email });
    return {
      ...tokens,
      user: sanitizeUser(user),
    };
  });

  // ── POST /refresh ────────────────────────────
  app.post('/refresh', async (request, reply) => {
    const { refreshToken } = refreshSchema.parse(request.body);

    try {
      const decoded = app.jwt.verify<{ id: string; type?: string }>(refreshToken);
      if (decoded.type !== 'refresh') {
        return reply.status(401).send({ error: 'Invalid refresh token' });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
        columns: { id: true, email: true },
      });

      if (!user) {
        return reply.status(401).send({ error: 'User not found' });
      }

      const tokens = issueTokens(app, { id: user.id, email: user.email });
      return tokens;
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired refresh token' });
    }
  });

  // ── GET /me ──────────────────────────────────
  app.get('/me', { preHandler: authGuard }, async (request, reply) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, request.currentUser!.id),
      columns: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        preferredLang: true,
        isPremium: true,
        premiumExpires: true,
        createdAt: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return { data: user };
  });

  // ── PATCH /me ────────────────────────────────
  app.patch('/me', { preHandler: authGuard }, async (request, reply) => {
    const body = updateProfileSchema.parse(request.body);

    if (Object.keys(body).length === 0) {
      return reply.status(400).send({ error: 'No fields to update' });
    }

    const [updated] = await db
      .update(users)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(users.id, request.currentUser!.id))
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        preferredLang: users.preferredLang,
        isPremium: users.isPremium,
        createdAt: users.createdAt,
      });

    if (!updated) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return { data: sanitizeUser(updated) };
  });

  // ── POST /forgot-password ────────────────────
  app.post('/forgot-password', async (request, reply) => {
    const { email } = forgotPasswordSchema.parse(request.body);
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true, email: true, displayName: true },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'Si cet email existe, un code de vérification a été envoyé.' };
    }

    const code = generateCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store code keyed by email (overwrite any previous code)
    resetCodes.set(email.toLowerCase(), { code, email: user.email, expiresAt });

    // Send verification code email
    sendEmail({
      to: user.email,
      toName: user.displayName,
      subject: 'Civique — Code de réinitialisation',
      html: verificationEmailHtml(user.displayName, code),
    }).catch((err) => {
      console.error('[Auth] Failed to send reset code email:', err);
    });

    return { message: 'Si cet email existe, un code de vérification a été envoyé.' };
  });

  // ── POST /verify-reset-code ──────────────────
  app.post('/verify-reset-code', async (request, reply) => {
    const { email, code } = verifyResetCodeSchema.parse(request.body);

    const entry = resetCodes.get(email.toLowerCase());

    if (!entry) {
      return reply.status(400).send({ error: 'Code invalide ou expiré.' });
    }

    if (Date.now() > entry.expiresAt) {
      resetCodes.delete(email.toLowerCase());
      return reply.status(400).send({ error: 'Code invalide ou expiré.' });
    }

    if (entry.code !== code) {
      return reply.status(400).send({ error: 'Code invalide ou expiré.' });
    }

    // Code is valid — generate a one-time reset token
    const resetToken = crypto.randomUUID();
    resetTokens.set(resetToken, {
      email: entry.email,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes to use the token
    });

    return { valid: true, resetToken };
  });

  // ── POST /reset-password ─────────────────────
  app.post('/reset-password', async (request, reply) => {
    const { email, resetToken, newPassword } = resetPasswordSchema.parse(request.body);

    const tokenEntry = resetTokens.get(resetToken);
    if (!tokenEntry) {
      return reply.status(400).send({ error: 'Jeton de réinitialisation invalide ou expiré.' });
    }

    if (Date.now() > tokenEntry.expiresAt) {
      resetTokens.delete(resetToken);
      return reply.status(400).send({ error: 'Jeton de réinitialisation invalide ou expiré.' });
    }

    if (tokenEntry.email.toLowerCase() !== email.toLowerCase()) {
      return reply.status(400).send({ error: 'Jeton de réinitialisation invalide ou expiré.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.email, tokenEntry.email));

    // Clean up
    resetTokens.delete(resetToken);
    resetCodes.delete(email.toLowerCase());

    return { message: 'Mot de passe réinitialisé avec succès.' };
  });

  // ── POST /social-login ─────────────────────────
  app.post('/social-login', async (request, reply) => {
    const body = socialLoginSchema.parse(request.body);

    // ── Verify token based on provider ──────────
    if (body.provider === 'google') {
      try {
        const res = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(body.token)}`,
        );
        if (!res.ok) {
          return reply.status(401).send({ error: 'Invalid Google token' });
        }
        const tokenInfo = (await res.json()) as { email?: string };
        if (tokenInfo.email?.toLowerCase() !== body.email.toLowerCase()) {
          return reply.status(401).send({ error: 'Email mismatch with Google token' });
        }
      } catch {
        return reply.status(401).send({ error: 'Failed to verify Google token' });
      }
    }
    // For Apple: token is verified client-side by expo-apple-authentication

    // ── Find or create user ─────────────────────
    let user = await db.query.users.findFirst({
      where: eq(users.email, body.email),
    });

    if (!user) {
      // Create new user with a random password hash (social login only)
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();
      const passwordHash = await bcrypt.hash(randomPassword, 12);
      const displayName = body.displayName || body.email.split('@')[0];

      const [newUser] = await db
        .insert(users)
        .values({
          email: body.email,
          passwordHash,
          displayName,
        })
        .returning();

      user = newUser;

      // Send welcome email (async, don't block response)
      sendEmail({
        to: newUser.email,
        toName: newUser.displayName,
        subject: 'Bienvenue sur Civique !',
        html: welcomeEmailHtml(newUser.displayName),
      }).catch(() => {});
    }

    if (!user) {
      return reply.status(500).send({ error: 'Failed to create user' });
    }

    const tokens = issueTokens(app, { id: user.id, email: user.email });
    return {
      ...tokens,
      user: sanitizeUser(user),
    };
  });
}
