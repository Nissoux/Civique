import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ExamSession } from '@civique/shared';
import {
  getCurrentExamType,
  getExamTypeDefinition,
} from '@/lib/server/examType';
import { getExamHistory } from '@/lib/server/exams';
import { startExamFormAction } from '@/lib/actions/exams';

const PASS_THRESHOLD_RATIO = 0.8;

interface ExamsPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  const examType = await getCurrentExamType();
  if (!examType) redirect('/onboarding/exam-type');
  const examDef = getExamTypeDefinition(examType);

  const sp = await searchParams;
  const errorMessage =
    sp.error === 'start'
      ? "Impossible de démarrer l'examen. Réessayez."
      : null;

  // Best-effort history fetch — page still works if it fails.
  const history = await getExamHistory(20).catch(() => null);
  const all: ExamSession[] = history?.data ?? [];
  const finished = all.filter((s) => s.finishedAt);
  const active = all.find((s) => !s.finishedAt) ?? null;

  return (
    <div className="min-h-screen bg-bone">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <Hero examLabel={examDef?.shortLabel ?? 'Civique'} />

        {errorMessage ? (
          <p
            role="alert"
            className="mb-6 rounded-2xl bg-error-bg border border-fr-red/30 px-4 py-3 text-sm text-fr-red font-medium"
          >
            {errorMessage}
          </p>
        ) : null}

        <ExplanationCard active={active} />

        {finished.length > 0 ? (
          <HistorySection sessions={finished} />
        ) : (
          <EmptyHistory />
        )}
      </div>
    </div>
  );
}

function Hero({ examLabel }: { examLabel: string }) {
  return (
    <header className="mb-8">
      <p className="eyebrow mb-3">— Examen blanc</p>
      <h1
        className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-medium tracking-tight"
        style={{ fontVariationSettings: "'opsz' 96" }}
      >
        Simulez l'examen{' '}
        <span className="display-italic text-terracotta">{examLabel}</span>.
      </h1>
      <p className="mt-3 text-ink-mute leading-relaxed max-w-2xl">
        Quarante questions, quarante-cinq minutes, comme le jour J. Connaissances
        et mises en situation, tirées au hasard sur les cinq thèmes du programme.
      </p>
    </header>
  );
}

function ExplanationCard({ active }: { active: ExamSession | null }) {
  return (
    <section className="card !rounded-3xl !p-6 sm:!p-8 mb-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <Stat label="Questions" value="40" />
        <Stat label="Durée" value="45 min" />
        <Stat label="Réussite" value="80 %" accent="terracotta" />
      </div>

      <div className="rounded-2xl bg-bone-deep border border-aubergine/15 px-4 py-3 mb-6 flex items-start gap-3">
        <svg
          className="h-5 w-5 shrink-0 text-fr-blue mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-aubergine leading-relaxed">
          Seuil de réussite : <strong>32 / 40</strong> bonnes réponses.
          L'examen démarre dès que vous appuyez sur le bouton — le chrono court.
        </p>
      </div>

      {active ? (
        <ResumeBlock active={active} />
      ) : (
        <form action={startExamFormAction}>
          <button
            type="submit"
            className="btn-primary w-full !justify-center !text-lg !py-4"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Lancer un examen blanc
          </button>
        </form>
      )}
    </section>
  );
}

function ResumeBlock({ active }: { active: ExamSession }) {
  const startedAt = active.startedAt
    ? new Date(active.startedAt).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;
  return (
    <div className="rounded-2xl bg-saffron/15 border-[1.5px] border-saffron px-4 py-4 sm:p-5">
      <div className="flex items-start gap-3 mb-4">
        <span
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
            bg-saffron text-aubergine font-display font-medium
          "
          aria-hidden
        >
          !
        </span>
        <div>
          <p className="font-display text-lg font-medium text-aubergine">
            Examen en cours
          </p>
          <p className="text-sm text-ink-mute mt-0.5">
            Démarré {startedAt ? `le ${startedAt}` : 'récemment'}.
            Reprenez là où vous en étiez ou abandonnez pour en lancer un nouveau.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/app/exams/session/${active.id}`}
          className="btn-primary !justify-center sm:flex-1"
        >
          Reprendre l'examen
        </Link>
        <form action={startExamFormAction} className="sm:flex-1">
          <button
            type="submit"
            className="btn-secondary !justify-center w-full"
          >
            Lancer un nouveau
          </button>
        </form>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: 'terracotta';
}) {
  const valueColor = accent === 'terracotta' ? 'text-terracotta' : 'text-aubergine';
  return (
    <div className="rounded-2xl bg-bone-deep border border-aubergine/15 px-2 py-3 sm:px-3 sm:py-4 text-center">
      <p
        className={`font-display text-xl sm:text-3xl font-medium ${valueColor} leading-tight`}
        style={{ fontVariationSettings: "'opsz' 60" }}
      >
        {value}
      </p>
      <p className="text-[0.6rem] sm:text-[0.7rem] uppercase tracking-wider text-ink-mute mt-1 truncate">
        {label}
      </p>
    </div>
  );
}

function HistorySection({ sessions }: { sessions: ExamSession[] }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-5 gap-3 flex-wrap">
        <h2
          className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
          style={{ fontVariationSettings: "'opsz' 48" }}
        >
          Vos <span className="display-italic">examens passés</span>
        </h2>
        <p className="text-sm text-ink-mute">{sessions.length} session{sessions.length > 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col gap-3">
        {sessions.map((s) => (
          <HistoryItem key={s.id} session={s} />
        ))}
      </div>
    </section>
  );
}

function HistoryItem({ session }: { session: ExamSession }) {
  const score = session.score ?? 0;
  const total = session.totalQuestions || 40;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = session.passed ?? score >= Math.ceil(total * PASS_THRESHOLD_RATIO);
  const dateStr = session.finishedAt
    ? new Date(session.finishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <Link
      href={`/app/exams/results/${session.id}`}
      className="
        card !rounded-2xl !p-4 sm:!p-5 flex items-center gap-3 sm:gap-4
        transition-all hover:-translate-y-0.5 hover:shadow-clay-lg
      "
    >
      <div
        className={`
          flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl
          ${passed ? 'bg-success/15 text-success' : 'bg-fr-red/15 text-fr-red'}
        `}
        aria-hidden
      >
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {passed ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          )}
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display text-lg sm:text-xl font-medium text-aubergine">
          {score} / {total}
        </p>
        <p className="text-xs sm:text-sm text-ink-mute truncate">
          {pct} % · {dateStr}
        </p>
      </div>

      <span
        className={`
          pill !text-[0.65rem] sm:!text-xs !font-medium shrink-0 !px-2.5 !py-1
          ${
            passed
              ? '!bg-success/15 !text-success !border-success/40'
              : '!bg-fr-red/10 !text-fr-red !border-fr-red/40'
          }
        `}
      >
        {passed ? 'Réussi' : 'Échoué'}
      </span>

      <svg
        className="h-5 w-5 shrink-0 text-aubergine/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}

function EmptyHistory() {
  return (
    <section className="card !rounded-3xl !p-7 sm:!p-9 text-center">
      <p className="eyebrow mb-3">— Historique</p>
      <p className="font-display text-2xl font-medium mb-2">
        Pas encore <span className="display-italic text-terracotta">d'examen passé</span>.
      </p>
      <p className="text-ink-mute leading-relaxed">
        Vos résultats apparaîtront ici une fois votre premier examen terminé.
      </p>
    </section>
  );
}
