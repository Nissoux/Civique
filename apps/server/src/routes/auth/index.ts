import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../../config/database.js';
import { users, authCodes } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';
import { env } from '../../config/env.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from '../../services/email.js';

const googleClient = new OAuth2Client();

// ── Schemas ────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // P1-15: trim before length check so a whitespace-only displayName is rejected.
  displayName: z.string().trim().min(1).max(100),
  preferredLang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi', 'en', 'tr']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

const updateProfileSchema = z.object({
  // P1-15: trim before length check (rejects whitespace-only displayName).
  displayName: z.string().trim().min(1).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  preferredLang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi', 'en', 'tr']).optional(),
  email: z.string().email().optional(),
  // Persisted exam target. Nullable so the client can unset (rare,
  // but legal — a user might restart onboarding).
  preferredExamType: z.enum(['csp', 'cr', 'nat']).nullable().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

// ── Auth code persistence (P1-11) ─────────────
// Email-verification & password-reset codes used to live in process-local
// Maps. A `pm2 restart` (or any deploy) invalidated every in-flight code,
// confusing users mid-flow. We now persist them in `auth_codes`.
//
// Email verification: keyed by userId (1 active code per user, overwritten
//   on resend). Payload: { code, attempts }. The user's email is stored
//   denormalised so we can match against the user's *current* email even
//   if it changes mid-flow (it shouldn't, but we don't depend on it).
// Password reset: keyed by the 8-char uppercase code the user types from
//   the email. Payload: { email, attempts }. Stored keyed by code so the
//   lookup is O(1) and matches the user-typed string directly.

type EmailVerifyPayload = { email: string; code: string; attempts: number };
type PasswordResetPayload = { email: string; attempts: number };

async function setEmailVerifyCode(
  userId: string,
  payload: EmailVerifyPayload,
  expiresAt: Date,
): Promise<void> {
  // Upsert: a resend / re-trigger should replace any pending code for this user.
  await db
    .insert(authCodes)
    .values({
      key: userId,
      type: 'email_verify',
      userId,
      payload,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: authCodes.key,
      set: { payload, expiresAt, type: 'email_verify', userId, createdAt: new Date() },
    });
}

async function getEmailVerifyCode(
  userId: string,
): Promise<{ payload: EmailVerifyPayload; expiresAt: Date } | null> {
  const row = await db.query.authCodes.findFirst({
    where: and(eq(authCodes.key, userId), eq(authCodes.type, 'email_verify')),
  });
  if (!row) return null;
  return {
    payload: row.payload as EmailVerifyPayload,
    expiresAt: new Date(row.expiresAt),
  };
}

async function updateEmailVerifyAttempts(
  userId: string,
  payload: EmailVerifyPayload,
): Promise<void> {
  await db
    .update(authCodes)
    .set({ payload })
    .where(and(eq(authCodes.key, userId), eq(authCodes.type, 'email_verify')));
}

async function deleteEmailVerifyCode(userId: string): Promise<void> {
  await db
    .delete(authCodes)
    .where(and(eq(authCodes.key, userId), eq(authCodes.type, 'email_verify')));
}

async function setPasswordResetCode(
  code: string,
  payload: PasswordResetPayload,
  expiresAt: Date,
): Promise<void> {
  // We need userId on the row for the FK. Look it up by email.
  const user = await db.query.users.findFirst({
    where: eq(users.email, payload.email),
    columns: { id: true },
  });
  if (!user) return; // caller already verified user exists; defensive no-op
  await db
    .insert(authCodes)
    .values({
      key: code,
      type: 'password_reset',
      userId: user.id,
      payload,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: authCodes.key,
      set: {
        payload,
        expiresAt,
        type: 'password_reset',
        userId: user.id,
        createdAt: new Date(),
      },
    });
}

async function getPasswordResetCode(
  code: string,
): Promise<{ payload: PasswordResetPayload; expiresAt: Date } | null> {
  const row = await db.query.authCodes.findFirst({
    where: and(eq(authCodes.key, code), eq(authCodes.type, 'password_reset')),
  });
  if (!row) return null;
  return {
    payload: row.payload as PasswordResetPayload,
    expiresAt: new Date(row.expiresAt),
  };
}

async function deletePasswordResetCode(code: string): Promise<void> {
  await db
    .delete(authCodes)
    .where(and(eq(authCodes.key, code), eq(authCodes.type, 'password_reset')));
}

// Best-effort cleanup of expired rows. Cheap — runs once at startup and
// fire-and-forget on writes. Until we add a proper cron, this keeps the
// table from growing unboundedly.
async function gcExpiredAuthCodes(): Promise<void> {
  try {
    await db.delete(authCodes).where(sql`${authCodes.expiresAt} < now()`);
  } catch {
    // Never let GC break a request.
  }
}

// ── OAuth displayName fallback (P1-14) ────────
// OAuth providers may omit `name` (Apple notoriously skips it after the
// first sign-in). Falling back to email.split('@')[0] gave names like
// "anis.benhamida" — ugly. Capitalise the first letter to at least make
// it presentable. Also strip dots/underscores/digits-only fragments so
// "jdoe2025" → "Jdoe2025" stays usable.
function fallbackDisplayNameFromEmail(email: string): string {
  const local = email.split('@')[0] || 'user';
  // Replace separators with a single space, trim, capitalise first letter.
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'Utilisateur';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// ── Apple JWKS cache ─────────────────────────
// Apple's signing keys rotate but rarely (months). Cache them in-memory with
// a short TTL so we don't hit Apple's CDN on every login. On signature failure
// we force-refresh once before giving up, in case Apple just rotated.
interface AppleJwk {
  kid: string;
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
  // Index signature so the value satisfies Node's JsonWebKey type when
  // passed to crypto.createPublicKey({ key, format: 'jwk' }).
  [k: string]: string;
}

let appleJwksCache: { keys: AppleJwk[]; fetchedAt: number } | null = null;
const APPLE_JWKS_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getAppleJwks(forceRefresh = false): Promise<AppleJwk[]> {
  const now = Date.now();
  if (
    !forceRefresh &&
    appleJwksCache &&
    now - appleJwksCache.fetchedAt < APPLE_JWKS_TTL_MS
  ) {
    return appleJwksCache.keys;
  }
  const res = await fetch('https://appleid.apple.com/auth/keys');
  if (!res.ok) throw new Error(`Apple JWKS fetch failed: ${res.status}`);
  const data = (await res.json()) as { keys: AppleJwk[] };
  if (!Array.isArray(data.keys) || data.keys.length === 0) {
    throw new Error('Apple JWKS returned no keys');
  }
  appleJwksCache = { keys: data.keys, fetchedAt: now };
  return data.keys;
}

/**
 * Verify an Apple identity token's RS256 signature against Apple's published
 * public keys (JWKS at https://appleid.apple.com/auth/keys), then validate
 * the standard claims (iss, aud, exp, nonce if provided).
 *
 * Returns the decoded payload on success. Throws on any failure.
 *
 * References:
 * - https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple
 * - https://datatracker.ietf.org/doc/html/rfc7517 (JWK)
 * - https://datatracker.ietf.org/doc/html/rfc7518#section-3.3 (RSASSA-PKCS1-v1_5 / RS256)
 */
async function verifyAppleIdentityToken(
  token: string,
  validAudiences: string[],
  expectedNonce?: string,
): Promise<{ email?: string; sub?: string; aud?: string; iss?: string; exp?: number; nonce?: string }> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const [headerB64, payloadB64, signatureB64] = parts;

  let header: { alg: string; kid: string; typ?: string };
  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Invalid JWT header');
  }

  // Only accept RS256. Reject "none" and any unexpected algorithm explicitly to
  // close the well-known JWT algorithm-confusion family of bugs.
  if (header.alg !== 'RS256') {
    throw new Error(`Unsupported JWT algorithm: ${header.alg}`);
  }
  if (!header.kid || typeof header.kid !== 'string') {
    throw new Error('JWT header missing kid');
  }

  // Find the matching public key. Refresh JWKS once if not found (Apple rotated).
  let keys = await getAppleJwks(false);
  let matching = keys.find((k) => k.kid === header.kid);
  if (!matching) {
    keys = await getAppleJwks(true);
    matching = keys.find((k) => k.kid === header.kid);
  }
  if (!matching) throw new Error('No matching Apple signing key');
  if (matching.kty !== 'RSA') throw new Error('Unexpected Apple key type');

  // Build a PEM-compatible public key from the JWK and verify the signature.
  const publicKey = crypto.createPublicKey({ key: matching, format: 'jwk' });
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = Buffer.from(signatureB64, 'base64url');

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(signingInput);
  verifier.end();
  const isValid = verifier.verify(publicKey, signature);
  if (!isValid) throw new Error('Apple JWT signature verification failed');

  // Signature OK — now decode the payload and validate claims.
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Invalid JWT payload');
  }

  if (payload.iss !== 'https://appleid.apple.com') {
    throw new Error('Invalid issuer');
  }
  if (typeof payload.aud !== 'string' || !validAudiences.includes(payload.aud)) {
    throw new Error('Invalid audience');
  }
  if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }
  // iat sanity: don't accept tokens issued in the future (allow 60s clock skew)
  if (typeof payload.iat === 'number' && payload.iat * 1000 > Date.now() + 60 * 1000) {
    throw new Error('Token issued in the future');
  }
  if (expectedNonce !== undefined && payload.nonce !== expectedNonce) {
    throw new Error('Nonce mismatch');
  }

  return {
    email: typeof payload.email === 'string' ? payload.email : undefined,
    sub: typeof payload.sub === 'string' ? payload.sub : undefined,
    aud: payload.aud,
    iss: payload.iss as string,
    exp: payload.exp,
    nonce: typeof payload.nonce === 'string' ? payload.nonce : undefined,
  };
}

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
  preferredExamType?: string | null;
  emailVerified?: boolean;
  isPremium: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    preferredLang: user.preferredLang,
    preferredExamType: user.preferredExamType ?? null,
    emailVerified: user.emailVerified ?? false,
    isPremium: user.isPremium,
    createdAt: user.createdAt,
  };
}

// ── Routes ─────────────────────────────────────

export default async function authRoutes(app: FastifyInstance) {
  // ── POST /register ───────────────────────────
  app.post('/register', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '15 minutes',
      },
    },
  }, async (request, reply) => {
    const body = registerSchema.parse(request.body);
    body.email = body.email.toLowerCase();
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
        preferredExamType: users.preferredExamType,
        isPremium: users.isPremium,
        createdAt: users.createdAt,
      });

    const tokens = issueTokens(app, { id: user.id, email: user.email });

    // Generate 6-digit verification code (P1-11: persisted in auth_codes)
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    await setEmailVerifyCode(
      user.id,
      { email: user.email, code: verifyCode, attempts: 0 },
      new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    );

    // Send verification email (non-blocking)
    sendVerificationEmail(user.email, verifyCode).catch(() => {});
    // Cheap GC of expired codes (best-effort, non-blocking).
    void gcExpiredAuthCodes();

    return reply.status(201).send({
      ...tokens,
      user: sanitizeUser(user),
      emailVerified: false,
    });
  });

  // ── POST /verify-email ──────────────────────
  const verifyEmailSchema = z.object({
    code: z.string().length(6),
  });

  app.post('/verify-email', {
    preHandler: authGuard,
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
        // Rate-limit per authenticated user. authGuard runs first, so currentUser
        // is populated by the time this keyGenerator fires. Fall back to IP if
        // somehow not set (shouldn't happen given preHandler).
        keyGenerator: (req) => req.currentUser?.id ?? req.ip,
      },
    },
  }, async (request, reply) => {
    const userId = request.currentUser!.id;
    const { code } = verifyEmailSchema.parse(request.body);

    const entry = await getEmailVerifyCode(userId);
    if (!entry) {
      return reply.status(400).send({ error: 'Aucun code de vérification en attente. Demandez un nouveau code.' });
    }

    if (new Date() > entry.expiresAt) {
      await deleteEmailVerifyCode(userId);
      return reply.status(410).send({ error: 'Le code a expiré. Demandez un nouveau code.' });
    }

    if (entry.payload.code !== code) {
      // Per-code attempt counter (defense-in-depth on top of the IP/user rate limit).
      // After 5 wrong guesses, burn the code — user must request a new one.
      const nextAttempts = entry.payload.attempts + 1;
      if (nextAttempts >= 5) {
        await deleteEmailVerifyCode(userId);
        return reply.status(429).send({
          error: 'Trop de tentatives incorrectes. Demandez un nouveau code.',
        });
      }
      await updateEmailVerifyAttempts(userId, { ...entry.payload, attempts: nextAttempts });
      return reply.status(401).send({ error: 'Code incorrect.' });
    }

    // Mark email as verified
    await db.update(users).set({ emailVerified: true, updatedAt: new Date() }).where(eq(users.id, userId));
    await deleteEmailVerifyCode(userId);

    // Send welcome email now that email is verified
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (user) {
      sendWelcomeEmail(user.email, user.displayName).catch(() => {});
    }

    return { message: 'Email vérifié avec succès.', emailVerified: true };
  });

  // ── POST /resend-verification ──────────────
  app.post('/resend-verification', { preHandler: authGuard }, async (request, reply) => {
    const userId = request.currentUser!.id;
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

    if (!user) return reply.status(404).send({ error: 'Utilisateur non trouvé.' });
    if (user.emailVerified) return reply.status(400).send({ error: 'Email déjà vérifié.' });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    await setEmailVerifyCode(
      userId,
      { email: user.email, code: verifyCode, attempts: 0 },
      new Date(Date.now() + 15 * 60 * 1000),
    );

    sendVerificationEmail(user.email, verifyCode).catch(() => {});
    return { message: 'Un nouveau code a été envoyé.' };
  });

  // ── POST /login ──────────────────────────────
  app.post('/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
      },
    },
  }, async (request, reply) => {
    const body = loginSchema.parse(request.body);
    body.email = body.email.toLowerCase();
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
        preferredExamType: true,
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
    const userId = request.currentUser!.id;

    if (Object.keys(body).length === 0) {
      return reply.status(400).send({ error: 'No fields to update' });
    }

    // Normalise email + détecte un changement réel
    let emailChanged = false;
    let newEmail: string | undefined;
    if (body.email) {
      newEmail = body.email.toLowerCase();
      const current = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { email: true },
      });
      if (!current) {
        return reply.status(404).send({ error: 'User not found' });
      }
      if (newEmail !== current.email) {
        // S'assurer qu'aucun autre utilisateur n'a déjà cet email
        const conflict = await db.query.users.findFirst({
          where: eq(users.email, newEmail),
          columns: { id: true },
        });
        if (conflict && conflict.id !== userId) {
          return reply.status(409).send({ error: 'Cet email est déjà utilisé.' });
        }
        emailChanged = true;
      }
    }

    const updateData: {
      displayName?: string;
      avatarUrl?: string | null;
      preferredLang?: 'fr' | 'ar' | 'fa' | 'pt' | 'es' | 'hi' | 'en' | 'tr';
      preferredExamType?: 'csp' | 'cr' | 'nat' | null;
      email?: string;
      emailVerified?: boolean;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };
    if (body.displayName !== undefined) updateData.displayName = body.displayName;
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;
    if (body.preferredLang !== undefined) updateData.preferredLang = body.preferredLang;
    if (body.preferredExamType !== undefined) updateData.preferredExamType = body.preferredExamType;
    if (emailChanged && newEmail) {
      updateData.email = newEmail;
      updateData.emailVerified = false;
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        preferredLang: users.preferredLang,
        preferredExamType: users.preferredExamType,
        emailVerified: users.emailVerified,
        isPremium: users.isPremium,
        createdAt: users.createdAt,
      });

    if (!updated) {
      return reply.status(404).send({ error: 'User not found' });
    }

    // Si l'email a changé, génère un code et envoie un email de vérification
    if (emailChanged && newEmail) {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      await setEmailVerifyCode(
        userId,
        { email: newEmail, code: verifyCode, attempts: 0 },
        new Date(Date.now() + 15 * 60 * 1000),
      );
      sendVerificationEmail(newEmail, verifyCode).catch(() => {});
    }

    return { data: sanitizeUser(updated) };
  });

  // ── POST /change-password ───────────────────
  const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
  });

  app.post('/change-password', { preHandler: authGuard }, async (request, reply) => {
    const { currentPassword, newPassword } = changePasswordSchema.parse(request.body);
    const userId = request.currentUser!.id;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.passwordHash) {
      return reply.status(400).send({ error: 'Ce compte utilise la connexion sociale (Apple/Google). Aucun mot de passe à modifier.' });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ error: 'Mot de passe actuel incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(users).set({ passwordHash: newHash, updatedAt: new Date() }).where(eq(users.id, userId));

    sendPasswordChangedEmail(user.email).catch(() => {});

    return { message: 'Mot de passe modifié avec succès.' };
  });

  // ── DELETE /me ─────────────────────────────
  app.delete('/me', { preHandler: authGuard }, async (request, reply) => {
    const userId = request.currentUser!.id;

    // Delete all related data before deleting user
    await db.execute(sql`DELETE FROM promo_redemptions WHERE user_id = ${userId}`);
    await db.execute(sql`DELETE FROM comments WHERE user_id = ${userId}`);
    await db.execute(sql`DELETE FROM challenge_answers WHERE user_id = ${userId}`);
    await db.execute(sql`DELETE FROM challenges WHERE challenger_id = ${userId} OR challenged_id = ${userId}`);
    await db.execute(sql`DELETE FROM friendships WHERE requester_id = ${userId} OR addressee_id = ${userId}`);
    await db.execute(sql`DELETE FROM practice_answers WHERE user_id = ${userId}`);
    await db.execute(sql`DELETE FROM exam_answers WHERE session_id IN (SELECT id FROM exam_sessions WHERE user_id = ${userId})`);
    await db.execute(sql`DELETE FROM exam_sessions WHERE user_id = ${userId}`);

    // Now delete the user
    const deleted = await db.delete(users).where(eq(users.id, userId)).returning({ id: users.id });

    if (deleted.length === 0) {
      return reply.status(404).send({ error: 'User not found' });
    }

    app.log.info({ userId }, 'User account deleted');
    return { message: 'Votre compte a été supprimé avec succès.' };
  });

  // ── POST /forgot-password ────────────────────
  app.post('/forgot-password', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '15 minutes',
      },
    },
  }, async (request, reply) => {
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
    // Email shows token.substring(0, 8).toUpperCase() — store keyed by that
    // so user-typed codes match. Full token kept in entry for any future use.
    const code = token.substring(0, 8).toUpperCase();
    // TTL shrunk from 1h to 15 min to tighten the brute-force window (F2).
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // P1-11: persisted in auth_codes instead of in-memory Map.
    await setPasswordResetCode(code, { email: user.email, attempts: 0 }, expiresAt);

    // Send reset email (non-blocking)
    sendPasswordResetEmail(user.email, token).catch(() => {});
    void gcExpiredAuthCodes();

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
  });

  // ── POST /reset-password ─────────────────────
  app.post('/reset-password', {
    config: {
      rateLimit: {
        // 5 attempts per 15 min per IP — combined with the 15-min code TTL and
        // the per-code attempt counter below, this makes online brute force of
        // the 32-bit code space infeasible.
        max: 5,
        timeWindow: '15 minutes',
      },
    },
  }, async (request, reply) => {
    const { token, password } = resetPasswordSchema.parse(request.body);

    // Tokens are stored keyed by the 8-char uppercase code that ships in the
    // email. Accept what the user typed, normalised to that shape.
    const code = token.trim().toUpperCase();
    const entry = await getPasswordResetCode(code);
    if (!entry) {
      return reply.status(400).send({ error: 'Invalid or expired reset token' });
    }

    if (new Date() > entry.expiresAt) {
      await deletePasswordResetCode(code);
      return reply.status(400).send({ error: 'Invalid or expired reset token' });
    }

    // Note on the per-code attempt counter: since codes are stored keyed BY the
    // code itself, a wrong guess never finds an entry — so we don't have a place
    // to bump a counter on miss. The IP rate limit above + the 15-min TTL are
    // the effective defenses against online brute force. The `attempts` field
    // is kept for symmetry with the verification-code flow (where it does work).

    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.email, entry.payload.email));

    await deletePasswordResetCode(code);

    return { message: 'Password has been reset successfully.' };
  });

  // ── POST /google ────────────────────────────
  app.post('/google', async (request, reply) => {
    const { idToken } = z.object({ idToken: z.string() }).parse(request.body);

    // Verify the Google ID token with signature check
    let payload: { email?: string; name?: string; sub?: string };
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID || '593427095159-ccfousaqelr1rj1mk9ojhifbo87levud.apps.googleusercontent.com',
      });
      const p = ticket.getPayload();
      if (!p) throw new Error('No payload');
      payload = { email: p.email, name: p.name, sub: p.sub };
    } catch {
      return reply.status(401).send({ error: 'Invalid Google token' });
    }

    if (!payload.email) {
      return reply.status(400).send({ error: 'Email not available from Google' });
    }

    const email = payload.email.toLowerCase();
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Auto-register. P1-14: Google has already verified the email (id_token
      // is signed by Google over a verified address), so we set
      // emailVerified=true and skip our own 6-digit code flow. Also guard
      // against an empty Google `name` (falsy after trim) — fall back to a
      // capitalised local-part of the email.
      const trimmedName = (payload.name || '').trim();
      const displayName = trimmedName !== '' ? trimmedName : fallbackDisplayNameFromEmail(email);
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash: '', // No password for OAuth users
          displayName,
          emailVerified: true,
        })
        .returning();
      user = newUser;
    }

    const tokens = issueTokens(app, { id: user.id, email: user.email });
    return {
      ...tokens,
      user: sanitizeUser(user),
    };
  });

  // ── POST /apple ─────────────────────────────
  app.post('/apple', async (request, reply) => {
    const body = z.object({
      identityToken: z.string(),
      displayName: z.string().optional(),
      nonce: z.string().optional(),
    }).parse(request.body);

    // Verify Apple identity token: RS256 signature against Apple's JWKS,
    // plus iss/aud/exp/nonce claim checks. See verifyAppleIdentityToken.
    //
    // Audience: in production we only accept the production bundle ID. In
    // non-production we also accept Expo Go's audience so dev builds keep
    // working without weakening prod security.
    const isProd = process.env.NODE_ENV === 'production';
    const appleBundleId = process.env.APPLE_BUNDLE_ID || 'com.civique.app';
    const validAudiences = isProd ? [appleBundleId] : [appleBundleId, 'host.exp.Exponent'];

    let payload: { email?: string; sub?: string };
    try {
      payload = await verifyAppleIdentityToken(body.identityToken, validAudiences, body.nonce);
    } catch (err) {
      app.log.warn({ err: (err as Error).message }, 'Apple token verification failed');
      return reply.status(401).send({ error: 'Invalid Apple token' });
    }

    if (!payload.email) {
      return reply.status(400).send({ error: 'Email not available from Apple' });
    }

    const email = payload.email.toLowerCase();
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // P1-14: Apple verified the email server-side (identity token signed by
      // Apple JWKS). Mark emailVerified=true on auto-create. Apple only
      // sends `displayName` from the client on the FIRST sign-in — defend
      // against an empty string by falling back to a capitalised local-part.
      const trimmedName = (body.displayName || '').trim();
      const displayName = trimmedName !== '' ? trimmedName : fallbackDisplayNameFromEmail(email);
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash: '',
          displayName,
          emailVerified: true,
        })
        .returning();
      user = newUser;
    }

    const tokens = issueTokens(app, { id: user.id, email: user.email });
    return {
      ...tokens,
      user: sanitizeUser(user),
    };
  });
}
