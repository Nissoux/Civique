import Link from 'next/link';
import { THEMES } from '@civique/shared';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentExamType, getExamTypeDefinition } from '@/lib/server/examType';
import { getThemeQuestionCount } from '@/lib/server/questions';
import { getStatsOverview } from '@/lib/server/stats';
import { ThemePathsClient } from './ThemePathsClient';

export default async function AppPage() {
  const user = (await getCurrentUser())!; // layout guarantees non-null
  const examType = (await getCurrentExamType())!; // layout guarantees set
  const examDef = getExamTypeDefinition(examType);

  // Parallel fetch question counts for all themes + stats overview
  const [counts, stats] = await Promise.all([
    Promise.all(
      THEMES.map(async (t) => ({
        themeId: t.id,
        total: await getThemeQuestionCount(t.id, examType),
      })),
    ),
    getStatsOverview(examType).catch(() => null),
  ]);

  const countByTheme: Record<number, number> = {};
  counts.forEach((c) => {
    countByTheme[c.themeId] = c.total;
  });

  const firstName = user.displayName.split(' ')[0];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="
          relative bg-aubergine text-bone overflow-hidden
          border-b-[1.5px] border-aubergine
        "
      >
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-terracotta/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-saffron/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-10 py-8 sm:py-12">
          <div className="flex items-start justify-between gap-4 mb-7 flex-wrap">
            <div className="min-w-0">
              <p className="font-display italic text-saffron text-base mb-1">
                — {greeting()}, {firstName}
              </p>
              <h1
                className="font-display text-[clamp(1.875rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-tight"
                style={{ fontVariationSettings: "'opsz' 96" }}
              >
                Continuez votre <span className="display-italic text-terracotta">parcours</span>.
              </h1>
            </div>
            {examDef ? (
              <Link
                // `?change=1` tells the exam-type page we're switching post-
                // onboarding, so it doesn't bounce us back to /app (which
                // is the correct first-run behaviour for users who already
                // have a choice set).
                href="/onboarding/exam-type?change=1"
                aria-label={`Examen ciblé : ${examDef.shortLabel}. Cliquez pour changer.`}
                className="
                  inline-flex items-center gap-2 sm:gap-3 rounded-full
                  bg-bone/10 hover:bg-bone/15 backdrop-blur
                  px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all
                  border border-bone/20 max-w-full
                "
              >
                <span aria-hidden>{examDef.emoji}</span>
                <span className="truncate">{examDef.shortLabel}</span>
                <svg className="h-4 w-4 opacity-60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : null}
          </div>

          {/* Stats row — server-side accuracy, local XP/streak hydrate client-side */}
          {(() => {
            const totalPracticed = stats?.totalPracticed ?? 0;
            const examsTaken = stats?.examsTaken ?? 0;
            const isNewUser = totalPracticed === 0 && examsTaken === 0;
            return (
              <>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-6 max-w-2xl">
                  <StatTile
                    label="Précision"
                    value={
                      stats?.overallAccuracy !== undefined
                        ? `${Math.round(stats.overallAccuracy)}%`
                        : '—'
                    }
                    accent="saffron"
                  />
                  <StatTile
                    label="Pratiquées"
                    value={totalPracticed.toString()}
                    accent="terracotta"
                  />
                  <StatTile
                    label="Examens"
                    value={`${stats?.examsPassed ?? 0}/${examsTaken}`}
                    accent="teal"
                  />
                </div>
                {isNewUser ? (
                  <p className="mt-4 text-xs sm:text-sm text-bone/60 font-display italic">
                    — Commencez par une session d'entraînement.
                  </p>
                ) : null}
              </>
            );
          })()}
        </div>
      </section>

      {/* Quick actions */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/app/train/random"
            className="
              card !rounded-2xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5
              transition-all hover:-translate-y-1 hover:shadow-clay-lg cursor-pointer
            "
          >
            <div
              className="
                flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
                bg-terracotta text-bone shadow-[0_2px_0_rgb(45_27_46)]
              "
              aria-hidden
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg sm:text-xl font-medium" style={{ fontVariationSettings: "'opsz' 32" }}>
                Entraînement rapide
              </h3>
              <p className="text-xs sm:text-sm text-ink-mute">10 questions au hasard, tous thèmes</p>
            </div>
            <ArrowIcon />
          </Link>

          <Link
            href="/app/exams"
            className="
              card !rounded-2xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5
              transition-all hover:-translate-y-1 hover:shadow-clay-lg cursor-pointer
            "
          >
            <div
              className="
                flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
                bg-fr-blue text-bone shadow-[0_2px_0_rgb(45_27_46)]
              "
              aria-hidden
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg sm:text-xl font-medium" style={{ fontVariationSettings: "'opsz' 32" }}>
                Examen blanc
              </h3>
              <p className="text-xs sm:text-sm text-ink-mute">40 questions, 45 minutes, simulation officielle</p>
            </div>
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* Theme paths (client component for progression hydration) */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-8 sm:py-12">
        <div className="mb-8">
          <p className="eyebrow mb-3">— Parcours d'apprentissage</p>
          <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight" style={{ fontVariationSettings: "'opsz' 60" }}>
            Cinq thèmes,<br className="sm:hidden" /> votre rythme.
          </h2>
        </div>
        <ThemePathsClient countByTheme={countByTheme} />
      </section>
    </div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

function StatTile({
  label,
  value,
  accent,
  dim = false,
}: {
  label: string;
  value: string;
  accent: 'saffron' | 'terracotta' | 'teal';
  dim?: boolean;
}) {
  const accentColor = {
    saffron: 'text-saffron',
    terracotta: 'text-terracotta',
    teal: 'text-teal',
  }[accent];
  return (
    <div
      className={`bg-bone/5 backdrop-blur rounded-2xl border border-bone/15 px-3 py-3 sm:px-5 sm:py-4 transition-opacity ${
        dim ? 'opacity-60' : ''
      }`}
    >
      <p className={`font-display text-xl sm:text-3xl font-medium ${accentColor} leading-tight`} style={{ fontVariationSettings: "'opsz' 60" }}>
        {value}
      </p>
      <p className="text-[0.6rem] sm:text-xs text-bone/60 uppercase tracking-wider mt-1 truncate">{label}</p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-aubergine/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
