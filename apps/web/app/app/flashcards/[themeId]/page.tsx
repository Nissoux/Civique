import { notFound } from 'next/navigation';
import { THEMES } from '@civique/shared';
import { FLASHCARDS } from '@/lib/data/flashcards';
import { FlashcardSession } from '@/components/flashcard/FlashcardSession';

interface Params {
  themeId: string;
}

export default async function FlashcardThemePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { themeId: rawThemeId } = await params;
  const themeId = Number(rawThemeId);
  if (!Number.isFinite(themeId)) notFound();

  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) notFound();

  const cards = FLASHCARDS.filter((c) => c.themeId === themeId);
  if (cards.length === 0) notFound();

  return (
    <FlashcardSession
      cards={cards}
      themeId={theme.id}
      themeName={theme.nameFr}
      themeColor={theme.color}
    />
  );
}
