import Link from 'next/link';
import type {
  ExamResultsResponse,
  ThemeBreakdownItem,
  WrongAnswerItem,
} from '@/lib/server/exams';

interface Props {
  results: ExamResultsResponse;
}

const PASS_THRESHOLD_RATIO = 0.8;

/**
 * Server Component — renders the final exam breakdown.
 * No client interaction beyond standard <Link> navigation.
 */
export function ExamResults({ results }: Props) {
  const session = results.session;
  const themeBreakdown = results.themeBreakdown ?? [];
  const wrongAnswers = results.wrongAnswers ?? [];

  const score = session.score ?? 0;
  const total = session.totalQuestions || 40;
  const passThreshold = Math.ceil(total * PASS_THRESHOLD_RATIO);
  const passed = session.passed ?? score >= passThreshold;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const startedAt = session.startedAt
    ? new Date(session.startedAt).getTime()
    : null;
  const finishedAt = session.finishedAt
    ? new Date(session.finishedAt).getTime()
    : null;
  const elapsedMs =
    startedAt && finishedAt && finishedAt >= startedAt
      ? finishedAt - startedAt
      : null;

  return (
    <div className="min-h-screen bg-bone">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <ResultHeader passed={passed} />

        <ScoreCard
          score={score}
          total={total}
          passed={passed}
          percentage={percentage}
          passThreshold={passThreshold}
          elapsedMs={elapsedMs}
        />

        {themeBreakdown.length > 0 ? (
          <ThemeBreakdownCard breakdown={themeBreakdown} />
        ) : null}

        {wrongAnswers.length > 0 ? (
          <WrongAnswersCard wrongAnswers={wrongAnswers} />
        ) : null}

        <ActionButtons />
      </div>
    </div>
  );
}

function ResultHeader({ passed }: { passed: boolean }) {
  return (
    <div className="text-center mb-8">
      <p className="eyebrow mb-3">— Résultats</p>
      <h1
        className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-medium tracking-tight"
        style={{ fontVariationSettings: "'opsz' 96" }}
      >
        {passed ? (
          <>
            <span>Examen </span>
            <span className="display-italic text-terracotta">réussi.</span>
          </>
        ) : (
          <>
            <span>Continuez vos </span>
            <span className="display-italic text-terracotta">efforts.</span>
          </>
        )}
      </h1>
      <p className="text-ink-mute leading-relaxed mt-3">
        {passed
          ? "Vous avez atteint le seuil de réussite de l'examen blanc."
          : "Vous n'avez pas atteint le seuil de réussite. Réessayez quand vous voulez."}
      </p>
    </div>
  );
}

function ScoreCard({
  score,
  total,
  passed,
  percentage,
  passThreshold,
  elapsedMs,
}: {
  score: number;
  total: number;
  passed: boolean;
  percentage: number;
  passThreshold: number;
  elapsedMs: number | null;
}) {
  const ringColor = passed ? '#3F8C5A' : '#ED2939'; // success / fr-red
  return (
    <div className="card !rounded-3xl !p-7 sm:!p-9 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-7">
        <div
          className="
            relative inline-flex flex-col items-center justify-center
            h-36 w-36 rounded-full text-bone
            shadow-[0_4px_0_rgb(45_27_46)]
          "
          style={{ backgroundColor: ringColor }}
          role="img"
          aria-label={`Score : ${percentage} pourcent`}
        >
          <span
            className="font-display text-5xl font-medium leading-none"
            style={{ fontVariationSettings: "'opsz' 144" }}
          >
            {percentage}
          </span>
          <span className="text-xs opacity-80 mt-1">%</span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="font-display text-3xl font-medium mb-1">
            {score} / {total}
          </p>
          <p className="text-sm text-ink-mute">
            bonnes réponses
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-bone-deep border border-aubergine/15 px-3 py-1.5">
            <svg
              className={`h-4 w-4 ${passed ? 'text-success' : 'text-fr-red'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
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
            <span className="text-xs font-medium text-aubergine">
              Seuil : {passThreshold}/{total} (80 %)
            </span>
          </div>

          {elapsedMs !== null ? (
            <p className="mt-3 text-xs text-ink-mute">
              Temps : <span className="font-medium text-aubergine">
                {formatDuration(elapsedMs)}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ThemeBreakdownCard({
  breakdown,
}: {
  breakdown: ThemeBreakdownItem[];
}) {
  return (
    <div className="card !rounded-3xl !p-6 sm:!p-8 mb-6">
      <p className="eyebrow mb-3">— Par thème</p>
      <h2
        className="font-display text-2xl font-medium mb-5"
        style={{ fontVariationSettings: "'opsz' 36" }}
      >
        Détail par <span className="display-italic">thème</span>
      </h2>
      <div className="flex flex-col gap-4">
        {breakdown.map((theme) => {
          const pct =
            theme.total > 0
              ? Math.round((theme.correct / theme.total) * 100)
              : 0;
          const tone =
            pct >= 80
              ? 'bg-success'
              : pct >= 60
              ? 'bg-saffron'
              : 'bg-fr-red';
          return (
            <div key={theme.themeId}>
              <div className="flex items-baseline justify-between mb-2 gap-3">
                <p className="text-sm sm:text-base font-medium text-aubergine truncate">
                  {theme.themeName}
                </p>
                <p className="text-sm font-display tabular-nums text-ink-mute shrink-0">
                  <span className="text-aubergine font-medium">
                    {theme.correct}
                  </span>
                  /{theme.total}
                </p>
              </div>
              <div className="relative h-2 rounded-full bg-bone-deep border border-aubergine/15 overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 ${tone} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WrongAnswersCard({
  wrongAnswers,
}: {
  wrongAnswers: WrongAnswerItem[];
}) {
  return (
    <div className="card !rounded-3xl !p-6 sm:!p-8 mb-6">
      <p className="eyebrow mb-3">— Révisions</p>
      <h2
        className="font-display text-2xl font-medium mb-5"
        style={{ fontVariationSettings: "'opsz' 36" }}
      >
        Réponses{' '}
        <span className="display-italic text-fr-red">incorrectes</span> (
        {wrongAnswers.length})
      </h2>
      <div className="flex flex-col gap-4">
        {wrongAnswers.map((wa, idx) => {
          const correctText =
            wa.correctChoiceText ??
            (Array.isArray(wa.choices)
              ? wa.choices.find((c) => c.id === wa.correctChoice)?.text
              : undefined);
          return (
            <div
              key={`${wa.questionId}-${idx}`}
              className="
                rounded-2xl border-[1.5px] border-aubergine/15 bg-bone-deep
                px-4 sm:px-5 py-4
              "
            >
              <p className="text-sm sm:text-base text-aubergine leading-relaxed mb-3">
                {wa.questionText}
              </p>
              <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
                {wa.selectedChoice ? (
                  <p className="flex items-start gap-2 text-fr-red">
                    <span className="font-medium shrink-0">Votre réponse :</span>
                    <span>{String(wa.selectedChoice).toUpperCase()}</span>
                  </p>
                ) : (
                  <p className="flex items-start gap-2 text-ink-mute italic">
                    Aucune réponse
                  </p>
                )}
                <p className="flex items-start gap-2 text-success">
                  <span className="font-medium shrink-0">Bonne réponse :</span>
                  <span>
                    {String(wa.correctChoice).toUpperCase()}
                    {correctText ? ` — ${correctText}` : null}
                  </span>
                </p>
                {wa.explanation ? (
                  <p className="mt-2 text-ink-mute italic leading-relaxed">
                    {wa.explanation}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href="/app/exams"
        className="btn-primary !justify-center sm:flex-1"
      >
        Refaire un examen
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </Link>
      <Link href="/app" className="btn-secondary !justify-center sm:flex-1">
        Retour au tableau de bord
      </Link>
    </div>
  );
}

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s} s`;
  return `${m} min ${s.toString().padStart(2, '0')} s`;
}
