'use client';

import { useEffect, useState, useTransition } from 'react';
import { THEMES } from '@civique/shared';
import { useProgressionStore } from '@/lib/stores/progressionStore';
import { fetchStatsHistoryAction } from '@/lib/actions/stats';
import type {
  StatsOverview,
  ThemeStat,
  WeakArea,
  HistoryEntry,
  StatsPeriod,
} from '@/lib/server/stats';

const PERIOD_LABELS: Record<StatsPeriod, string> = {
  week: 'Semaine',
  month: 'Mois',
  all: 'Tout',
};

interface StatsClientProps {
  overview: StatsOverview | null;
  themeStats: ThemeStat[];
  weakAreas: WeakArea[];
  initialHistory: HistoryEntry[];
}

export function StatsClient({
  overview,
  themeStats,
  weakAreas,
  initialHistory,
}: StatsClientProps) {
  const [period, setPeriod] = useState<StatsPeriod>('week');
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [pending, startTransition] = useTransition();

  const passRate =
    overview && overview.examsTaken > 0
      ? Math.round((overview.examsPassed / overview.examsTaken) * 100)
      : 0;

  const handlePeriodChange = (next: StatsPeriod) => {
    if (next === period) return;
    setPeriod(next);
    startTransition(async () => {
      const res = await fetchStatsHistoryAction(next);
      if (res.ok && res.entries) setHistory(res.entries);
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-aubergine text-bone overflow-hidden border-b-[1.5px] border-aubergine">
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-saffron/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-terracotta/25 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-10 sm:py-12">
          <p className="font-display italic text-saffron text-base mb-1">
            — Votre parcours
          </p>
          <h1
            className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-tight mb-7"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            <span className="display-italic text-terracotta">Statistiques</span>{' '}
            et progression.
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            <HeroStat
              label="Précision"
              value={
                overview?.overallAccuracy !== undefined
                  ? `${Math.round(overview.overallAccuracy)}%`
                  : '—'
              }
              accent="saffron"
            />
            <HeroStat
              label="Pratiquées"
              value={overview?.totalPracticed?.toString() ?? '0'}
              accent="terracotta"
            />
            <HeroStat
              label="Série"
              value={`${overview?.currentStreak ?? 0}j`}
              accent="teal"
            />
            <HeroStat
              label="Réussite"
              value={`${passRate}%`}
              accent="saffron"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-8">
        <ProgressionXPSection />

        {/* Par thème */}
        <section className="card !rounded-2xl p-6 sm:p-8">
          <header className="mb-5">
            <p className="eyebrow mb-2">— Par thème</p>
            <h2
              className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              Précision par <span className="display-italic text-terracotta">thématique</span>
            </h2>
          </header>

          {themeStats.length === 0 ? (
            <p className="text-sm text-ink-mute italic py-6 text-center">
              Commencez à vous entraîner pour voir vos statistiques.
            </p>
          ) : (
            <ul className="space-y-4">
              {themeStats.map((ts) => (
                <ThemeBar key={ts.themeId} stat={ts} />
              ))}
            </ul>
          )}
        </section>

        {/* Points faibles */}
        {weakAreas.length > 0 ? (
          <section className="card !rounded-2xl p-6 sm:p-8">
            <header className="mb-5">
              <p className="eyebrow mb-2">— À renforcer</p>
              <h2
                className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
                style={{ fontVariationSettings: "'opsz' 60" }}
              >
                Points <span className="display-italic text-fr-red">faibles</span>
              </h2>
              <p className="text-sm text-ink-mute mt-1">
                Thèmes en dessous de 70 % de précision.
              </p>
            </header>
            <ul className="divide-y divide-aubergine/10">
              {weakAreas.map((wa) => (
                <li
                  key={wa.themeId}
                  className="flex items-center gap-4 py-3.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fr-red/10 text-fr-red">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                  <p className="flex-1 text-sm font-medium text-aubergine truncate">
                    {wa.themeName}
                  </p>
                  <span className="text-sm font-bold text-fr-red tabular-nums">
                    {Math.round(wa.accuracy)}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Activité récente */}
        <section className="card !rounded-2xl p-6 sm:p-8">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">— Activité récente</p>
              <h2
                className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
                style={{ fontVariationSettings: "'opsz' 60" }}
              >
                Vos <span className="display-italic text-terracotta">jours</span> d'entraînement
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Période"
              className="inline-flex rounded-full bg-bone-deep border border-aubergine/20 p-1 shrink-0"
            >
              {(Object.keys(PERIOD_LABELS) as StatsPeriod[]).map((p) => {
                const active = p === period;
                return (
                  <button
                    key={p}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handlePeriodChange(p)}
                    disabled={pending}
                    className={`
                      px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                      disabled:opacity-60
                      ${
                        active
                          ? 'bg-aubergine text-bone shadow-[0_2px_0_rgb(74_45_67)]'
                          : 'text-aubergine hover:bg-bone'
                      }
                    `}
                  >
                    {PERIOD_LABELS[p]}
                  </button>
                );
              })}
            </div>
          </header>

          <ActivityChart history={history} loading={pending} />
        </section>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function HeroStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'saffron' | 'terracotta' | 'teal';
}) {
  const cls = {
    saffron: 'text-saffron',
    terracotta: 'text-terracotta',
    teal: 'text-teal',
  }[accent];
  return (
    <div className="bg-bone/5 backdrop-blur rounded-2xl border border-bone/15 px-4 py-3 sm:px-5 sm:py-4">
      <p
        className={`font-display text-2xl sm:text-3xl font-medium ${cls}`}
        style={{ fontVariationSettings: "'opsz' 60" }}
      >
        {value}
      </p>
      <p className="text-[0.65rem] sm:text-xs text-bone/60 uppercase tracking-wider mt-1">
        {label}
      </p>
    </div>
  );
}

function ThemeBar({ stat }: { stat: ThemeStat }) {
  const pct = Math.min(100, Math.max(0, stat.accuracy));
  const tone =
    pct >= 80
      ? 'bg-success'
      : pct >= 60
      ? 'bg-saffron'
      : 'bg-terracotta';
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <p className="text-sm font-medium text-aubergine truncate">
          {stat.themeName}
        </p>
        <p className="text-xs text-ink-mute shrink-0">
          <span className="font-bold text-aubergine tabular-nums">
            {Math.round(pct)}%
          </span>{' '}
          · {stat.correctAnswers}/{stat.totalAnswered}
        </p>
      </div>
      <div className="h-2.5 rounded-full bg-bone-deep border border-aubergine/15 overflow-hidden">
        <div
          className={`h-full ${tone} transition-[width] duration-700 ease-out`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </li>
  );
}

function ActivityChart({
  history,
  loading,
}: {
  history: HistoryEntry[];
  loading: boolean;
}) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-ink-mute italic py-6 text-center">
        Aucune activité pour cette période.
      </p>
    );
  }

  // Sort chronologically (API may return descending). Latest day on the right.
  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const max = Math.max(1, ...sorted.map((h) => h.totalAnswered));

  return (
    <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
      {/* Bars */}
      <div className="flex items-end gap-1.5 sm:gap-2 h-44 px-1">
        {sorted.map((entry) => {
          const heightPct = (entry.totalAnswered / max) * 100;
          const accuracy =
            entry.totalAnswered > 0
              ? Math.round((entry.correctAnswers / entry.totalAnswered) * 100)
              : 0;
          const tone =
            accuracy >= 80
              ? 'bg-success'
              : accuracy >= 60
              ? 'bg-saffron'
              : entry.totalAnswered === 0
              ? 'bg-bone-deep'
              : 'bg-terracotta';
          const dateLabel = new Date(entry.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
          });
          return (
            <div
              key={entry.date}
              className="group relative flex-1 flex flex-col items-center justify-end h-full min-w-0"
              title={`${dateLabel} — ${entry.totalAnswered} questions · ${accuracy}%`}
            >
              {entry.totalAnswered > 0 ? (
                <div
                  className={`w-full rounded-t-md ${tone} transition-all`}
                  style={{ height: `${Math.max(4, heightPct)}%` }}
                  role="img"
                  aria-label={`${dateLabel}, ${entry.totalAnswered} questions, ${accuracy}% précision`}
                />
              ) : (
                <div
                  className="w-full rounded-t-md bg-bone-deep border border-aubergine/15 h-1"
                  aria-label={`${dateLabel}, aucune activité`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* X-axis labels (show first / mid / last to avoid clutter) */}
      <div className="flex justify-between mt-3 text-[0.65rem] text-ink-mute font-display italic">
        <span>
          {new Date(sorted[0].date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
        {sorted.length > 2 ? (
          <span>
            {new Date(
              sorted[Math.floor(sorted.length / 2)].date,
            ).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        ) : null}
        <span>
          {new Date(sorted[sorted.length - 1].date).toLocaleDateString(
            'fr-FR',
            { day: 'numeric', month: 'short' },
          )}
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-xs text-ink-mute">
        <LegendDot tone="bg-success" label="≥ 80 %" />
        <LegendDot tone="bg-saffron" label="60 – 79 %" />
        <LegendDot tone="bg-terracotta" label="< 60 %" />
      </div>
    </div>
  );
}

function LegendDot({ tone, label }: { tone: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${tone}`} />
      {label}
    </span>
  );
}

// ── Local progression (XP + crowns from localStorage) ─────

function ProgressionXPSection() {
  const [hydrated, setHydrated] = useState(false);
  const xp = useProgressionStore((s) => s.xp);
  const streak = useProgressionStore((s) => s.streak);
  const loaded = useProgressionStore((s) => s.loaded);
  const loadProgress = useProgressionStore((s) => s.loadProgress);
  const getThemeCrowns = useProgressionStore((s) => s.getThemeCrowns);

  useEffect(() => {
    if (!loaded) loadProgress();
    setHydrated(true);
  }, [loaded, loadProgress]);

  // Default to 5 levels per theme — same convention as the dashboard.
  const LEVELS_PER_THEME = 5;

  if (!hydrated) {
    // SSR / pre-hydration placeholder (avoids layout shift)
    return (
      <section className="card-deep !rounded-2xl p-6 sm:p-8 opacity-0">
        <div className="h-32" />
      </section>
    );
  }

  let earnedAll = 0;
  let totalAll = 0;
  const perTheme = THEMES.map((t) => {
    const c = getThemeCrowns(t.id, LEVELS_PER_THEME);
    earnedAll += c.earned;
    totalAll += c.total;
    return { theme: t, ...c };
  });

  return (
    <section className="card-deep !rounded-2xl p-6 sm:p-8">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">— Récompenses</p>
          <h2
            className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            XP et <span className="display-italic text-terracotta">couronnes</span>
          </h2>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <MiniStat
          label="Points XP"
          value={xp.toLocaleString('fr-FR')}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <MiniStat
          label="Couronnes"
          value={`${earnedAll} / ${totalAll}`}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11M5 16h14M5 16l1 4h12l1-4" />
            </svg>
          }
        />
        <MiniStat
          label="Série locale"
          value={`${streak}j`}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.24 17 7.07A6 6 0 0119 11c0 2-1 3-1 3" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {perTheme.map(({ theme, earned, total }) => (
          <div
            key={theme.id}
            className="rounded-xl border border-aubergine/15 bg-bone px-4 py-3"
          >
            <p className="text-xs text-ink-mute font-display italic truncate mb-1">
              — {theme.nameFr}
            </p>
            <p className="text-sm font-bold text-aubergine">
              <span className="text-saffron">★</span> {earned}/{total}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border-[1.5px] border-aubergine/20 bg-bone px-4 py-3 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta text-bone">
        {icon}
      </span>
      <div className="min-w-0">
        <p
          className="font-display text-xl font-medium text-aubergine truncate"
          style={{ fontVariationSettings: "'opsz' 32" }}
        >
          {value}
        </p>
        <p className="text-[0.65rem] text-ink-mute uppercase tracking-wider truncate">
          {label}
        </p>
      </div>
    </div>
  );
}
