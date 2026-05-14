'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiError, fastifyFetch } from '@/lib/server/api';
import { setSessionCookies } from '@/lib/server/session';
import type { AuthResponse } from '@/lib/auth-types';

/**
 * Server actions for social sign-in.
 *
 * The actual identity verification lives on the Fastify backend
 * (`POST /api/auth/google` and `POST /api/auth/apple`) — those routes verify
 * the signed token against Google/Apple JWKS and return our own JWT pair.
 * The web layer here is the thin glue that:
 *   1. takes the provider-issued credential from the client component
 *   2. swaps it server-side for our JWTs
 *   3. drops the JWTs into the httpOnly session cookies
 *   4. redirects to the post-login destination
 *
 * Why a Server Action instead of a /api route?
 * --------------------------------------------
 * Server Actions can be invoked directly from a client component without an
 * extra fetch, and Next pipes the response into our cookie store. No CSRF
 * surface to manage by hand, no JSON parsing on the client. The
 * `provider-token-only` shape also means the secret never leaves the server
 * — the client only ever holds a one-shot Google/Apple credential that is
 * useless once consumed.
 */

const googleSchema = z.object({
  idToken: z.string().min(20, 'Missing Google credential'),
  next: z.string().optional(),
});

type SignInResult = { ok: true; next: string } | { ok: false; error: string };

function sanitizeNext(candidate: string | undefined): string {
  // Only internal paths. Prevents open-redirect via crafted `next=...`.
  if (!candidate) return '/app';
  if (candidate.startsWith('/') && !candidate.startsWith('//')) {
    return candidate;
  }
  return '/app';
}

export async function googleSignInAction(
  input: { idToken: string; next?: string },
): Promise<SignInResult> {
  const parsed = googleSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' };
  }

  const next = sanitizeNext(parsed.data.next);

  try {
    const res = await fastifyFetch<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken: parsed.data.idToken }),
    });

    await setSessionCookies({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    });
  } catch (err) {
    // 401 = bad/expired Google token. Anything else likely a backend/Brevo
    // hiccup the user can retry through.
    if (err instanceof ApiError && err.status === 401) {
      return { ok: false, error: 'Connexion Google refusée. Réessayez.' };
    }
    return {
      ok: false,
      error:
        err instanceof ApiError
          ? err.userMessage
          : 'Connexion impossible. Réessayez dans un instant.',
    };
  }

  // We return ok+next; the client triggers `router.push(next)` after the
  // server action resolves. We deliberately avoid `redirect()` here so that
  // any state errors surfacing post-cookie-write still propagate to the
  // calling component without being eaten by the redirect throw.
  return { ok: true, next };
}
