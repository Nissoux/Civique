import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE, COOKIE_MAX_AGE, env } from './lib/env';

const PROTECTED = ['/app', '/verify-email', '/onboarding'];
const REDIRECT_IF_AUTHED = ['/login', '/register', '/forgot-password'];

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access = req.cookies.get(COOKIE.access)?.value;
  const refresh = req.cookies.get(COOKIE.refresh)?.value;

  // Step 1: decide what to do with the session.
  let nextTokens: RefreshResponse | null = null;
  let clearTokens = false;
  let hasSession = Boolean(access);

  if (!access && refresh) {
    const refreshed = await tryRefresh(refresh);
    if (refreshed) {
      nextTokens = refreshed;
      hasSession = true;
    } else {
      clearTokens = true;
      hasSession = false;
    }
  }

  // Step 2: decide which response to send.
  let response: NextResponse;
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );

  if (isProtected && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    response = NextResponse.redirect(url);
    clearTokens = true;
  } else if (REDIRECT_IF_AUTHED.includes(pathname) && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/app';
    url.search = '';
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
  }

  // Step 3: apply cookie changes to whichever response we chose.
  if (nextTokens) {
    writeSessionCookies(response, nextTokens);
  }
  if (clearTokens) {
    response.cookies.delete(COOKIE.access);
    response.cookies.delete(COOKIE.refresh);
  }

  return response;
}

async function tryRefresh(
  refreshToken: string,
): Promise<RefreshResponse | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    return (await res.json()) as RefreshResponse;
  } catch {
    return null;
  }
}

function writeSessionCookies(res: NextResponse, tokens: RefreshResponse) {
  const baseOpts = {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax' as const,
    path: '/',
  };
  res.cookies.set(COOKIE.access, tokens.accessToken, {
    ...baseOpts,
    maxAge: COOKIE_MAX_AGE.access,
  });
  res.cookies.set(COOKIE.refresh, tokens.refreshToken, {
    ...baseOpts,
    maxAge: COOKIE_MAX_AGE.refresh,
  });
}

export const config = {
  // Match all paths except Next internals and our own API routes (which set
  // their own cookies via Server Actions / Route Handlers).
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
