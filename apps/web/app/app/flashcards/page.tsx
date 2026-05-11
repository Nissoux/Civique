import Link from 'next/link';
import { FLASHCARDS } from '@/lib/data/flashcards';
import { ThemeSelector } from '@/components/flashcard/ThemeSelector';

export const metadata = {
  title: 'Révisions — Civique',
  description:
    'Cartes mémo et quiz de révision pour préparer votre examen civique.',
};

export default function FlashcardsHubPage() {
  const totalCards = FLASHCARDS.length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="
          relative bg-aubergine text-bone overflow-hidden
          border-b-[1.5px] border-aubergine
        "
      >
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-saffron/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-terracotta/25 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-10 sm:py-14">
          <p className="font-display italic text-saffron text-base mb-2">
            — Révisions
          </p>
          <h1
            className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-tight mb-3"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            Mémoriser, <span className="display-italic text-terracotta">à votre rythme</span>.
          </h1>
          <p className="text-bone/75 max-w-xl leading-relaxed">
            {totalCards} cartes mémo et un quiz mixte pour ancrer les notions
            essentielles avant l'examen.
          </p>
        </div>
      </section>

      {/* Two main CTAs */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="#themes"
            className="
              card !rounded-2xl p-6 flex items-center gap-5
              transition-all hover:-translate-y-1 hover:shadow-clay-lg
            "
          >
            <div
              className="
                flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
                bg-saffron text-aubergine shadow-[0_2px_0_rgb(45_27_46)]
              "
              aria-hidden
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-display text-xl font-medium"
                style={{ fontVariationSettings: "'opsz' 32" }}
              >
                Cartes mémo classiques
              </h3>
              <p className="text-sm text-ink-mute">
                Question/réponse, je sais ou à revoir
              </p>
            </div>
            <ArrowIcon />
          </Link>

          <Link
            href="/app/flashcards/quiz"
            className="
              card !rounded-2xl p-6 flex items-center gap-5
              transition-all hover:-translate-y-1 hover:shadow-clay-lg
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-display text-xl font-medium"
                style={{ fontVariationSettings: "'opsz' 32" }}
              >
                Quiz révision
              </h3>
              <p className="text-sm text-ink-mute">
                10 questions mixtes (7 connaissances + 3 situations)
              </p>
            </div>
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* Themes */}
      <section
        id="themes"
        className="max-w-5xl mx-auto px-6 sm:px-10 py-10 sm:py-12 scroll-mt-8"
      >
        <div className="mb-7">
          <p className="eyebrow mb-3">— Cartes mémo par thème</p>
          <h2
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            Choisissez un thème.
          </h2>
        </div>
        <ThemeSelector />
      </section>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-aubergine/40"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
