'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchAuthed } from '@/lib/client/session';

/**
 * Hero call-to-action block of the static home. Logged-out pair
 * (« Commencer ma préparation » + « Voir le programme ») is the
 * prerendered default; a client session probe swaps in the dashboard
 * button for returning users. Same static-shell rationale as AuthNav.
 */
export function HeroCtas() {
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

  if (authed) {
    return (
      <Link href="/app" className="btn-primary text-base">
        Aller au tableau de bord
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    );
  }

  return (
    <>
      <Link href="/register" className="btn-primary text-base">
        Commencer ma préparation
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
      <Link href="#programme" className="btn-secondary text-base">
        Voir le programme
      </Link>
    </>
  );
}
