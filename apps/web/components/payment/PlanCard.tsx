import { startCheckoutAction } from '@/lib/actions/payments';
import type { SubscriptionPlan } from '@/lib/server/payments';

interface PlanCardProps {
  plan: SubscriptionPlan;
  name: string;
  price: string;
  period: string;
  /** Optional fine-print, e.g. "facturé en une fois". */
  detail?: string;
  /** "Populaire" / "Meilleure offre" — shown as a small ribbon. */
  badge?: string;
  features: string[];
  /** Highlight = primary terracotta border. */
  highlight?: boolean;
}

export function PlanCard({
  plan,
  name,
  price,
  period,
  detail,
  badge,
  features,
  highlight = false,
}: PlanCardProps) {
  return (
    <article
      className={`
        relative card !rounded-3xl !p-7 sm:!p-8 flex flex-col gap-5
        ${highlight ? 'ring-2 ring-terracotta border-terracotta' : ''}
      `}
    >
      {badge ? (
        <span
          className="
            absolute -top-3 right-6
            rounded-full bg-terracotta text-bone
            px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider
            shadow-[0_2px_0_rgb(45_27_46)]
          "
        >
          {badge}
        </span>
      ) : null}

      <header>
        <p className="eyebrow mb-2">— {name}</p>
        <div className="flex items-baseline gap-2">
          <span
            className="font-display text-5xl font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            {price}
          </span>
          <span className="text-ink-mute font-display italic text-lg">
            {period}
          </span>
        </div>
        {detail ? (
          <p className="mt-2 text-sm text-ink-mute leading-relaxed">{detail}</p>
        ) : null}
      </header>

      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed">
            <svg
              aria-hidden
              className="h-5 w-5 shrink-0 text-success mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <form action={startCheckoutAction}>
        <input type="hidden" name="plan" value={plan} />
        <button
          type="submit"
          className={`w-full !justify-center ${highlight ? 'btn-primary' : 'btn-secondary'}`}
        >
          Choisir cette offre
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
        </button>
      </form>
    </article>
  );
}
