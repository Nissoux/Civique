import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE } from '@/lib/env';

/**
 * Clears auth cookies and bounces to /login. Used as a fallback when a
 * server-rendered page detects that its session is unusable but cannot
 * write cookies itself (Server Components are read-only for cookies).
 *
 * NB: in prod the Node server binds to HOSTNAME=0.0.0.0 behind Nginx, so
 * `request.url` resolves to the internal `https://0.0.0.0:3005/...` host
 * and the Location header becomes unreachable. We rebuild the URL from
 * the forwarded headers Nginx sets.
 */
export async function GET(request: NextRequest) {
  const proto =
    request.headers.get('x-forwarded-proto') || 'https';
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    'civique.integrafle.fr';
  const url = new URL('/login?expired=1', `${proto}://${host}`);
  const res = NextResponse.redirect(url);
  // Pin path to '/' so the delete actually overrides the cookie that was
  // set with `path: '/'`. Without this Next would scope the Set-Cookie to
  // the request path (`/api/auth/expire`) and the browser would keep the
  // root-scoped cookie, sending the user round and round.
  res.cookies.delete({ name: COOKIE.access, path: '/' });
  res.cookies.delete({ name: COOKIE.refresh, path: '/' });
  return res;
}
