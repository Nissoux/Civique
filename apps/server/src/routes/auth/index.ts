import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
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

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  preferredLang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi']).optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

// ── In-memory password reset store ─────────────

interface ResetEntry {
  email: string;
  expiresAt: Date;
}

const passwordResetTokens = new Map<string, ResetEntry>();

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
      columns: { id: true, email: true },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    passwordResetTokens.set(token, { email: user.email, expiresAt });

    // TODO: Send email with reset link in production
    // Token stored in memory, user will receive via email

    return { message: 'If that email exists, a reset link has been sent.' };
  });

  // ── POST /reset-password ─────────────────────
  app.post('/reset-password', async (request, reply) => {
    const { token, password } = resetPasswordSchema.parse(request.body);

    const entry = passwordResetTokens.get(token);
    if (!entry) {
      return reply.status(400).send({ error: 'Invalid or expired reset token' });
    }

    if (new Date() > entry.expiresAt) {
      passwordResetTokens.delete(token);
      return reply.status(400).send({ error: 'Invalid or expired reset token' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.email, entry.email));

    passwordResetTokens.delete(token);

    return { message: 'Password has been reset successfully.' };
  });
}
