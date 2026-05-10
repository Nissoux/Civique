'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Question } from '@civique/shared';
import { THEMES } from '@civique/shared';
import { shuffleChoices, getShuffledCorrectChoice } from '@/lib/shuffleChoices';
import { useProgressionStore } from '@/lib/stores/progressionStore';
import { recordPracticeAnswerAction } from '@/lib/actions/practice';
import { QuestionComments } from './QuestionComments';

type ChoiceLabel = 'a' | 'b' | 'c' | 'd';
type Phase = 'question' | 'feedback' | 'finished';

interface Props {
  themeId: number;
  levelNum: number;
  totalLevels: number;
  questions: Question[];
}

export function TrainingSession({
  themeId,
  levelNum,
  totalLevels,
  questions,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [selected, setSelected] = useState<ChoiceLabel | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(Date.now());
  const [paywall, setPaywall] = useState(false);

  const completeLevel = useProgressionStore((s) => s.completeLevel);
  const loadProgress = useProgressionStore((s) => s.loadProgress);

  const isRandom = themeId === 0;
  const theme = THEMES.find((t) => t.id === themeId) ?? {
    id: 0,
    code: 'random',
    nameFr: 'Entraînement aléatoire',
    icon: 'shuffle',
    color: '#C7522A', // terracotta
  };
  const total = questions.length;

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Reset timer on question change.
  useEffect(() => {
    setQuestionStartedAt(Date.now());
    setSelected(null);
    setError(null);
    setPhase('question');
  }, [currentIndex]);

  // When session finishes, persist progression once.
  // Skip for random training — not tied to a specific level.
  useEffect(() => {
    if (phase === 'finished' && !isRandom) {
      completeLevel(themeId, levelNum, correctCount, total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ⚠ Hooks must run in the same order every render — keep useMemo BEFORE
  // the conditional early-returns below.
  const currentQ = questions[currentIndex] ?? questions[questions.length - 1];
  const shuffled = useMemo(
    () => shuffleChoices(currentQ.choicesFr, currentQ.id),
    [currentQ],
  );
  // Shuffling translatedChoices with the same questionId yields the same
  // positional order, so each new label maps to the matching translated text.
  const shuffledTr = useMemo(
    () =>
      currentQ.translatedChoices && currentQ.translatedChoices.length > 0
        ? shuffleChoices(currentQ.translatedChoices, currentQ.id)
        : null,
    [currentQ],
  );

  if (paywall) {
    return <Paywall />;
  }

  if (phase === 'finished') {
    return (
      <SessionResults
        themeId={themeId}
        levelNum={levelNum}
        totalLevels={totalLevels}
        correctCount={correctCount}
        total={total}
        themeColor={theme.color}
      />
    );
  }

  const correctNewLabel = getShuffledCorrectChoice(
    currentQ.correctChoice,
    shuffled.originalToNew,
  );
  const isCorrect = selected !== null && selected === correctNewLabel;

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
      // Allow retry: don't lock answer
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
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-6 sm:py-12">
      {/* Header — progress */}
      <header className="mb-6 sm:mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <Link
            href="/app"
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
            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
            style={{
              width: `${((currentIndex + (phase === 'feedback' ? 1 : 0)) / total) * 100}%`,
              backgroundColor: theme.color,
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span
            className="
              flex items-center justify-center h-6 w-6 rounded-md text-bone font-bold text-[0.7rem]
              shadow-[0_1px_0_rgb(45_27_46)]
            "
            style={{ backgroundColor: theme.color }}
            aria-hidden
          >
            {themeId}
          </span>
          <span className="text-ink-mute">
            Thème {themeId} · Niveau {levelNum} · {theme.nameFr}
          </span>
        </div>
      </header>

      {/* Question card */}
      <article className="card !rounded-3xl !p-5 sm:!p-9">
        <div className="mb-5 sm:mb-6">
          <p className="eyebrow mb-3 text-[0.7rem]">— Question {currentIndex + 1}</p>
          <h2 className="font-display text-xl sm:text-3xl leading-snug font-medium" style={{ fontVariationSettings: "'opsz' 36" }}>
            {currentQ.textFr}
          </h2>
          {currentQ.translatedText ? (
            <p className="mt-3 text-sm sm:text-base text-ink-mute italic">{currentQ.translatedText}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {shuffled.choices.map((choice, idx) => {
            const isSelected = selected === choice.id;
            const isCorrectChoice = choice.id === correctNewLabel;
            const showResult = phase === 'feedback';
            const translatedText = shuffledTr?.choices[idx]?.text;

            return (
              <ChoiceButton
                key={choice.id}
                label={choice.id as ChoiceLabel}
                text={choice.text}
                translatedText={
                  translatedText && translatedText !== choice.text
                    ? translatedText
                    : undefined
                }
                themeColor={theme.color}
                isSelected={isSelected}
                isCorrect={isCorrectChoice}
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
            questionId={currentQ.id}
            isCorrect={isCorrect}
            explanation={currentQ.explanationFr}
            translatedExplanation={
              currentQ.translatedExplanation &&
              currentQ.translatedExplanation !== currentQ.explanationFr
                ? currentQ.translatedExplanation
                : undefined
            }
            onNext={handleNext}
            isLast={currentIndex + 1 >= total}
          />
        ) : null}
      </article>
    </div>
  );
}

function ChoiceButton({
  label,
  text,
  translatedText,
  themeColor,
  isSelected,
  isCorrect,
  showResult,
  disabled,
  onClick,
}: {
  label: ChoiceLabel;
  text: string;
  translatedText?: string;
  themeColor: string;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  let stateClasses = '';
  if (showResult) {
    if (isCorrect) {
      stateClasses =
        'border-success bg-success-bg/60 ring-2 ring-success/30';
    } else if (isSelected && !isCorrect) {
      stateClasses = 'border-fr-red bg-error-bg ring-2 ring-fr-red/20';
    } else {
      stateClasses = 'border-aubergine/15 opacity-60';
    }
  } else if (isSelected) {
    stateClasses = 'border-terracotta bg-bone-deep ring-2 ring-terracotta/20';
  } else {
    stateClasses = 'border-aubergine bg-bone-deep hover:bg-bone hover:-translate-y-0.5 shadow-[0_2px_0_rgb(45_27_46)]';
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
            showResult && isCorrect
              ? 'bg-success text-bone'
              : showResult && isSelected
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
        {translatedText ? (
          <span className="block mt-1 text-xs sm:text-sm text-ink-mute italic font-display">
            {translatedText}
          </span>
        ) : null}
      </span>
      {showResult && isCorrect ? (
        <svg className="h-5 w-5 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : null}
      {showResult && isSelected && !isCorrect ? (
        <svg className="h-5 w-5 text-fr-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : null}
    </button>
  );
}

function FeedbackPanel({
  questionId,
  isCorrect,
  explanation,
  translatedExplanation,
  onNext,
  isLast,
}: {
  questionId: number;
  isCorrect: boolean;
  explanation?: string;
  translatedExplanation?: string;
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
          <p className="font-display italic text-lg" style={{ fontVariationSettings: "'opsz' 32" }}>
            {isCorrect ? 'Bonne réponse !' : 'Pas tout à fait.'}
          </p>
          {explanation ? (
            <p className="mt-2 text-sm leading-relaxed text-aubergine">
              {explanation}
            </p>
          ) : null}
          {translatedExplanation ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-mute italic font-display">
              {translatedExplanation}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="btn-primary w-full sm:w-auto !justify-center"
      >
        {isLast ? 'Voir mes résultats' : 'Question suivante'}
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <QuestionComments questionId={questionId} />
    </div>
  );
}

function SessionResults({
  themeId,
  levelNum,
  totalLevels,
  correctCount,
  total,
  themeColor,
}: {
  themeId: number;
  levelNum: number;
  totalLevels: number;
  correctCount: number;
  total: number;
  themeColor: string;
}) {
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const crowns = scorePercent >= 100 ? 3 : scorePercent >= 80 ? 2 : scorePercent >= 60 ? 1 : 0;

  const isPerfect = scorePercent === 100;
  const isPass = scorePercent >= 60;
  const headline = isPerfect
    ? 'Parfait !'
    : isPass
    ? 'Niveau réussi.'
    : 'Encore un peu.';
  const subtitle = isPerfect
    ? 'Trois couronnes — vous maîtrisez ce niveau.'
    : isPass
    ? 'Ce niveau est validé. Vous pouvez continuer.'
    : 'Il faut au moins 60 % pour valider. Réessayez quand vous voulez.';

  const hasNextLevel = levelNum < totalLevels;

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-10 py-12 sm:py-20">
      <div className="text-center mb-10">
        <p className="eyebrow mb-3">— Niveau {levelNum}</p>
        <h1
          className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-medium tracking-tight mb-4"
          style={{ fontVariationSettings: "'opsz' 96" }}
        >
          {headline.split(' ').map((word, i, arr) =>
            i === arr.length - 1 ? (
              <span key={i} className="display-italic text-terracotta">{word}</span>
            ) : (
              <span key={i}>{word} </span>
            ),
          )}
        </h1>
        <p className="text-ink-mute text-lg leading-relaxed">{subtitle}</p>
      </div>

      <div className="card !rounded-3xl !p-8 mb-8">
        <div className="text-center mb-7">
          <div
            className="
              inline-flex flex-col items-center justify-center
              h-32 w-32 rounded-full text-bone mb-3
              shadow-[0_4px_0_rgb(45_27_46)]
            "
            style={{ backgroundColor: themeColor }}
          >
            <span
              className="font-display text-5xl font-medium leading-none"
              style={{ fontVariationSettings: "'opsz' 144" }}
            >
              {scorePercent}
            </span>
            <span className="text-xs opacity-80 mt-1">%</span>
          </div>
          <p className="text-sm text-ink-mute font-display italic">
            {correctCount} / {total} bonnes réponses
          </p>
        </div>

        {/* Crown row */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {[1, 2, 3].map((i) => (
            <svg
              key={i}
              className={`h-10 w-10 transition-all ${i <= crowns ? 'text-saffron' : 'text-aubergine/15'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ transform: i <= crowns ? `translateY(-${(crowns - i + 1) * 2}px)` : 'none' }}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <p className="text-center text-xs text-ink-mute">
          {crowns === 3
            ? 'Trois couronnes — perfection'
            : crowns === 2
            ? 'Deux couronnes — très bien'
            : crowns === 1
            ? 'Une couronne — niveau validé'
            : 'Aucune couronne — réessayez'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {!isPass ? (
          <Link
            href={`/app/train/${themeId}/${levelNum}`}
            className="btn-primary flex-1 !justify-center"
          >
            Refaire le niveau
          </Link>
        ) : null}
        {isPass && hasNextLevel ? (
          <Link
            href={`/app/train/${themeId}/${levelNum + 1}`}
            className="btn-primary flex-1 !justify-center"
          >
            Niveau suivant
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        ) : null}
        <Link
          href="/app"
          className={`btn-secondary !justify-center ${(!isPass || !hasNextLevel) ? 'flex-1' : ''}`}
        >
          Retour au tableau de bord
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
        Passez à Civique Plein pour continuer à pratiquer sans limite, débloquer
        les examens blancs illimités et toutes les fiches premium.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/app/settings/subscription" className="btn-primary">
          Voir les offres
        </Link>
        <Link href="/app" className="btn-secondary">
          Retour
        </Link>
      </div>
    </div>
  );
}
