import type { SubscriptionInfo } from '@/lib/server/payments';

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
}

/**
 * Premium status display + management hints.
 *
 * NOTE: backend doesn't yet expose a Stripe Customer Portal endpoint, so we
 * cannot render a "Gérer mon abonnement" button that opens a billing portal
 * from here. Once apps/server/src/routes/payments adds a portal route, plug
 * an `<openCustomerPortalAction>` form here.
 */
export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const expires = subscription.premiumExpires
    ? new Date(subscription.premiumExpires)
    : null;
  const expiresLabel = expires
    ? expires.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <section className="card !rounded-3xl !p-7 sm:!p-9">
      <div className="flex items-start gap-5">
        <span
          aria-hidden
          className="
            flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
            bg-saffron text-aubergine shadow-[0_2px_0_rgb(45_27_46)]
          "
        >
          <svg
            className="h-7 w-7"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </span>

        <div className="flex-1 min-w-0">
          <p className="eyebrow mb-1">— Statut</p>
          <h2
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            Civique <span className="display-italic text-terracotta">Plein</span> actif
          </h2>
          <p className="mt-3 text-ink-mute leading-relaxed">
            Vous avez accès à tout le contenu : questions illimitées, examens
            blancs sans limite, fiches premium et statistiques détaillées.
          </p>

          {expiresLabel ? (
            <p className="mt-4 text-sm">
              <span className="text-ink-mute">Renouvellement / expiration : </span>
              <span className="font-bold text-aubergine">{expiresLabel}</span>
            </p>
          ) : null}

          <div className="mt-6 rounded-2xl bg-bone-deep/60 border border-aubergine/10 p-4 text-sm leading-relaxed text-ink-mute">
            <p className="font-medium text-aubergine mb-1">Gérer votre abonnement</p>
            <p>
              Pour modifier ou résilier votre abonnement, utilisez le lien
              présent dans l&apos;e-mail de confirmation Stripe que vous avez
              reçu. Vous pouvez également écrire à{' '}
              <a
                href="mailto:contact@integrafle.fr"
                className="underline-wavy text-terracotta hover:text-aubergine"
              >
                contact@integrafle.fr
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
