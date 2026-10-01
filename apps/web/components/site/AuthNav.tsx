'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchAuthed } from '@/lib/client/session';

/**
 * Auth-aware slot of the static SiteHeader nav. Renders the logged-out
 * default (« Se connecter ») in the prerendered HTML and swaps to the
 * dashboard CTA after a client-side session probe — this is what lets
 * the whole public shell stay static (head metadata, HTML caching,
 * bfcache) instead of going dynamic for one cookie read.
 */
export function AuthNav() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    let active = true;
    fetchAuthed().then((a) => {
      if (active) setAuthed(a);
    });
    return () => {
      active = false;
    };
  }, []);

  return authed ? (
    <Link href="/app" className="btn-primary !px-5 !py-2 text-sm">
      Mon tableau de bord →
    </Link>
  ) : (
    <Link href="/login" className="hover:text-terracotta transition-colors">
      Se connecter
    </Link>
  );
}
