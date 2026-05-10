'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Question } from '@civique/shared';
import { shuffleChoices, getShuffledCorrectChoice } from '@/lib/shuffleChoices';
import { recordPracticeAnswerAction } from '@/lib/actions/practice';

type ChoiceLabel = 'a' | 'b' | 'c' | 'd';
type Phase = 'question' | 'feedback' | 'finished';

interface Props {
  questions: Question[];
}

/**
 * Mixed quiz session for the flashcard "Quiz révision" mode.
 * Uses the same flow as TrainingSession but is not tied to a level —
 * we still record practice via recordPracticeAnswerAction so streak +
 * stats stay coherent.
 */
export function FlashcardQuizSession({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [selected, setSelected] = useState<ChoiceLabel | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(Date.now());
  const [paywall, setPaywall] = useState(false);

  const total = questions.length;

  useEffect(() => {
    setQuestionStartedAt(Date.now());
    setSelected(null);
    setError(null);
    setPhase('question');
  }, [currentIndex]);

  if (paywall) {
    return <Paywall />;
  }

  if (phase === 'finished') {
    const ratio = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return <QuizSummary correct={correctCount} total={total} ratio={ratio} />;
  }

  const currentQ = questions[currentIndex];
  const shuffled = useMemo(
    () => shuffleChoices(currentQ.choicesFr, currentQ.id),
    [currentQ],
  );
  const correctNewLabel = getShuffledCorrectChoice(
    currentQ.correctChoice,
    shuffled.originalToNew,
  );
  const isCorrect = selected !== null && selected === correctNewLabel;
  const isSituational = currentQ.type === 'situational';

  async function handleSelect(label: ChoiceLabel) {
    if (phase !== 'question' || submitting) return;
    setSelected(label);
    setSubmitting(true);
    setError(null);

    const elapsed = Date.now() - questionStartedAt;
    const result = await recordPracticeAnswerAction({
      questionId: currentQ.id,
      selectedChoice: label,
      timeSpentMs: elapsed,
    });

    setSubmitting(false);

    if (!result.ok) {
      if (result.quotaExceeded) {
        setPaywall(true);
        return;
      }
      setError(result.error ?? 'Erreur réseau');
      setSelected(null);
      return;
    }

    if (result.isCorrect) {
      setCorrectCount((n) => n + 1);
    }
    setPhase('feedback');
  }

  function handleNext() {
    if (currentIndex + 1 < total) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase('finished');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <Link
            href="/app/flashcards"
            className="text-sm text-ink-mute hover:text-aubergine font-medium inline-flex items-center gap-1.5"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quitter
          </Link>
          <span className="font-display italic text-sm text-ink-mute">
            Question {currentIndex + 1} / {total}
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-bone-deep border border-aubergine/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-terracotta transition-all duration-500 ease-out"
            style={{
              width: `${((currentIndex + (phase === 'feedback' ? 1 : 0)) / total) * 100}%`,
            }}
          />
        </div>
        <p className="mt-3 text-xs text-ink-mute">
          Quiz révision · 7 connaissances + 3 mises en situation
        </p>
      </header>

      <article className="card !rounded-3xl !p-7 sm:!p-9">
        <div className="mb-6">
          <p className="eyebrow mb-3 text-[0.7rem]">
            — {isSituational ? 'Mise en situation' : 'Connaissance'}
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl leading-snug font-medium"
            style={{ fontVariationSettings: "'opsz' 36" }}
          >
            {currentQ.textFr}
          </h2>
          {currentQ.translatedText ? (
            <p className="mt-3 text-base text-ink-mute italic">{currentQ.translatedText}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {shuffled.choices.map((choice) => {
            const isSelected = selected === choice.id;
            const isCorrectChoice = choice.id === correctNewLabel;
            const showResult = phase === 'feedback';

            let stateClasses = '';
            if (showResult) {
              if (isCorrectChoice) {
                stateClasses = 'border-success bg-success-bg/60 ring-2 ring-success/30';
              } else if (isSelected && !isCorrectChoice) {
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
                key={choice.id}
                type="button"
                onClick={() => handleSelect(choice.id as ChoiceLabel)}
                disabled={phase !== 'question' || submitting}
                className={`
                  text-left rounded-2xl border-[1.5px] px-5 py-4
                  transition-all flex items-center gap-4
                  disabled:cursor-not-allowed
                  ${stateClasses}
                `}
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                <span
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                    font-display font-medium text-lg
                    ${
                      showResult && isCorrectChoice
                        ? 'bg-success text-bone'
                        : showResult && isSelected
                        ? 'bg-fr-red text-bone'
                        : isSelected
                        ? 'bg-terracotta text-bone'
                        : 'bg-terracotta text-bone'
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

        {error ? (
          <p
            role="alert"
            className="mt-5 text-sm rounded-xl bg-error-bg border border-fr-red/30 px-4 py-3 text-fr-red font-medium"
          >
            {error}
          </p>
        ) : null}

        {phase === 'feedback' ? (
          <div
            className={`
              mt-7 rounded-2xl p-5 sm:p-6 border-[1.5px]
              ${isCorrect ? 'bg-success-bg/50 border-success/30' : 'bg-error-bg/50 border-fr-red/30'}
            `}
          >
            <div className="flex items-start gap-3 mb-3">
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
                {currentQ.explanationFr ? (
                  <p className="mt-2 text-sm leading-relaxed text-aubergine">
                    {currentQ.explanationFr}
                  </p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary w-full sm:w-auto !justify-center"
            >
              {currentIndex + 1 >= total ? 'Voir mes résultats' : 'Question suivante'}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </article>
    </div>
  );
}

function QuizSummary({
  correct,
  total,
  ratio,
}: {
  correct: number;
  total: number;
  ratio: number;
}) {
  const headline =
    ratio === 100 ? 'Parfait !' : ratio >= 70 ? 'Bien joué.' : 'Continuez.';
  const subtitle =
    ratio === 100
      ? 'Sans faute sur ce quiz mixte.'
      : ratio >= 70
      ? 'Bon rythme, vous êtes sur la bonne voie.'
      : 'Quelques notions à reprendre, puis recommencez.';

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-10 py-12 sm:py-20">
      <div className="text-center mb-10">
        <p className="eyebrow mb-3">— Quiz révision</p>
        <h1
          className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-medium tracking-tight mb-4"
          style={{ fontVariationSettings: "'opsz' 96" }}
        >
          {headline.split(' ').map((word, i, arr) =>
            i === arr.length - 1 ? (
              <span key={i} className="display-italic text-terracotta">
                {word}
              </span>
            ) : (
              <span key={i}>{word} </span>
            ),
          )}
        </h1>
        <p className="text-ink-mute text-lg leading-relaxed">{subtitle}</p>
      </div>

      <div className="card !rounded-3xl !p-8 mb-8 text-center">
        <div
          className="
            inline-flex flex-col items-center justify-center
            h-32 w-32 rounded-full bg-terracotta text-bone mb-3
            shadow-[0_4px_0_rgb(45_27_46)]
          "
        >
          <span
            className="font-display text-5xl font-medium leading-none"
            style={{ fontVariationSettings: "'opsz' 144" }}
          >
            {ratio}
          </span>
          <span className="text-xs opacity-80 mt-1">%</span>
        </div>
        <p className="text-sm text-ink-mute font-display italic">
          {correct} / {total} bonnes réponses
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/app/flashcards/quiz" className="btn-primary flex-1 !justify-center">
          Nouveau quiz
        </Link>
        <Link href="/app/flashcards" className="btn-secondary flex-1 !justify-center">
          Retour aux révisions
        </Link>
      </div>
    </div>
  );
}

function Paywall() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <p className="eyebrow mb-3">— Quota dépassé</p>
      <h1
        className="font-display text-4xl sm:text-5xl leading-[1.05] font-medium tracking-tight mb-5"
        style={{ fontVariationSettings: "'opsz' 96" }}
      >
        Vous avez atteint la <span className="display-italic text-terracotta">limite gratuite</span>.
      </h1>
      <p className="text-ink-mute leading-relaxed mb-8">
        Passez à Civique Plein pour continuer à pratiquer sans limite.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/app/settings/subscription" className="btn-primary">
          Voir les offres
        </Link>
        <Link href="/app/flashcards" className="btn-secondary">
          Retour
        </Link>
      </div>
    </div>
  );
}
