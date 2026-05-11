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
  c.delete(COOKIE.access);
  c.delete(COOKIE.refresh);
}
