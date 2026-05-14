import { FLASHCARDS } from '@/lib/data/flashcards';
import { FlashcardSession } from '@/components/flashcard/FlashcardSession';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentLang } from '@/lib/server/lang';

/**
 * Cross-theme flashcard session — the "Cartes mémo classiques" entry on
 * /app/flashcards lands here. Loads all 150 cards from every theme, the
 * client component then shuffles them once per mount.
 *
 * Previously the homepage CTA was a `#themes` anchor that just scrolled
 * the user to the per-theme grid; users would tap it expecting a session
 * to start and nothing happened. This route is the actual destination.
 *
 * `themeId={0}` is the established sentinel for "no specific theme" —
 * FlashcardSession swaps the numeric badge for a 📚 glyph and drops the
 * "Thème N · ..." prefix from the subtitle.
 */
export default async function FlashcardsAllPage() {
  const user = await getCurrentUser();
  const currentLang = await getCurrentLang(user?.preferredLang);

  return (
    <FlashcardSession
      cards={FLASHCARDS}
      themeId={0}
      themeName="Toutes les cartes mémo"
      // Aubergine — neutral / cross-theme. Per-theme pages keep their
      // theme-specific accent color; this one stays brand-neutral so the
      // mixed deck doesn't visually claim one theme over another.
      themeColor="#2D1B2E"
      currentLang={currentLang}
    />
  );
}
