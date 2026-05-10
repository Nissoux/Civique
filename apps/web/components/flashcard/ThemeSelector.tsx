'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { THEMES } from '@civique/shared';
import { FLASHCARDS } from '@/lib/data/flashcards';
import { useFlashcardStore } from '@/lib/stores/flashcardStore';

export function ThemeSelector() {
  const loadProgress = useFlashcardStore((s) => s.loadProgress);
  const loaded = useFlashcardStore((s) => s.loaded);
  const getThemeProgress = useFlashcardStore((s) => s.getThemeProgress);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {THEMES.map((theme) => {
        const progress = loaded
          ? getThemeProgress(theme.id, FLASHCARDS)
          : { known: 0, unknown: 0, total: FLASHCARDS.filter((c) => c.themeId === theme.id).length };
        const pct =
          progress.total > 0
            ? Math.round((progress.known / progress.total) * 100)
            : 0;

        return (
          <Link
            key={theme.id}
            href={`/app/flashcards/${theme.id}`}
            className="
              card !rounded-2xl !p-5 flex flex-col gap-4
              transition-all hover:-translate-y-0.5 hover:shadow-clay-lg
            "
          >
            <div className="flex items-start gap-4">
              <span
                className="
                  flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
                  font-display text-xl font-medium text-bone
                  shadow-[0_2px_0_rgb(45_27_46)]
                "
                style={{
                  backgroundColor: theme.color,
                  fontVariationSettings: "'opsz' 32",
                }}
                aria-hidden
              >
                {theme.id}
              </span>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-display text-lg font-medium leading-tight"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  {theme.nameFr}
                </h3>
                <p className="text-xs text-ink-mute mt-0.5">
                  {progress.total} {progress.total > 1 ? 'cartes' : 'carte'}
                </p>
              </div>
              <span className="text-xs text-ink-mute font-display italic shrink-0">
                {pct}%
              </span>
            </div>

            <div className="relative h-2 rounded-full bg-bone-deep border border-aubergine/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: theme.color }}
              />
            </div>
            <p className="text-xs text-ink-mute">
              {progress.known} sus · {progress.unknown} à revoir
            </p>
          </Link>
        );
      })}
    </div>
  );
}
