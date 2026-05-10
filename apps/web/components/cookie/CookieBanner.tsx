'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'civique_cookies_acknowledged';

export function CookieBanner() {
  // Start hidden — only the client can read localStorage, so we render
  // the banner after mount to avoid SSR/hydration mismatches.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const acknowledged = window.localStorage.getItem(STORAGE_KEY);
      if (acknowledged !== '1') {
        setVisible(true);
      }
    } catch {
      // Private mode or storage unavailable — show banner anyway.
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Ignore — banner will just reappear on next mount.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-live="polite"
      aria-label="Information sur les cookies"
      className="
        fixed inset-x-3 bottom-3 sm:inset-x-0 sm:bottom-5 z-[60]
        sm:flex sm:justify-center sm:px-5
        pointer-events-none
      "
    >
      <div
        className="
          pointer-events-auto
          w-full max-w-2xl mx-auto
          bg-bone border-[1.5px] border-aubergine rounded-2xl
          shadow-[0_4px_0_rgb(45_27_46)]
          p-4 sm:p-5
          flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4
        "
      >
        <div className="flex-1 min-w-0">
          <p className="eyebrow text-[0.65rem] mb-1">— Cookies</p>
          <p className="text-sm leading-relaxed text-aubergine">
            Civique utilise uniquement des cookies essentiels (connexion,
            préférences). Pas de traçage publicitaire ni d'analyse tierce.{' '}
            <Link
              href="/privacy"
              className="font-semibold underline decoration-terracotta decoration-2 underline-offset-2 hover:text-terracotta transition-colors"
            >
              En savoir plus
            </Link>
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="J'accepte l'utilisation des cookies essentiels"
          className="
            shrink-0 inline-flex items-center justify-center
            px-5 py-2.5 rounded-full font-semibold text-sm
            bg-aubergine text-bone hover:bg-aubergine-mid
            shadow-[0_2px_0_rgb(45_27_46)]
            transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone
          "
        >
          OK
        </button>
      </div>
    </aside>
  );
}
