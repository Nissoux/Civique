import Link from 'next/link';
import type { LeaderboardPeriod } from '@/lib/server/social';

const PERIODS: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'all', label: 'Tout' },
];

interface PeriodTabsProps {
  active: LeaderboardPeriod;
  basePath: string;
}

/**
 * Server-rendered period switcher — each tab is a Link that updates a
 * `?period=` query param. This avoids needing client state for a simple
 * navigation control.
 */
export function PeriodTabs({ active, basePath }: PeriodTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Période du classement"
      className="inline-flex p-1 rounded-2xl bg-bone-deep border border-aubergine/15"
    >
      {PERIODS.map((p) => {
        const isActive = p.value === active;
        const href =
          p.value === 'all' ? basePath : `${basePath}?period=${p.value}`;
        return (
          <Link
            key={p.value}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={`
              px-4 sm:px-5 py-1.5 rounded-xl text-sm font-semibold
              transition-all
              ${
                isActive
                  ? 'bg-aubergine text-bone shadow-[0_2px_0_rgb(74_45_67)]'
                  : 'text-aubergine hover:bg-bone'
              }
            `}
          >
            {p.label}
          </Link>
        );
      })}
    </div>
  );
}
