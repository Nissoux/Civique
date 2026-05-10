'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import type { Question } from '@civique/shared';
import { shuffleChoices } from '@/lib/shuffleChoices';
import { useExamStore, type ChoiceLabel } from '@/lib/stores/examStore';
import {
  finishExamAction,
  submitExamAnswerAction,
} from '@/lib/actions/exams';
import { ExamTimer } from './ExamTimer';

interface Props {
  sessionId: string;
  questions: Question[];
  /** Server-controlled time limit (seconds), default 2700 = 45min. */
  timeLimitSec: number;
  /** ms-since-epoch — when the exam was originally started. */
  startedAtMs: number;
  /** Answers already persisted on the server (questionId → original choice). */
  initialAnswers: Record<number, ChoiceLabel>;
}

export function ExamSession({
  sessionId,
  questions,
  timeLimitSec,
  startedAtMs,
  initialAnswers,
}: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFinishing, startFinish] = useTransition();

  const state = useExamStore((s) => s.state);
  const initSession = useExamStore((s) => s.initSession);
  const setAnswerLocal = useExamStore((s) => s.setAnswer);
  const setIndex = useExamStore((s) => s.setIndex);
  const next = useExamStore((s) => s.next);
  const prev = useExamStore((s) => s.prev);
  const hydrate = useExamStore((s) => s.hydrate);

  // Hydrate from localStorage on mount, then sync server-known data.
  useEffect(() => {
    hydrate();
    initSession({
      sessionId,
      startedAt: startedAtMs,
      timeLimitSec,
      initialAnswers,
    });
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (!hydrated || !state || state.sessionId !== sessionId) {
    return <ExamLoading />;
  }

  const total = questions.length;
  const currentIndex = Math.min(state.currentIndex, total - 1);
  const currentQ = questions[currentIndex];
  const answers = state.answers;
  const answeredCount = Object.keys(answers).length;

  const handleTimeUp = () => {
    handleFinish(/* skipConfirm */ true);
  };

  const handleFinish = (skipConfirm = false) => {
    if (isFinishing) return;
    if (!skipConfirm && answeredCount < total) {
      setConfirmFinish(true);
      return;
    }
    setConfirmFinish(false);
    startFinish(async () => {
      const result = await finishExamAction(sessionId);
      // finishExamAction redirects on success — code below only runs on err
      if (!result.ok && result.error) {
        setSubmitError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-bone">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-6 sm:py-10">
        <Header
          currentIndex={currentIndex}
          total={total}
          answeredCount={answeredCount}
          startedAtMs={startedAtMs}
          timeLimitSec={timeLimitSec}
          onTimeUp={handleTimeUp}
        />

        <QuestionCard
          question={currentQ}
          selected={
            currentQ.id in answers ? answers[currentQ.id] : null
          }
          submitting={submitting}
          onSelect={async (originalChoice) => {
            // Local-first, then sync to server.
            setAnswerLocal(currentQ.id, originalChoice);
            setSubmitting(true);
            setSubmitError(null);
            try {
              await submitExamAnswerAction(sessionId, {
                questionId: currentQ.id,
                selectedChoice: originalChoice,
              });
            } finally {
              setSubmitting(false);
            }
          }}
        />

        <QuestionGrid
          total={total}
          currentIndex={currentIndex}
          answers={answers}
          questions={questions}
          onJump={(i) => setIndex(i)}
        />

        <NavigationBar
          currentIndex={currentIndex}
          total={total}
          hasAnswered={currentQ.id in answers}
          isFinishing={isFinishing}
          onPrev={() => prev()}
          onNext={() => next(total)}
          onFinish={() => handleFinish()}
        />

        {submitError ? (
          <p
            role="alert"
            className="mt-4 text-sm rounded-xl bg-error-bg border border-fr-red/30 px-4 py-3 text-fr-red font-medium"
          >
            {submitError}
          </p>
        ) : null}

        {confirmFinish ? (
          <ConfirmFinishModal
            answeredCount={answeredCount}
            total={total}
            onCancel={() => setConfirmFinish(false)}
            onConfirm={() => handleFinish(true)}
          />
        ) : null}
      </div>
    </div>
  );
}

function Header({
  currentIndex,
  total,
  answeredCount,
  startedAtMs,
  timeLimitSec,
  onTimeUp,
}: {
  currentIndex: number;
  total: number;
  answeredCount: number;
  startedAtMs: number;
  timeLimitSec: number;
  onTimeUp: () => void;
}) {
  const progressPercent = ((currentIndex + 1) / total) * 100;
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div>
          <p className="eyebrow mb-1">— Examen blanc</p>
          <p className="font-display text-xl sm:text-2xl font-medium leading-snug">
            Question{' '}
            <span className="display-italic text-terracotta">
              {currentIndex + 1}
            </span>{' '}
            <span className="text-ink-mute">/ {total}</span>
          </p>
        </div>
        <ExamTimer
          startedAtMs={startedAtMs}
          durationSec={timeLimitSec}
          onTimeUp={onTimeUp}
        />
      </div>

      <div className="relative h-2 rounded-full bg-bone-deep border border-aubergine/15 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-fr-blue transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-mute text-right">
        {answeredCount}/{total} répondues
      </p>
    </header>
  );
}

function QuestionCard({
  question,
  selected,
  submitting,
  onSelect,
}: {
  question: Question;
  selected: ChoiceLabel | null;
  submitting: boolean;
  onSelect: (originalChoice: ChoiceLabel) => void;
}) {
  const shuffled = useMemo(
    () => shuffleChoices(question.choicesFr, question.id),
    [question.id, question.choicesFr],
  );
  // Map stored answer (original id) → shuffled label for display.
  const selectedShuffled =
    selected !== null ? shuffled.originalToNew[selected] ?? null : null;

  // Build a reverse map (shuffled label → original id) for click handling.
  const reverseMap = useMemo(() => {
    const map: Record<string, ChoiceLabel> = {};
    for (const [orig, shuf] of Object.entries(shuffled.originalToNew)) {
      map[shuf] = orig as ChoiceLabel;
    }
    return map;
  }, [shuffled.originalToNew]);

  return (
    <article className="card !rounded-3xl !p-6 sm:!p-8 mb-5">
      <div className="mb-5">
        <h2
          className="font-display text-xl sm:text-2xl leading-snug font-medium"
          style={{ fontVariationSettings: "'opsz' 32" }}
        >
          {question.textFr}
        </h2>
        {/* No translations shown during the exam — real conditions. */}
      </div>

      <div className="flex flex-col gap-3">
        {shuffled.choices.map((choice) => {
          const isSelected = selectedShuffled === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={submitting}
              onClick={() => onSelect(reverseMap[choice.id])}
              className={`
                text-left rounded-2xl border-[1.5px] px-5 py-4
                transition-all flex items-center gap-4
                disabled:cursor-not-allowed
                ${
                  isSelected
                    ? 'border-fr-blue bg-fr-blue/5 ring-2 ring-fr-blue/25 -translate-y-0.5'
                    : 'border-aubergine bg-bone-deep hover:bg-bone hover:-translate-y-0.5 shadow-[0_2px_0_rgb(45_27_46)]'
                }
              `}
              style={{
                transitionTimingFunction:
                  'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <span
                className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                  font-display font-medium text-lg
                  ${
                    isSelected
                      ? 'bg-fr-blue text-bone'
                      : 'bg-aubergine text-bone'
                  }
                `}
              >
                {choice.id.toUpperCase()}
              </span>
              <span className="flex-1 text-base sm:text-lg leading-snug">
                {choice.text}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}

function QuestionGrid({
  total,
  currentIndex,
  answers,
  questions,
  onJump,
}: {
  total: number;
  currentIndex: number;
  answers: Record<number, ChoiceLabel>;
  questions: Question[];
  onJump: (i: number) => void;
}) {
  return (
    <div className="card !rounded-2xl !p-4 sm:!p-5 mb-5">
      <p className="eyebrow mb-3">— Navigation</p>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
        {Array.from({ length: total }, (_, i) => {
          const q = questions[i];
          const answered = q && q.id in answers;
          const isCurrent = i === currentIndex;

          let stateClasses = '';
          if (isCurrent) {
            stateClasses =
              'bg-fr-blue text-bone border-fr-blue shadow-[0_2px_0_rgb(45_27_46)]';
          } else if (answered) {
            stateClasses =
              'bg-success/15 text-aubergine border-success/40 hover:bg-success/25';
          } else {
            stateClasses =
              'bg-bone-deep text-ink-mute border-aubergine/30 hover:bg-bone hover:border-aubergine';
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              aria-label={`Aller à la question ${i + 1}${
                answered ? ' (répondue)' : ''
              }${isCurrent ? ' (en cours)' : ''}`}
              className={`
                aspect-square rounded-lg border-[1.5px] text-xs sm:text-sm font-display font-medium
                transition-all ${stateClasses}
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavigationBar({
  currentIndex,
  total,
  hasAnswered,
  isFinishing,
  onPrev,
  onNext,
  onFinish,
}: {
  currentIndex: number;
  total: number;
  hasAnswered: boolean;
  isFinishing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const isLast = currentIndex === total - 1;
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="btn-secondary !justify-center sm:flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
      >
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
            d="M11 17l-5-5m0 0l5-5m-5 5h12"
          />
        </svg>
        Précédente
      </button>

      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!hasAnswered}
          className="btn-primary !justify-center sm:flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Suivante
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
      ) : (
        <button
          type="button"
          onClick={onFinish}
          disabled={isFinishing}
          className="btn-brand !justify-center sm:flex-1 disabled:opacity-50"
        >
          {isFinishing ? 'Validation...' : "Terminer l'examen"}
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function ConfirmFinishModal({
  answeredCount,
  total,
  onCancel,
  onConfirm,
}: {
  answeredCount: number;
  total: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-finish-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aubergine/40 backdrop-blur-sm"
    >
      <div className="card !rounded-3xl !p-6 sm:!p-8 max-w-md w-full">
        <p className="eyebrow mb-2">— Confirmer</p>
        <h3
          id="confirm-finish-title"
          className="font-display text-2xl sm:text-3xl font-medium mb-3"
          style={{ fontVariationSettings: "'opsz' 48" }}
        >
          Terminer <span className="display-italic text-terracotta">l'examen</span> ?
        </h3>
        <p className="text-ink-mute leading-relaxed mb-6">
          Vous avez répondu à <strong>{answeredCount}/{total}</strong> questions.
          Les questions sans réponse seront comptées comme incorrectes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary !justify-center sm:flex-1"
          >
            Continuer
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-primary !justify-center sm:flex-1"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}

function ExamLoading() {
  return (
    <div className="min-h-screen bg-bone flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-10 w-10 border-[3px] border-aubergine/20 border-t-terracotta rounded-full animate-spin mb-4" />
        <p className="text-ink-mute">Chargement de l'examen...</p>
      </div>
    </div>
  );
}
