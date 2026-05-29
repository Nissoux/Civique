import Link from 'next/link';
import { FLASHCARDS } from '@/lib/data/flashcards';
import { FlashcardSession } from '@/components/flashcard/FlashcardSession';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentLang } from '@/lib/server/lang';
import { fetchDueIds } from '@/lib/actions/srs';

export const metadata = {
  title: 'Révisions du jour',
  description:
    "Vos cartes mémo programmées pour aujourd'hui par l'algorithme de répétition espacée.",
};

/**
 * /app/flashcards/due — "Révisions du jour" mode.
 *
 * Pulls the SM-2 due ids from the server, filters the static FLASHCARDS
 * pool to just those cards, and hands the slice to the regular
 * FlashcardSession component. The user gets the same review UX as any
 * theme deck, but the deck is precisely "what your brain is about to
 * forget".
 *
 * Edge cases handled:
 *   - No due cards yet (new user, or all caught up) → friendly empty
 *     state with a CTA back to the per-theme decks.
 *   - SRS API down → fetchDueIds returns []; same empty-state copy.
 *     We never want to fail closed and hide flashcards entirely just
 *     because the spaced-repetition layer is having a bad day.
 *   - Due ids referencing cards we don't have (theoretically possible
 *     after a content version bump that removes cards) → filtered out
 *     by the `.filter` and just ignored.
 */
export default async function FlashcardsDuePage() {
  const user = await getCurrentUser();
  const currentLang = await getCurrentLang(user?.preferredLang);

  // Up to 50 cards per session — a healthy daily ceiling that maps to
  // ~10–15 min of focused review, the sweet spot SM-2 research
  // recommends for retention without burnout.
  const dueIds = await fetchDueIds('flashcard', 50);
  const dueSet = new Set(dueIds);
  const cards = FLASHCARDS.filter((c) => dueSet.has(c.id));

  if (cards.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlashcardSession
      cards={cards}
      themeId={0}
      themeName={`Révisions du jour — ${cards.length} ${cards.length > 1 ? 'cartes' : 'carte'}`}
      themeColor="#D4724A"
      currentLang={currentLang}
    />
  );
}

function EmptyState() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24 text-center">
      <div
        className="
          mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl
          bg-saffron/20 text-saffron shadow-[0_3px_0_rgba(0,0,0,0.08)]
        "
        aria-hidden
      >
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p className="eyebrow mb-3">— Révisions du jour</p>
      <h1
        className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] mb-4 font-medium tracking-tight"
        style={{ fontVariationSettings: "'opsz' 60" }}
      >
        Vous êtes <span className="display-italic text-terracotta">à jour</span>.
      </h1>
      <p className="text-ink-mute leading-relaxed mb-8">
        L'algorithme de répétition espacée n'a aucune carte à vous proposer
        en ce moment. Revenez demain — vos prochaines cartes seront prêtes
        au moment où votre mémoire commence à s'estomper.
      </p>
      <p className="text-sm text-ink-mute font-display italic mb-8">
        Vous pouvez en attendant explorer les cartes par thème ou un autre
        mode de révision.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/app/flashcards" className="btn-primary">
          Choisir un thème
        </Link>
        <Link href="/app/flashcards/all" className="btn-secondary">
          Toutes les cartes mémo
        </Link>
      </div>
    </div>
  );
}
