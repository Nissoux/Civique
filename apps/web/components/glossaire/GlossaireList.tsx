'use client';

import { useMemo, useState } from 'react';
import { THEMES, LANGUAGES, type Language } from '@civique/shared';
import type { GlossaryTerm } from '@/lib/data/glossaire';
import { TranslationPendingNotice } from '@/components/nav/TranslationStatus';

interface Props {
  terms: GlossaryTerm[];
  currentLang: Language;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function firstLetter(term: string): string {
  const n = normalize(term).trim();
  const c = n.charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

function isRtl(lang: Language): boolean {
  return LANGUAGES.find((l) => l.code === lang)?.rtl ?? false;
}

function getTranslation(
  term: GlossaryTerm,
  lang: Language,
): { term: string; definition: string } | undefined {
  if (lang === 'fr') return undefined;
  // Narrow to the languages with translation data (matches the type).
  if (lang === 'ar' || lang === 'es' || lang === 'fa' || lang === 'hi' || lang === 'pt') {
    return term.translations[lang];
  }
  return undefined;
}

export function GlossaireList({ terms, currentLang }: Props) {
  const [query, setQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState<number | null>(null);

  const rtl = isRtl(currentLang);

  // We carry translations for ar/es/fa/hi/pt in the static glossary file.
  // Any other non-FR language (today: en, tr) falls back to FR — surface a
  // discreet notice so the user knows the choice was registered.
  const hasTranslationsForLang =
    currentLang === 'fr' ||
    currentLang === 'ar' ||
    currentLang === 'es' ||
    currentLang === 'fa' ||
    currentLang === 'hi' ||
    currentLang === 'pt';

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return terms.filter((t) => {
      if (themeFilter !== null && t.themeId !== themeFilter) return false;
      if (!q) return true;
      // Search FR primary text.
      if (
        normalize(t.term).includes(q) ||
        normalize(t.definition).includes(q)
      ) {
        return true;
      }
      // Search the active translation as well, so a user can find a term in
      // their language.
      const tr = getTranslation(t, currentLang);
      if (tr) {
        if (
          normalize(tr.term).includes(q) ||
          normalize(tr.definition).includes(q)
        ) {
          return true;
        }
      }
      return false;
    });
  }, [terms, query, themeFilter, currentLang]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    const sorted = [...filtered].sort((a, b) =>
      normalize(a.term).localeCompare(normalize(b.term), 'fr'),
    );
    for (const t of sorted) {
      const k = firstLetter(t.term);
      const arr = map.get(k) ?? [];
      arr.push(t);
      map.set(k, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const totalCount = filtered.length;

  return (
    <div className="space-y-7">
      {!hasTranslationsForLang ? (
        <TranslationPendingNotice lang={currentLang} variant="boxed" />
      ) : null}

      {/* Search bar */}
      <div className="relative">
        <input
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un terme, une définition…"
          aria-label="Rechercher un terme"
          className="
            field-input pl-12 pr-4 py-3 text-base
            placeholder:text-ink-mute/70
          "
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-mute pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Effacer la recherche"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full text-ink-mute hover:bg-bone-deep hover:text-aubergine"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Theme pill filters */}
      <div className="flex flex-wrap gap-2">
        <FilterPill
          active={themeFilter === null}
          onClick={() => setThemeFilter(null)}
          label="Tous les thèmes"
        />
        {THEMES.map((t) => (
          <FilterPill
            key={t.id}
            active={themeFilter === t.id}
            onClick={() => setThemeFilter(t.id)}
            label={`Thème ${t.id}`}
            color={t.color}
          />
        ))}
      </div>

      <p className="text-sm text-ink-mute font-display italic">
        — {totalCount} {totalCount > 1 ? 'termes' : 'terme'}
        {query ? ` pour « ${query} »` : ''}
      </p>

      {/* Empty state */}
      {grouped.length === 0 ? (
        <div className="card !rounded-3xl !p-10 text-center">
          <p className="font-display text-2xl mb-2" style={{ fontVariationSettings: "'opsz' 36" }}>
            Aucun résultat
          </p>
          <p className="text-sm text-ink-mute">
            Essayez avec d'autres mots-clés.
          </p>
        </div>
      ) : null}

      {/* Grouped list */}
      <div className="space-y-10">
        {grouped.map(([letter, items]) => (
          <section key={letter}>
            <header className="flex items-baseline gap-3 mb-4">
              <span
                className="
                  flex h-10 w-10 items-center justify-center rounded-xl
                  bg-aubergine text-bone font-display font-medium text-lg
                  shadow-[0_2px_0_rgb(45_27_46)]
                "
                style={{ fontVariationSettings: "'opsz' 32" }}
                aria-hidden
              >
                {letter}
              </span>
              <span className="text-xs text-ink-mute uppercase tracking-wider">
                {items.length} {items.length > 1 ? 'termes' : 'terme'}
              </span>
              <span className="flex-1 h-px bg-aubergine/15" />
            </header>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((t) => (
                <TermCard
                  key={t.id}
                  term={t}
                  query={query}
                  currentLang={currentLang}
                  rtl={rtl}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex items-center gap-2 rounded-full px-3.5 py-1.5
        text-xs font-semibold border-[1.5px] transition-all
        ${
          active
            ? 'bg-aubergine text-bone border-aubergine shadow-[0_2px_0_rgb(45_27_46)]'
            : 'bg-bone text-aubergine border-aubergine/20 hover:border-aubergine/40'
        }
      `}
    >
      {color ? (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      ) : null}
      {label}
    </button>
  );
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const nQ = normalize(q);
  if (!nQ) return text;

  // Build a per-char normalized form so we can map normalized positions
  // back to original indices (handles diacritics correctly).
  const chars: string[] = [];
  const offsets: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const stripped = normalize(text[i]);
    if (stripped) {
      chars.push(stripped);
      offsets.push(i);
    }
  }
  const flat = chars.join('');
  const idx = flat.indexOf(nQ);
  if (idx === -1) return text;

  const start = offsets[idx];
  const endIndex = idx + nQ.length - 1;
  const end =
    endIndex < offsets.length
      ? offsets[endIndex] + 1
      : start + nQ.length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-saffron/40 text-aubergine rounded-sm px-0.5">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  );
}

function TermCard({
  term,
  query,
  currentLang,
  rtl,
}: {
  term: GlossaryTerm;
  query: string;
  currentLang: Language;
  rtl: boolean;
}) {
  const theme = THEMES.find((t) => t.id === term.themeId);
  const tr = getTranslation(term, currentLang);
  return (
    <li className="card !rounded-2xl !p-5 hover:-translate-y-0.5 transition-transform">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <h3
          className="font-display text-lg font-medium leading-snug"
          style={{ fontVariationSettings: "'opsz' 32" }}
        >
          {highlight(term.term, query)}
        </h3>
        {theme ? (
          <span
            className="
              shrink-0 inline-flex items-center justify-center
              h-5 w-5 rounded-md text-bone font-bold text-[0.65rem]
            "
            style={{ backgroundColor: theme.color }}
            title={`Thème ${theme.id} · ${theme.nameFr}`}
            aria-label={`Thème ${theme.id}`}
          >
            {theme.id}
          </span>
        ) : null}
      </div>
      <p className="text-sm text-ink-mute leading-relaxed">
        {highlight(term.definition, query)}
      </p>
      {tr ? (
        <p
          className="mt-1.5 text-sm text-ink-mute italic font-display leading-relaxed"
          dir={rtl ? 'rtl' : undefined}
        >
          {highlight(tr.definition, query)}
        </p>
      ) : null}
    </li>
  );
}
