import 'server-only';
import { cookies } from 'next/headers';
import { fastifyFetch } from './api';
import { getAccessToken } from './session';
import type { ExamTypeCode } from '../examType.types';

export type { ExamTypeCode } from '../examType.types';
export {
  EXAM_TYPES,
  getExamTypeDefinition,
  type ExamTypeDefinition,
} from '../examType.types';

/**
 * The user's exam target lives in two places by design:
 *
 *   1. users.preferred_exam_type (DB, authoritative)
 *      Persisted across devices, set via PATCH /api/auth/me.
 *      The source of truth once the user is authenticated.
 *
 *   2. civique_exam_type cookie (browser, fallback)
 *      Used during the pre-auth onboarding step (before the user
 *      has somewhere to write to) and as a last-known-good cache
 *      for SSR if the API call fails.
 *
 * Read order: DB → cookie → null. Write order: DB + cookie (the
 * cookie keeps the value visible synchronously for the next request,
 * which means a fresh login on another device won't briefly fall
 * back to the previous user's choice between the page render and
 * the /me fetch resolving).
 */

const COOKIE_KEY = 'civique_exam_type';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function coerce(raw: string | undefined | null): ExamTypeCode | null {
  if (raw === 'csp' || raw === 'cr' || raw === 'nat') return raw;
  return null;
}

export async function getCurrentExamType(): Promise<ExamTypeCode | null> {
  // Authenticated user → DB is authoritative.
  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      const res = await fastifyFetch<{
        data: { preferredExamType?: string | null };
      }>('/auth/me', { method: 'GET' }, { auth: true });
      const fromDb = coerce(res.data.preferredExamType ?? null);
      if (fromDb) return fromDb;
      // Authenticated but no DB choice yet — let the cookie speak
      // (the pre-auth picker may have written it).
    } catch {
      // /me failed (network blip, token expired mid-render). Fall
      // back to the cookie rather than forcing the user back through
      // onboarding for a transient error.
    }
  }

  const c = await cookies();
  return coerce(c.get(COOKIE_KEY)?.value);
}

export async function setCurrentExamType(code: ExamTypeCode): Promise<void> {
  // Always write the cookie — it's used by the pre-auth onboarding
  // and as the SSR fallback even after login.
  const c = await cookies();
  c.set(COOKIE_KEY, code, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });

  // If authenticated, also persist to the DB. Best-effort — a
  // network blip shouldn't make the user redo their picker.
  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      await fastifyFetch(
        '/auth/me',
        {
          method: 'PATCH',
          body: JSON.stringify({ preferredExamType: code }),
        },
        { auth: true },
      );
    } catch {
      // Cookie is still set; next /auth/me read will heal the DB on
      // the user's next interaction (we re-sync on read-after-write
      // mismatch via the action layer).
    }
  }
}

export async function clearCurrentExamType(): Promise<void> {
  // Pin path so the delete matches the cookie's original scope (`/`).
  // Bare-string delete would only scope the Set-Cookie to the current
  // request path, leaving the root cookie untouched in the browser.
  const c = await cookies();
  c.delete({ name: COOKIE_KEY, path: '/' });

  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      await fastifyFetch(
        '/auth/me',
        {
          method: 'PATCH',
          body: JSON.stringify({ preferredExamType: null }),
        },
        { auth: true },
      );
    } catch {
      // Ignore — cookie cleared, the DB heals on next change.
    }
  }
}
