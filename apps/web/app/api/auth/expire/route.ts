import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE } from '@/lib/env';

/**
 * Clears auth cookies and bounces to /login. Used as a fallback when a
 * server-rendered page detects that its session is unusable but cannot
 * write cookies itself (Server Components are read-only for cookies).
 */
export async function GET(request: NextRequest) {
  const url = new URL('/login?expired=1', request.url);
  const res = NextResponse.redirect(url);
  res.cookies.delete(COOKIE.access);
  res.cookies.delete(COOKIE.refresh);
  return res;
}
