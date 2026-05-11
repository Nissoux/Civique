'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { THEMES, type Fiche } from '@civique/shared';
import { FicheCard } from './FicheCard';

interface Props {
  fichesByTheme: Record<number, Fiche[]>;
}

const ALL = -1 as const;

/**
 * Client wrapper that owns the theme filter pills and search input.
 * Receives fiches grouped by theme from the Server Component parent and
 * renders FicheCards filtered by the current selection / query.
 */
export function ThemeFilter({ fichesByTheme }: Props) {
  const [selected, setSelected] = useState<number>(ALL);
  const [query, setQuery] = useState('');

  const totalFiches = useMemo(
    () => Object.values(fichesByTheme).reduce((sum, arr) => sum + arr.length, 0),
    [fichesByTheme],
  );

  const normalizedQuery = query.trim().toLowerCase();

  // Build the visible groups: filter by theme, then by search query
  const visibleGroups = useMemo(() => {
    const groups = THEMES
      .filter((t) => selected === ALL || t.id === selected)
      .map((t) => {
        const list = fichesByTheme[t.id] ?? [];
        const filtered = normalizedQuery
          ? list.filter((f) => {
              const haystack = [
                f.titleFr,
                f.translatedTitle,
                f.contentFr,
                f.translatedContent,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
              return haystack.includes(normalizedQuery);
            })
          : list;
        return { theme: t, fiches: filtered };
      });
    return groups;
  }, [selected, normalizedQuery, fichesByTheme]);

  const visibleCount = visibleGroups.reduce((sum, g) => sum + g.fiches.length, 0);
  const hasResults = visibleCount > 0;

  return (
    <div className="space-y-8">
      {/* Search input */}
      <div className="relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-mute"
          aria-hidden
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une fiche..."
          className="field-input !pl-10"
          aria-label="Rechercher dans les fiches"
        />
      </div>

      {/* Theme filter pills */}
      <div className="flex flex-wrap gap-2">
        <FilterPill
          active={selected === ALL}
          onClick={() => setSelected(ALL)}
        >
          <span>Tous les thèmes</span>
          <span className="text-xs text-ink-mute font-normal ml-1">
            ({totalFiches})
          </span>
        </FilterPill>
        {THEMES.map((t) => {
          const count = fichesByTheme[t.id]?.length ?? 0;
          return (
            <FilterPill
              key={t.id}
              active={selected === t.id}
              onClick={() => setSelected(t.id)}
              dotColor={t.color}
            >
              <span className="truncate">{t.nameFr}</span>
              <span className="text-xs text-ink-mute font-normal ml-1">
                ({count})
              </span>
            </FilterPill>
          );
        })}
      </div>

      {/* Results */}
      {!hasResults ? (
        <div className="card !rounded-2xl !p-8 text-center">
          <p className="font-display italic text-ink-mute mb-2">
            — Aucun résultat
          </p>
          <p className="text-sm text-ink-mute">
            {normalizedQuery
              ? `Aucune fiche ne correspond à « ${query} ».`
              : 'Aucune fiche disponible pour ce thème.'}
          </p>
          {(query || selected !== ALL) && (
            <button
              onClick={() => {
                setQuery('');
                setSelected(ALL);
              }}
              className="mt-4 text-sm font-semibold text-terracotta hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {visibleGroups.map(({ theme, fiches }) => {
            if (fiches.length === 0) return null;
            return (
              <section key={theme.id}>
                <header className="flex items-center gap-3 mb-4">
                  <span
                    aria-hidden
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: theme.color }}
                  />
                  <h2
                    className="font-display text-lg sm:text-xl font-medium text-aubergine flex-1 min-w-0"
                    style={{ fontVariationSettings: "'opsz' 36" }}
                  >
                    {theme.nameFr}
                  </h2>
                  <span className="text-xs text-ink-mute uppercase tracking-wider">
                    {fiches.length} fiche{fiches.length > 1 ? 's' : ''}
                  </span>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fiches.map((f) => (
                    <FicheCard
                      key={f.id}
                      fiche={f}
                      themeColor={theme.color}
                      themeName={theme.nameFr}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Footer hint */}
      <p className="text-center text-xs text-ink-mute pt-2">
        <Link href="/app" className="hover:underline">
          ← Retour au tableau de bord
        </Link>
      </p>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  dotColor,
  children,
}: {
  active: boolean;
  onClick: () => void;
  dotColor?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-full px-4 py-1.5
        text-sm font-medium transition-all border-[1.5px]
        ${
          active
            ? 'bg-aubergine text-bone border-aubergine shadow-[0_2px_0_rgb(74_45_67)]'
            : 'bg-bone text-aubergine border-aubergine/30 hover:border-aubergine hover:bg-bone-deep'
        }
      `}
    >
      {dotColor ? (
        <span
          aria-hidden
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
      {children}
    </button>
  );
}
