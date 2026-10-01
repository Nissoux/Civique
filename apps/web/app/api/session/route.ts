import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/server/session';

/**
 * Lightweight session probe for the static public pages.
 *
 * The public site (home, /guides, /pourquoi-civique…) is statically
 * prerendered — it can't read cookies at render time. Client components
 * (AuthNav, HeroCtas) call this endpoint after mount to swap the
 * logged-out defaults for the dashboard variants.
 *
 * Presence-only check (no upstream /auth/me call): worst case, an
 * expired-token visitor sees a « tableau de bord » link whose click
 * lands on /login via the /app guard — self-healing, and the endpoint
 * stays sub-millisecond with zero load on the API.
 */
export async function GET() {
  const token = await getAccessToken();
  return NextResponse.json(
    { authed: Boolean(token) },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
