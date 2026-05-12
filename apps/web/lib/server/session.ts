import 'server-only';
import { cookies } from 'next/headers';
import { COOKIE, COOKIE_MAX_AGE, env } from '../env';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export async function getAccessToken(): Promise<string | undefined> {
  const c = await cookies();
  return c.get(COOKIE.access)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const c = await cookies();
  return c.get(COOKIE.refresh)?.value;
}

export async function setSessionCookies(tokens: SessionTokens): Promise<void> {
  const c = await cookies();
  const baseOpts = {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax' as const,
    path: '/',
  };
  c.set(COOKIE.access, tokens.accessToken, {
    ...baseOpts,
    maxAge: COOKIE_MAX_AGE.access,
  });
  c.set(COOKIE.refresh, tokens.refreshToken, {
    ...baseOpts,
    maxAge: COOKIE_MAX_AGE.refresh,
  });
}

export async function clearSessionCookies(): Promise<void> {
  const c = await cookies();
  // Pass an object so we can pin the path. Otherwise Next emits a Set-Cookie
  // for the *current request* path, which doesn't match the path the cookie
  // was originally set on (`/`) — the browser then keeps the stale cookie
  // and the user has to click logout twice before middleware actually sees
  // the empty session. Same applies to access/refresh which were both set
  // with `path: '/'` in setSessionCookies above.
  c.delete({ name: COOKIE.access, path: '/' });
  c.delete({ name: COOKIE.refresh, path: '/' });
}
