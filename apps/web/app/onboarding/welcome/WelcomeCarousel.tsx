'use client';

import { useState, useTransition, type ReactNode } from 'react';
import { completeWelcomeAction } from '@/lib/actions/welcome';

interface Slide {
  id: string;
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  icon: ReactNode;
}

const SLIDES: Slide[] = [
  {
    id: 'welcome',
    eyebrow: '— Bienvenue sur Civique',
    title: (
      <>
        Préparez votre <span className="display-italic text-terracotta">examen civique</span> français avec confiance.
      </>
    ),
    subtitle: 'Une préparation rigoureuse, à votre rythme, dans votre langue.',
    icon: <ShieldIcon />,
  },
  {
    id: 'train',
    eyebrow: '— Entraînez-vous',
    title: (
      <>
        611 questions QCM + 240 d'entretien et <span className="display-italic text-saffron">8 langues</span> disponibles.
      </>
    ),
    subtitle: "Pratiquez par thème, simulez l'examen officiel, traduisez à la volée.",
    icon: <DumbbellIcon />,
  },
  {
    id: 'progress',
    eyebrow: '— Suivez votre progression',
    title: (
      <>
        Statistiques détaillées, flashcards et <span className="display-italic text-terracotta">fiches mémo</span>.
      </>
    ),
    subtitle: 'Mesurez vos progrès, identifiez vos points faibles, retenez l\'essentiel.',
    icon: <ChartIcon />,
  },
];

const STORAGE_KEY = 'civique_welcome_done';

export function WelcomeCarousel() {
  const [index, setIndex] = useState(0);
  const [pending, startTransition] = useTransition();

  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  function markLocal() {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // silent
      }
    }
  }

  function handleNext() {
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    handleComplete();
  }

  function handlePrev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  function handleComplete() {
    markLocal();
    startTransition(async () => {
      await completeWelcomeAction();
    });
  }

  return (
    <section
      className="
        relative overflow-hidden
        bg-aubergine text-bone
        min-h-screen flex flex-col
      "
    >
      {/* Decorative blurs — match auth shell vibe */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-terracotta/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-saffron/20 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgb(244 236 221) 0 2px, transparent 2px 12px), repeating-linear-gradient(-45deg, rgb(244 236 221) 0 1px, transparent 1px 12px)',
        }}
      />

      {/* Top bar — Passer */}
      <header className="relative flex items-center justify-end px-6 sm:px-10 py-5">
        {!isLast ? (
          <button
            type="button"
            onClick={handleComplete}
            disabled={pending}
            className="
              text-bone/60 hover:text-bone text-sm font-medium
              transition-colors disabled:opacity-50
            "
          >
            Passer
          </button>
        ) : null}
      </header>

      {/* Slide content */}
      <div className="relative flex-1 flex items-center justify-center px-6 sm:px-10">
        <div
          key={slide.id}
          className="
            max-w-xl text-center w-full
            animate-[rise_0.5s_ease-out]
          "
        >
          <div
            className="
              mx-auto mb-10 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center
              rounded-3xl bg-bone/10 border border-bone/20
              shadow-[0_4px_0_rgba(0,0,0,0.25)]
            "
            aria-hidden
          >
            <span className="text-saffron">{slide.icon}</span>
          </div>
          <p className="font-display italic text-saffron text-base sm:text-lg mb-3">
            {slide.eyebrow}
          </p>
          <h1
            className="
              font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]
              font-medium tracking-tight mb-5
            "
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            {slide.title}
          </h1>
          <p className="text-bone/80 text-base sm:text-lg leading-relaxed">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom — dots + buttons */}
      <footer className="relative px-6 sm:px-10 pb-10 pt-6">
        <div className="max-w-xl mx-auto">
          <div
            className="flex items-center justify-center gap-2 mb-7"
            role="tablist"
            aria-label="Progression"
          >
            {SLIDES.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Aller à la diapositive ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`
                    h-2 rounded-full transition-all
                    ${active ? 'w-7 bg-bone' : 'w-2 bg-bone/40 hover:bg-bone/60'}
                  `}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {index > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={pending}
                className="
                  inline-flex items-center justify-center gap-1.5
                  rounded-full border border-bone/25 bg-bone/5 hover:bg-bone/10
                  px-5 py-3.5 text-sm font-semibold text-bone
                  transition-colors disabled:opacity-50
                "
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Précédent
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleNext}
              disabled={pending}
              className="
                flex-1 inline-flex items-center justify-center gap-2
                rounded-full bg-bone text-aubergine
                px-6 py-3.5 text-base font-semibold
                shadow-[0_3px_0_rgba(0,0,0,0.25)]
                hover:-translate-y-0.5 transition-all
                disabled:opacity-60 disabled:cursor-wait disabled:translate-y-0
              "
            >
              {isLast ? (pending ? 'Préparation…' : 'Commencer') : 'Suivant'}
              {isLast ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}

// ── Icons — inline SVG to avoid extra deps ───────────────────

function ShieldIcon() {
  return (
    <svg
      className="h-12 w-12 sm:h-14 sm:w-14"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function DumbbellIcon() {
  return (
    <svg
      className="h-12 w-12 sm:h-14 sm:w-14"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className="h-12 w-12 sm:h-14 sm:w-14"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6m4 6V5m4 14v-9M3 21h18"
      />
    </svg>
  );
}
