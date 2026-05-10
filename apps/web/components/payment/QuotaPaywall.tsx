import Link from 'next/link';

interface QuotaPaywallProps {
  type: 'daily' | 'weekly';
  used: number;
  limit: number;
  /** ISO timestamp of next quota reset, if known. */
  resetsAt?: string;
}

/**
 * Reusable paywall card shown when a free user hits the daily/weekly limit.
 * Mobile equivalent: apps/mobile/components/QuotaPaywall.tsx
 *
 * Designed to be embedded inside a page (e.g. subscription page header) — it
 * does not own a full screen layout. Wrap it in your own container.
 */
export function QuotaPaywall({
  type,
  used,
  limit,
  resetsAt,
}: QuotaPaywallProps) {
  const resetDate = resetsAt ? new Date(resetsAt) : null;
  const resetLabel = resetDate
    ? resetDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : null;

  const heading =
    type === 'daily'
      ? 'Limite quotidienne atteinte'
      : 'Limite hebdomadaire atteinte';
  const description =
    type === 'daily'
      ? `Vous avez utilisé vos ${limit} questions gratuites aujourd'hui.`
      : `Vous avez utilisé votre examen blanc gratuit cette semaine.`;

  return (
    <section
      role="status"
      aria-live="polite"
      className="
        rounded-3xl border-[1.5px] border-terracotta/30 bg-terracotta/5
        p-6 sm:p-8
      "
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="
            flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
            bg-terracotta text-bone shadow-[0_2px_0_rgb(45_27_46)]
          "
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0-13a5 5 0 015 5v3H7v-3a5 5 0 015-5z"
            />
          </svg>
        </span>

        <div className="flex-1 min-w-0">
          <p className="eyebrow mb-1">— Quota dépassé</p>
          <h2
            className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            {heading}
          </h2>
          <p className="mt-2 text-ink-mute leading-relaxed">{description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="pill">
              <span className="font-bold text-aubergine">{used}</span>
              <span className="text-ink-mute">/ {limit}</span>
            </span>
            {resetLabel ? (
              <span className="text-ink-mute font-display italic">
                Réinitialisation : {resetLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link href="#offers" className="btn-primary !justify-center">
              Voir les offres
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link href="/app" className="btn-secondary !justify-center">
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
