'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { THEMES } from '@civique/shared';
import { shuffleChoices } from '@/lib/shuffleChoices';
import type {
  ChallengeQuestionRow,
  FinishChallengeResult,
} from '@/lib/server/social';
import {
  submitChallengeAnswerAction,
  finishChallengeAction,
} from '@/lib/actions/social';
import { Avatar } from './Avatar';

type ChoiceLabel = 'a' | 'b' | 'c' | 'd';
type Phase = 'question' | 'feedback' | 'submitting-finish' | 'finished';

interface OpponentInfo {
  displayName: string;
  avatarUrl?: string | null;
}

interface Props {
  challengeId: string;
  questions: ChallengeQuestionRow[];
  currentUserId: string;
  opponent: OpponentInfo;
  themeId?: number;
  themeNameFr?: string;
}

/**
 * State machine
 * ─────────────
 *   question        → user reads + picks a choice
 *   feedback        → after submitChallengeAnswerAction returns
 *                     shows correct/wrong + "Question suivante"
 *                     (or "Voir mes résultats" on the last question)
 *   submitting-finish → after the last "Suivante", we call finishChallengeAction
 *   finished        → renders the final scoreboard
 *
 * Note: the backend response for `/challenges/:id` does NOT include
 * `correctChoice`, `explanationFr`, or translations. We therefore only
 * highlight the user's selection with the result from /answer, without
 * revealing which of the other options was correct.
 */
export function ChallengePlay({
  challengeId,
  questions,
  currentUserId,
  opponent,
  themeId,
  themeNameFr,
}: Props) {
  // Filter to unanswered questions so the user only plays what remains.
  // If the user has already partially played, we resume on the first
  // unanswered question — server-side answered ones are skipped.
  const remaining = useMemo(
    () => questions.filter((q) => q.selectedChoice === null),
    [questions],
  );
  const alreadyAnswered = questions.length - remaining.length;

  const theme = useMemo(() => {
    const t = THEMES.find((x) => x.id === themeId);
    return (
      t ?? {
        id: themeId ?? 0,
        nameFr: themeNameFr ?? 'Défi',
        color: '#C7522A', // terracotta fallback
      }
    );
  }, [themeId, themeNameFr]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [selected, setSelected] = useState<ChoiceLabel | null>(null);
  const [lastIsCorrect, setLastIsCorrect] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(
    () => Date.now(),
  );
  const [finalChallenge, setFinalChallenge] =
    useState<FinishChallengeResult | null>(null);
  const [, startFinishTransition] = useTransition();
  const router = useRouter();

  // Safety: if there is no work to do (already played everything), trigger
  // finish immediately on mount. But this is also handled by the parent
  // page so we only render ChallengePlay when remaining.length > 0.
  const total = remaining.length;
  const currentQ = remaining[currentIndex];

  // Hooks must run unconditionally — keep useMemo above any early return.
  const shuffled = useMemo(() => {
    if (!currentQ) return null;
    return shuffleChoices(currentQ.choicesFr, currentQ.questionId);
  }, [currentQ]);

  if (phase === 'finished' && finalChallenge) {
    return (
      <ChallengeFinishedView
        challenge={finalChallenge}
        challengeId={challengeId}
        currentUserId={currentUserId}
      />
    );
  }

  if (phase === 'submitting-finish') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-10 py-16 text-center">
        <p
          className="font-display italic text-2xl text-aubergine animate-pulse"
          style={{ fontVariationSettings: "'opsz' 60" }}
        >
          Calcul du résultat…
        </p>
      </div>
    );
  }

  if (!currentQ || !shuffled) {
    return null;
  }

  async function handleSelect(label: ChoiceLabel) {
    if (phase !== 'question' || submitting || !currentQ || !shuffled) return;
    setSelected(label);
    setSubmitting(true);
    setError(null);

    // CRITICAL: the UI uses *shuffled* labels (a/b/c/d in shuffle order), but
    // the server compares the answer against the ORIGINAL `correctChoice`
    // stored in DB. We must therefore reverse-map the clicked shuffled label
    // back to its original id before sending it to /challenges/.../answer.
    // `shuffled.originalToNew` maps original → shuffled, so we invert it.
    const originalChoice =
      (Object.entries(shuffled.originalToNew).find(
        ([, newLabel]) => newLabel === label,
      )?.[0] as ChoiceLabel | undefined) ?? label;

    const elapsed = Date.now() - questionStartedAt;
    const result = await submitChallengeAnswerAction({
      challengeId,
      questionId: currentQ.questionId,
      selectedChoice: originalChoice,
      timeSpentMs: elapsed,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? 'Erreur réseau.');
      // Allow retry — don't lock the answer.
      setSelected(null);
      return;
    }

    setLastIsCorrect(result.isCorrect ?? false);
    setPhase('feedback');
  }

  function handleNext() {
    if (currentIndex + 1 < total) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setLastIsCorrect(null);
      setError(null);
      setPhase('question');
      setQuestionStartedAt(Date.now());
    } else {
      // Last question answered → finish the challenge.
      setPhase('submitting-finish');
      startFinishTransition(async () => {
        const res = await finishChallengeAction(challengeId);
        if (!res.ok || !res.challenge) {
          setError(res.error ?? 'Impossible de terminer le défi.');
          // Roll back to feedback so the user can retry via the button.
          setPhase('feedback');
          return;
        }
        setFinalChallenge(res.challenge);
        setPhase('finished');
        // Refresh the server tree so the detail page reflects the new
        // status when the user navigates around.
        router.refresh();
      });
    }
  }

  const progressNum = alreadyAnswered + currentIndex + (phase === 'feedback' ? 1 : 0);
  const progressTotal = questions.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-6 sm:py-10">
      {/* Header — progress + opponent */}
      <header className="mb-6 sm:mb-8">
        <div className="flex items-baseline justify-between mb-3 gap-3">
          <Link
            href={`/app/social/challenges/${challengeId}`}
            className="text-sm text-ink-mute hover:text-aubergine font-medium inline-flex items-center gap-1.5"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quitter
          </Link>
          <span className="font-display italic text-sm text-ink-mute">
            Question {progressNum} / {progressTotal}
          </span>
        </div>

        <div className="relative h-2 rounded-full bg-bone-deep border border-aubergine/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
            style={{
              width: `${(progressNum / progressTotal) * 100}%`,
              backgroundColor: theme.color,
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 mt-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="
                flex items-center justify-center h-6 w-6 rounded-md
                text-bone font-bold text-[0.7rem]
                shadow-[0_1px_0_rgb(45_27_46)]
              "
              style={{ backgroundColor: theme.color }}
              aria-hidden
            >
              {theme.id}
            </span>
            <span className="text-ink-mute truncate">
              Défi · {theme.nameFr}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-ink-mute">vs</span>
            <Avatar
              displayName={opponent.displayName}
              avatarUrl={opponent.avatarUrl ?? undefined}
              size="sm"
            />
          </div>
        </div>
      </header>

      {/* Question card */}
      <article className="card !rounded-3xl !p-5 sm:!p-9">
        <div className="mb-5 sm:mb-6">
          <p className="eyebrow mb-3 text-[0.7rem]">
            — Question {alreadyAnswered + currentIndex + 1}
          </p>
          <h2
            className="font-display text-xl sm:text-3xl leading-snug font-medium"
            style={{ fontVariationSettings: "'opsz' 36" }}
          >
            {currentQ.questionText}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {shuffled.choices.map((choice) => {
            const isSelected = selected === choice.id;
            const showResult = phase === 'feedback';
            const isCorrectChoice =
              showResult && isSelected && lastIsCorrect === true;
            const isWrongSelection =
              showResult && isSelected && lastIsCorrect === false;

            return (
              <ChoiceButton
                key={choice.id}
                label={choice.id as ChoiceLabel}
                text={choice.text}
                themeColor={theme.color}
                isSelected={isSelected}
                isCorrect={isCorrectChoice}
                isWrong={isWrongSelection}
                showResult={showResult}
                disabled={phase !== 'question' || submitting}
                onClick={() => handleSelect(choice.id as ChoiceLabel)}
              />
            );
          })}
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-5 text-sm rounded-xl bg-error-bg border border-fr-red/30 px-4 py-3 text-fr-red font-medium"
          >
            {error}
          </p>
        ) : null}

        {phase === 'feedback' ? (
          <FeedbackPanel
            isCorrect={lastIsCorrect === true}
            onNext={handleNext}
            isLast={currentIndex + 1 >= total}
          />
        ) : null}
      </article>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Choice button — same visual grammar as TrainingSession.
// ────────────────────────────────────────────────────────────
function ChoiceButton({
  label,
  text,
  themeColor,
  isSelected,
  isCorrect,
  isWrong,
  showResult,
  disabled,
  onClick,
}: {
  label: ChoiceLabel;
  text: string;
  themeColor: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  showResult: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  let stateClasses = '';
  if (showResult) {
    if (isCorrect) {
      stateClasses = 'border-success bg-success-bg/60 ring-2 ring-success/30';
    } else if (isWrong) {
      stateClasses = 'border-fr-red bg-error-bg ring-2 ring-fr-red/20';
    } else {
      stateClasses = 'border-aubergine/15 opacity-60';
    }
  } else if (isSelected) {
    stateClasses = 'border-terracotta bg-bone-deep ring-2 ring-terracotta/20';
  } else {
    stateClasses =
      'border-aubergine bg-bone-deep hover:bg-bone hover:-translate-y-0.5 shadow-[0_2px_0_rgb(45_27_46)]';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        text-left rounded-2xl border-[1.5px] px-3 py-3 sm:px-5 sm:py-4
        transition-all flex items-center gap-3 sm:gap-4
        disabled:cursor-not-allowed
        ${stateClasses}
      `}
      style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    >
      <span
        className={`
          flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl
          font-display font-medium text-base sm:text-lg
          ${
            isCorrect
              ? 'bg-success text-bone'
              : isWrong
                ? 'bg-fr-red text-bone'
                : isSelected
                  ? 'bg-terracotta text-bone'
                  : ''
          }
        `}
        style={{
          backgroundColor:
            !showResult && !isSelected ? themeColor : undefined,
          color: !showResult && !isSelected ? '#fff' : undefined,
        }}
      >
        {label.toUpperCase()}
      </span>
      <span className="flex-1 min-w-0 leading-snug">
        <span className="block text-sm sm:text-lg">{text}</span>
      </span>
      {isCorrect ? (
        <svg
          className="h-5 w-5 text-success shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : null}
      {isWrong ? (
        <svg
          className="h-5 w-5 text-fr-red shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : null}
    </button>
  );
}

// ────────────────────────────────────────────────────────────
// Feedback panel — minimal version (no explanation field on /:id payload).
// ────────────────────────────────────────────────────────────
function FeedbackPanel({
  isCorrect,
  onNext,
  isLast,
}: {
  isCorrect: boolean;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div
      className={`
        mt-6 sm:mt-7 rounded-2xl p-4 sm:p-6 border-[1.5px]
        ${isCorrect ? 'bg-success-bg/50 border-success/30' : 'bg-error-bg/50 border-fr-red/30'}
      `}
    >
      <div className="flex items-start gap-3 mb-4">
        <span
          className={`
            flex h-8 w-8 items-center justify-center rounded-xl shrink-0 text-bone font-bold
            ${isCorrect ? 'bg-success' : 'bg-fr-red'}
          `}
          aria-hidden
        >
          {isCorrect ? '✓' : '✗'}
        </span>
        <div className="flex-1">
          <p
            className="font-display italic text-lg"
            style={{ fontVariationSettings: "'opsz' 32" }}
          >
            {isCorrect ? 'Bonne réponse !' : 'Pas tout à fait.'}
          </p>
          <p className="mt-1 text-sm text-ink-mute">
            {isLast
              ? 'Dernière question — voyons votre score.'
              : 'Continuez avec la question suivante.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="btn-primary w-full sm:w-auto !justify-center"
      >
        {isLast ? 'Voir mes résultats' : 'Question suivante'}
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Final scoreboard — uses the /finish payload (winnerId / isDraw).
// ────────────────────────────────────────────────────────────
function ChallengeFinishedView({
  challenge,
  challengeId,
  currentUserId,
}: {
  challenge: FinishChallengeResult;
  challengeId: string;
  currentUserId: string;
}) {
  // Identify "me" and "them" by user ID — robust to display-name collisions.
  const meIsChallenger = challenge.challenger.id === currentUserId;
  const me = meIsChallenger ? challenge.challenger : challenge.challenged;
  const them = meIsChallenger ? challenge.challenged : challenge.challenger;
  const myScore = meIsChallenger
    ? challenge.challengerScore
    : challenge.challengedScore;
  const theirScore = meIsChallenger
    ? challenge.challengedScore
    : challenge.challengerScore;
  const total = challenge.questionCount;

  const opponentHasPlayed = theirScore !== null && theirScore !== undefined;
  let outcome: 'won' | 'lost' | 'draw' | 'pending' = 'pending';
  if (opponentHasPlayed) {
    if (challenge.isDraw) outcome = 'draw';
    else if (challenge.winnerId === me.id) outcome = 'won';
    else outcome = 'lost';
  }

  const subtitle =
    outcome === 'won'
      ? 'Vous l’emportez sur ce défi.'
      : outcome === 'lost'
        ? `${them.displayName.split(' ')[0]} l’emporte cette fois.`
        : outcome === 'draw'
          ? 'Match nul — vous avez fait le même score.'
          : `En attente du score de ${them.displayName.split(' ')[0]}.`;

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <div className="text-center mb-8">
        <p className="eyebrow mb-3">— Défi terminé</p>
        <h1
          className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-medium tracking-tight mb-3"
          style={{ fontVariationSettings: "'opsz' 96" }}
        >
          {outcome === 'won' ? (
            <>
              <span className="display-italic text-terracotta">Bravo</span>, vous
              l’emportez !
            </>
          ) : outcome === 'lost' ? (
            <>
              {them.displayName.split(' ')[0]}{' '}
              <span className="display-italic">l’emporte</span>.
            </>
          ) : outcome === 'draw' ? (
            <>
              <span className="display-italic text-terracotta">Égalité</span> —
              bien joué !
            </>
          ) : (
            <>Vos réponses sont enregistrées.</>
          )}
        </h1>
        <p className="text-ink-mute text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      </div>

      <section className="card !rounded-3xl !p-6 sm:!p-8 mb-6">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* You */}
          <div className="flex-1 flex flex-col items-center gap-3 text-center min-w-0">
            <Avatar
              displayName={me.displayName}
              avatarUrl={me.avatarUrl}
              size="lg"
              highlight={outcome === 'won'}
            />
            <p className="font-display text-sm sm:text-base font-medium text-aubergine truncate w-full">
              {me.displayName.split(' ')[0]}{' '}
              <span className="text-ink-mute font-display italic text-xs">
                (vous)
              </span>
            </p>
            <p
              className="font-display text-3xl sm:text-4xl font-medium text-terracotta"
              style={{ fontVariationSettings: "'opsz' 96" }}
            >
              {myScore ?? 0}/{total}
            </p>
            <p className="text-[0.65rem] uppercase tracking-wider text-ink-mute">
              Score final
            </p>
          </div>

          <span
            className="font-display italic text-2xl sm:text-3xl text-ink-faded shrink-0"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            vs
          </span>

          {/* Opponent */}
          <div className="flex-1 flex flex-col items-center gap-3 text-center min-w-0">
            <Avatar
              displayName={them.displayName}
              avatarUrl={them.avatarUrl}
              size="lg"
              highlight={outcome === 'lost'}
            />
            <p className="font-display text-sm sm:text-base font-medium text-aubergine truncate w-full">
              {them.displayName}
            </p>
            <p
              className="font-display text-3xl sm:text-4xl font-medium text-fr-blue"
              style={{ fontVariationSettings: "'opsz' 96" }}
            >
              {opponentHasPlayed ? `${theirScore}/${total}` : '—'}
            </p>
            <p className="text-[0.65rem] uppercase tracking-wider text-ink-mute">
              {opponentHasPlayed ? 'Score final' : 'En attente'}
            </p>
          </div>
        </div>
      </section>

      {!opponentHasPlayed ? (
        <p className="text-center text-sm text-ink-mute mb-6 font-display italic">
          On vous prévient dès que {them.displayName.split(' ')[0]} aura joué.
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/app/social/challenges/${challengeId}`}
          className="btn-primary flex-1 !justify-center"
        >
          Voir les questions
        </Link>
        <Link
          href="/app/social/challenges"
          className="btn-secondary flex-1 !justify-center"
        >
          Tous les défis
        </Link>
      </div>
    </div>
  );
}
