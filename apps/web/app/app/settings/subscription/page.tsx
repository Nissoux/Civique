import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server/me';
import { getSubscription } from '@/lib/server/payments';
import { getQuota } from '@/lib/server/stats';
import { PlanCard } from '@/components/payment/PlanCard';
import { QuotaPaywall } from '@/components/payment/QuotaPaywall';
import { SubscriptionStatus } from '@/components/payment/SubscriptionStatus';
import { PromoCodeForm } from '@/components/payment/PromoCodeForm';

// Subscription plans — keep aligned with apps/server/src/routes/payments/index.ts
// (STRIPE_PRICES). Prices: weekly 3.99€, monthly 10.99€, 6 months 39.99€.
// All three are subscription-mode (recurring) because the Stripe price IDs
// were created as recurring on the Stripe side. If we want a one-time 6-month,
// create a non-recurring price and flip STRIPE_PLAN_MODES.semiannual back.
const COMMON_FEATURES = [
  "Questions d'entraînement illimitées",
  'Examens blancs illimités',
  'Toutes les fiches de révision premium',
  'Statistiques détaillées par thème',
  'Support multilingue complet',
];

interface PageProps {
  searchParams: Promise<{
    success?: string;
    from?: string;
    error?: string;
  }>;
}

export default async function SubscriptionPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const params = await searchParams;
  const showSuccess = params.success === '1';
  const fromContext = params.from;
  const errorCode = params.error;

  // Best-effort parallel fetch — quota may fail for users without examType.
  const [subscription, quota] = await Promise.all([
    getSubscription().catch(() => ({ isPremium: false } as const)),
    getQuota().catch(() => null),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-aubergine text-bone overflow-hidden border-b-[1.5px] border-aubergine">
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-saffron/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-terracotta/30 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
          <Link
            href="/app"
            className="
              inline-flex items-center gap-1.5 text-sm font-medium text-bone/70
              hover:text-saffron transition-colors mb-6
            "
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au tableau de bord
          </Link>

          <p className="font-display italic text-saffron text-base mb-2">
            — Civique Plein
          </p>
          <h1
            className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-medium tracking-tight max-w-2xl"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            Préparez l&apos;examen <span className="display-italic text-terracotta">sans limites</span>.
          </h1>
          <p className="text-bone/70 mt-4 max-w-xl leading-relaxed text-lg">
            Toutes les questions, tous les examens blancs, toutes les fiches.
            Annulable à tout moment.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 space-y-8">
        {/* Banners */}
        {showSuccess ? (
          <Banner kind="success">
            <strong>Bienvenue dans Civique Plein !</strong> Votre abonnement
            est actif. Bonne préparation.
          </Banner>
        ) : null}

        {errorCode ? (
          <Banner kind="error">{describeError(errorCode)}</Banner>
        ) : null}

        {fromContext === 'exam-quota' && !subscription.isPremium ? (
          <Banner kind="info">
            Vous avez atteint la limite hebdomadaire d&apos;examens blancs
            gratuits. Passez à Civique Plein pour continuer sans attendre.
          </Banner>
        ) : null}

        {/* Premium active — show status */}
        {subscription.isPremium ? (
          <SubscriptionStatus subscription={subscription} />
        ) : (
          <>
            {/* Quota usage if available and limit hit */}
            {quota && !quota.isPremium && quota.daily.used >= quota.daily.limit ? (
              <QuotaPaywall
                type="daily"
                used={quota.daily.used}
                limit={quota.daily.limit}
                resetsAt={quota.daily.resetsAt}
              />
            ) : null}
            {quota && !quota.isPremium && quota.weekly.used >= quota.weekly.limit ? (
              <QuotaPaywall
                type="weekly"
                used={quota.weekly.used}
                limit={quota.weekly.limit}
                resetsAt={quota.weekly.resetsAt}
              />
            ) : null}

            {/* Free quota summary (if user is below limit) */}
            {quota &&
            !quota.isPremium &&
            quota.daily.used < quota.daily.limit &&
            quota.weekly.used < quota.weekly.limit ? (
              <FreeQuotaSummary
                dailyUsed={quota.daily.used}
                dailyLimit={quota.daily.limit}
                weeklyUsed={quota.weekly.used}
                weeklyLimit={quota.weekly.limit}
              />
            ) : null}

            {/* Plans */}
            <section id="offers" className="scroll-mt-8">
              <header className="mb-6">
                <p className="eyebrow mb-2">— Choisissez votre formule</p>
                <h2
                  className="font-display text-3xl sm:text-4xl font-medium tracking-tight"
                  style={{ fontVariationSettings: "'opsz' 60" }}
                >
                  Trois formules,<br className="sm:hidden" />{' '}
                  <span className="display-italic text-terracotta">votre rythme</span>.
                </h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <PlanCard
                  plan="weekly"
                  name="Hebdomadaire"
                  price="3,99 €"
                  period="/ semaine"
                  detail="Renouvellement automatique chaque semaine. Idéal pour un examen imminent."
                  features={COMMON_FEATURES}
                />
                <PlanCard
                  plan="monthly"
                  name="Mensuel"
                  price="10,99 €"
                  period="/ mois"
                  detail="Renouvellement automatique chaque mois. La formule la plus choisie."
                  badge="Populaire"
                  features={COMMON_FEATURES}
                  highlight
                />
                <PlanCard
                  plan="semiannual"
                  name="6 mois"
                  price="39,99 €"
                  period="/ 6 mois"
                  detail="Renouvellement automatique tous les 6 mois. Économisez 39 % sur la durée."
                  badge="Meilleure offre"
                  features={COMMON_FEATURES}
                />
              </div>

              <p className="text-xs text-ink-mute mt-5 leading-relaxed max-w-3xl">
                Le paiement est sécurisé par Stripe. Les trois formules
                (hebdomadaire, mensuelle et 6 mois) se{' '}
                <strong>renouvellent automatiquement</strong> à la fin de
                chaque période. Vous pouvez résilier à tout moment depuis
                l&apos;e-mail de confirmation Stripe ou en nous écrivant à
                support@integrafle.fr.
              </p>
            </section>

            {/* Promo code */}
            <section className="card !rounded-3xl !p-7 sm:!p-9">
              <header className="mb-5">
                <p className="eyebrow mb-2">— Code promo</p>
                <h2
                  className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
                  style={{ fontVariationSettings: "'opsz' 60" }}
                >
                  Vous avez un <span className="display-italic text-terracotta">code</span> ?
                </h2>
                <p className="text-sm text-ink-mute mt-2 leading-relaxed">
                  Saisissez votre code promotionnel pour activer immédiatement
                  votre accès Premium.
                </p>
              </header>
              <PromoCodeForm />
            </section>
          </>
        )}

        {/* Legal */}
        <section className="text-xs text-ink-mute leading-relaxed max-w-3xl">
          <p>
            Le paiement sera débité via Stripe à la confirmation d&apos;achat.
            Pour les formules à renouvellement automatique, la résiliation
            doit se faire au moins 24 heures avant la fin de la période en
            cours. Consultez notre{' '}
            <Link
              href="/privacy"
              className="underline-wavy text-terracotta hover:text-aubergine"
            >
              politique de confidentialité
            </Link>{' '}
            et nos{' '}
            <Link
              href="/terms"
              className="underline-wavy text-terracotta hover:text-aubergine"
            >
              conditions d&apos;utilisation
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

function describeError(code: string): string {
  switch (code) {
    case 'invalid-plan':
      return "Formule invalide. Veuillez sélectionner une offre dans la liste.";
    case 'unavailable':
      return "Le paiement n'est pas configuré pour le moment. Réessayez plus tard.";
    case 'checkout-failed':
      return "Impossible d'ouvrir la page de paiement. Réessayez dans un instant.";
    default:
      return "Une erreur est survenue. Veuillez réessayer.";
  }
}

function Banner({
  kind,
  children,
}: {
  kind: 'success' | 'error' | 'info';
  children: React.ReactNode;
}) {
  const cls = {
    success:
      'bg-success-bg/60 border-success/40 text-aubergine',
    error: 'bg-error-bg border-fr-red/40 text-fr-red',
    info: 'bg-saffron/10 border-saffron/40 text-aubergine',
  }[kind];
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={`rounded-2xl border-[1.5px] px-5 py-4 text-sm leading-relaxed ${cls}`}
    >
      {children}
    </div>
  );
}

function FreeQuotaSummary({
  dailyUsed,
  dailyLimit,
  weeklyUsed,
  weeklyLimit,
}: {
  dailyUsed: number;
  dailyLimit: number;
  weeklyUsed: number;
  weeklyLimit: number;
}) {
  return (
    <section className="card !rounded-3xl !p-6 sm:!p-7 bg-bone-deep/40">
      <p className="eyebrow mb-3">— Votre quota gratuit</p>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <QuotaTile
          label="Aujourd'hui"
          used={dailyUsed}
          limit={dailyLimit}
          unit="questions"
        />
        <QuotaTile
          label="Cette semaine"
          used={weeklyUsed}
          limit={weeklyLimit}
          unit="examens blancs"
        />
      </div>
    </section>
  );
}

function QuotaTile({
  label,
  used,
  limit,
  unit,
}: {
  label: string;
  used: number;
  limit: number;
  unit: string;
}) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return (
    <div>
      <p className="text-xs text-ink-mute font-display italic mb-1">— {label}</p>
      <p
        className="font-display text-2xl sm:text-3xl font-medium"
        style={{ fontVariationSettings: "'opsz' 32" }}
      >
        {used} <span className="text-ink-mute">/ {limit}</span>
      </p>
      <p className="text-xs text-ink-mute mt-0.5">{unit}</p>
      <div className="relative h-1.5 mt-3 rounded-full bg-aubergine/10 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-terracotta transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
