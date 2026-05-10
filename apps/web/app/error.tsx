'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, wire this up to Sentry or another error tracker.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-bone flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-4">— Une erreur est survenue</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] mb-6 font-medium tracking-tight">
          Quelque chose<br />
          <span className="display-italic text-terracotta">a mal tourné</span>.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-8">
          Réessayez dans un instant. Si le problème persiste, contactez-nous.
        </p>
        <div className="flex gap-3 justify-center">
          <button type="button" onClick={reset} className="btn-primary">
            Réessayer
          </button>
          <Link href="/" className="btn-secondary">
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
