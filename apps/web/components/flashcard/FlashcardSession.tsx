'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LANGUAGES, type Language } from '@civique/shared';
import type { Flashcard } from '@/lib/data/flashcards';
import { useFlashcardStore } from '@/lib/stores/flashcardStore';
import { TranslationPendingNotice } from '@/components/nav/TranslationStatus';

interface Props {
  cards: Flashcard[];
  themeId: number;
  themeName: string;
  themeColor: string;
  currentLang: Language;
}

function isRtl(lang: Language): boolean {
  return LANGUAGES.find((l) => l.code === lang)?.rtl ?? false;
}

function getCardTranslation(
  card: Flashcard,
  lang: Language,
): { front: string; back: string } | undefined {
  if (lang === 'fr') return undefined;
  if (lang === 'ar' || lang === 'es' || lang === 'fa' || lang === 'hi' || lang === 'pt') {
    return card.translations[lang];
  }
  return undefined;
}

type SessionPhase = 'review' | 'finished';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardSession({ cards, themeId, themeName, themeColor, currentLang }: Props) {
  const loadProgress = useFlashcardStore((s) => s.loadProgress);
  const markCard = useFlashcardStore((s) => s.markCard);

  // Shuffle once on mount for variety, but keep stable for the session
  const [deck] = useState(() => shuffleArray(cards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [phase, setPhase] = useState<SessionPhase>('review');
  const [knownIds, setKnownIds] = useState<number[]>([]);
  const [unknownIds, setUnknownIds] = useState<number[]>([]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const total = deck.length;
  const card = deck[index];

  // The static flashcard set only carries ar/es/fa/hi/pt translations.
  // Any other non-FR language (today: en, tr) falls back to FR — show a
  // single discreet notice in the header rather than per-card.
  const hasTranslationsForLang =
    currentLang === 'fr' ||
    currentLang === 'ar' ||
    currentLang === 'es' ||
    currentLang === 'fa' ||
    currentLang === 'hi' ||
    currentLang === 'pt';

  function handleAnswer(status: 'known' | 'unknown') {
    if (!card) return;
    markCard(card.id, status);
    if (status === 'known') {
      setKnownIds((arr) => [...arr, card.id]);
    } else {
      setUnknownIds((arr) => [...arr, card.id]);
    }

    if (index + 1 >= total) {
      setPhase('finished');
    } else {
      setFlipped(false);
      // small delay to let the un-flip animation kick before content swap
      setTimeout(() => setIndex((n) => n + 1), 120);
    }
  }

  function handleRestart() {
    setIndex(0);
    setFlipped(false);
    setKnownIds([]);
    setUnknownIds([]);
    setPhase('review');
  }

  if (phase === 'finished') {
    const ratio = total > 0 ? Math.round((knownIds.length / total) * 100) : 0;
    return (
      <SessionSummary
        themeId={themeId}
        themeName={themeName}
        themeColor={themeColor}
        known={knownIds.length}
        unknown={unknownIds.length}
        total={total}
        ratio={ratio}
        onRestart={handleRestart}
      />
    );
  }

  const progressPct = ((index + (flipped ? 0.5 : 0)) / total) * 100;

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
            Carte {index + 1} / {total}
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-bone-deep border border-aubergine/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%`, backgroundColor: themeColor }}
          />
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span
            className="
              flex items-center justify-center h-6 w-6 rounded-md text-bone font-bold text-[0.7rem]
              shadow-[0_1px_0_rgb(45_27_46)]
            "
            style={{ backgroundColor: themeColor }}
            aria-hidden
          >
            {themeId}
          </span>
          <span className="text-ink-mute">Thème {themeId} · {themeName}</span>
        </div>
        {!hasTranslationsForLang ? (
          <TranslationPendingNotice
            lang={currentLang}
            variant="boxed"
            className="mt-4"
          />
        ) : null}
      </header>

      <FlipCard
        key={card.id}
        front={card.front}
        back={card.back}
        translatedFront={getCardTranslation(card, currentLang)?.front}
        translatedBack={getCardTranslation(card, currentLang)?.back}
        rtl={isRtl(currentLang)}
        flipped={flipped}
        themeColor={themeColor}
        onFlip={() => setFlipped((f) => !f)}
      />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => handleAnswer('unknown')}
          disabled={!flipped}
          className="
            rounded-2xl border-[1.5px] border-terracotta bg-terracotta/10
            px-5 py-4 text-terracotta font-semibold
            shadow-[0_2px_0_rgb(45_27_46)]
            transition-all hover:bg-terracotta hover:text-bone hover:-translate-y-0.5
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-terracotta/10 disabled:hover:text-terracotta
            inline-flex items-center justify-center gap-2
          "
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          À revoir
        </button>
        <button
          type="button"
          onClick={() => handleAnswer('known')}
          disabled={!flipped}
          className="
            rounded-2xl border-[1.5px] border-saffron bg-saffron/15
            px-5 py-4 text-aubergine font-semibold
            shadow-[0_2px_0_rgb(45_27_46)]
            transition-all hover:bg-saffron hover:-translate-y-0.5
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-saffron/15
            inline-flex items-center justify-center gap-2
          "
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Je sais
        </button>
      </div>

      <p className="text-center text-xs text-ink-mute mt-5 font-display italic">
        {flipped ? '— Choisissez votre réponse' : '— Touchez la carte pour la retourner'}
      </p>
    </div>
  );
}

function FlipCard({
  front,
  back,
  translatedFront,
  translatedBack,
  rtl,
  flipped,
  themeColor,
  onFlip,
}: {
  front: string;
  back: string;
  translatedFront?: string;
  translatedBack?: string;
  rtl: boolean;
  flipped: boolean;
  themeColor: string;
  onFlip: () => void;
}) {
  return (
    <div
      className="select-none"
      style={{ perspective: '1600px' }}
    >
      <button
        type="button"
        onClick={onFlip}
        aria-label={flipped ? 'Retourner — voir la question' : 'Retourner — voir la réponse'}
        className="
          relative w-full aspect-[3/4] sm:aspect-[4/3] block
          rounded-3xl outline-none
          focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone
        "
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 600ms cubic-bezier(0.34, 1.2, 0.64, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="
            absolute inset-0 rounded-3xl card !p-7 sm:!p-10
            flex flex-col items-center justify-center text-center gap-6
          "
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <span
            className="
              flex h-12 w-12 items-center justify-center rounded-2xl text-bone
              shadow-[0_2px_0_rgb(45_27_46)]
            "
            style={{ backgroundColor: themeColor }}
            aria-hidden
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p
            className="font-display text-2xl sm:text-3xl leading-snug font-medium text-aubergine"
            style={{ fontVariationSettings: "'opsz' 36" }}
          >
            {front}
          </p>
          {translatedFront ? (
            <p
              className="text-base sm:text-lg text-ink-mute italic font-display leading-snug"
              dir={rtl ? 'rtl' : undefined}
            >
              {translatedFront}
            </p>
          ) : null}
          <p className="text-xs text-ink-mute font-display italic">
            — Touchez pour révéler
          </p>
        </div>

        {/* Back */}
        <div
          className="
            absolute inset-0 rounded-3xl !p-7 sm:!p-10
            border-[1.5px] border-aubergine
            flex flex-col items-center justify-center text-center gap-6
            shadow-[0_3px_0_rgb(45_27_46)]
          "
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: themeColor,
            color: '#FAF6F0',
          }}
        >
          <span
            className="
              flex h-12 w-12 items-center justify-center rounded-2xl
              bg-bone/15 border border-bone/30
            "
            aria-hidden
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p
            className="font-display text-xl sm:text-2xl leading-relaxed font-medium"
            style={{ fontVariationSettings: "'opsz' 32" }}
          >
            {back}
          </p>
          {translatedBack ? (
            <p
              className="text-sm sm:text-base text-bone/80 italic font-display leading-relaxed"
              dir={rtl ? 'rtl' : undefined}
            >
              {translatedBack}
            </p>
          ) : null}
        </div>
      </button>
    </div>
  );
}

function SessionSummary({
  themeId,
  themeName,
  themeColor,
  known,
  unknown,
  total,
  ratio,
  onRestart,
}: {
  themeId: number;
  themeName: string;
  themeColor: string;
  known: number;
  unknown: number;
  total: number;
  ratio: number;
  onRestart: () => void;
}) {
  const headline =
    ratio >= 90 ? 'Excellent !' : ratio >= 70 ? 'Bien joué.' : ratio >= 40 ? 'En progrès.' : 'À retravailler.';
  const subtitle =
    ratio >= 90
      ? 'Vous maîtrisez très bien ces cartes.'
      : ratio >= 70
      ? 'Quelques cartes à revoir, vous y êtes presque.'
      : ratio >= 40
      ? 'Continuez à pratiquer, ça monte.'
      : 'Reprenez les bases, une carte à la fois.';

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-10 py-12 sm:py-20">
      <div className="text-center mb-10">
        <p className="eyebrow mb-3">— Thème {themeId} · {themeName}</p>
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
              {ratio}
            </span>
            <span className="text-xs opacity-80 mt-1">%</span>
          </div>
          <p className="text-sm text-ink-mute font-display italic">
            {known} sus · {unknown} à revoir · {total} cartes
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border-[1.5px] border-saffron/40 bg-saffron/10 p-4 text-center">
            <p
              className="font-display text-3xl font-medium text-aubergine"
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              {known}
            </p>
            <p className="text-xs text-aubergine/70 font-semibold uppercase tracking-wider mt-1">
              Maîtrisées
            </p>
          </div>
          <div className="rounded-2xl border-[1.5px] border-terracotta/40 bg-terracotta/10 p-4 text-center">
            <p
              className="font-display text-3xl font-medium text-terracotta"
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              {unknown}
            </p>
            <p className="text-xs text-terracotta/80 font-semibold uppercase tracking-wider mt-1">
              À revoir
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="btn-primary flex-1 !justify-center"
        >
          Recommencer
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <Link href="/app/flashcards" className="btn-secondary !justify-center flex-1">
          Choisir un autre thème
        </Link>
      </div>
    </div>
  );
}
