'use client';

import { useMemo, useState } from 'react';
import { LANGUAGES, type Language } from '@civique/shared';

interface Question {
  id: number;
  category: string;
  text_fr: string;
  answer_hint: string;
  translations: {
    en?: { text: string; answer_hint: string };
    tr?: { text: string; answer_hint: string };
  };
}

interface Props {
  data: {
    total: number;
    categories: Record<string, string>;
    questions: Question[];
  };
  currentLang: Language;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function isRtl(lang: Language): boolean {
  return LANGUAGES.find((l) => l.code === lang)?.rtl ?? false;
}

function getTranslation(
  q: Question,
  lang: Language,
): { text: string; answer_hint: string } | undefined {
  if (lang === 'fr') return undefined;
  if (lang === 'en' || lang === 'tr') return q.translations[lang];
  return undefined;
}

/**
 * EntretienBrowser
 *
 * Client-side question explorer for the préfecture assimilation interview.
 *
 * UX choices
 * ----------
 *   - Hero with terracotta italic "Entretien" + a 30-second context
 *     paragraph explaining what the interview is and the B2 oral
 *     requirement since the Retailleau circulaire (2 May 2025).
 *   - Sticky category pills row: 6 themes + "Tous". Counts are baked in.
 *   - Live search across FR + active-lang translation text, normalized
 *     for diacritics so "etat" matches "État".
 *   - Each card shows FR as primary; the active translation (if not FR)
 *     appears in italic mute just below. Clicking expands the answer hint.
 *
 * The "answer hint" is rendered with a distinct visual treatment
 * (saffron background, italic eyebrow) so it reads as "guidance, not
 * a rigid script" — matching the spirit of the brief.
 */
export function EntretienBrowser({ data, currentLang }: Props) {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const rtl = isRtl(currentLang);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of data.questions) {
      map[q.category] = (map[q.category] ?? 0) + 1;
    }
    return map;
  }, [data.questions]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return data.questions.filter((entry) => {
      if (activeCat && entry.category !== activeCat) return false;
      if (!q) return true;
      if (normalize(entry.text_fr).includes(q)) return true;
      if (normalize(entry.answer_hint).includes(q)) return true;
      const tr = getTranslation(entry, currentLang);
      if (tr) {
        if (normalize(tr.text).includes(q)) return true;
        if (normalize(tr.answer_hint).includes(q)) return true;
      }
      return false;
    });
  }, [data.questions, activeCat, query, currentLang]);

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-aubergine text-bone border-b-[1.5px] border-aubergine">
        <div className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-saffron/20 blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-10 py-10 sm:py-14">
          <p className="eyebrow text-saffron/90 mb-3">— Naturalisation · Préparation orale</p>
          <h1
            className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] mb-4 font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            <span className="display-italic text-terracotta">Entretien</span>{' '}
            d'assimilation.
          </h1>
          <p className="text-bone/80 text-[1.02rem] leading-[1.6] max-w-2xl">
            {data.total} questions types compilées des préfectures et des
            associations de préparation. L'entretien dure 20 à 40 minutes ;
            le niveau de français exigé est <strong>B2 oral</strong> depuis
            la circulaire Retailleau du 2 mai 2025. Pas de réponse-type
            rigide : chaque question s'accompagne d'un conseil de réponse.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 py-10">
        {/* Search */}
        <div className="relative mb-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une question, un mot clé…"
            aria-label="Rechercher une question d'entretien"
            className="field-input pl-12 pr-10 py-3 text-base placeholder:text-ink-mute/70"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-mute pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <CatPill
            label={`Toutes les questions (${data.total})`}
            active={activeCat === null}
            onClick={() => setActiveCat(null)}
          />
          {Object.entries(data.categories).map(([key, label]) => (
            <CatPill
              key={key}
              label={`${label} (${categoryCounts[key] ?? 0})`}
              active={activeCat === key}
              onClick={() => setActiveCat(key)}
            />
          ))}
        </div>

        {/* Result count */}
        <p className="text-sm text-ink-mute font-display italic mb-5">
          — {filtered.length} {filtered.length > 1 ? 'questions' : 'question'}
          {query ? ` pour « ${query} »` : ''}
        </p>

        {/* Question list */}
        {filtered.length === 0 ? (
          <div className="card !rounded-3xl !p-10 text-center">
            <p className="font-display text-2xl mb-2" style={{ fontVariationSettings: "'opsz' 36" }}>
              Aucun résultat
            </p>
            <p className="text-sm text-ink-mute">Essayez avec d'autres mots-clés.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                isExpanded={expanded.has(q.id)}
                onToggle={() => toggle(q.id)}
                translation={getTranslation(q, currentLang)}
                rtl={rtl}
                categoryLabel={data.categories[q.category] ?? q.category}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CatPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex items-center rounded-full px-3.5 py-1.5
        text-xs font-semibold border-[1.5px] transition-all
        ${
          active
            ? 'bg-aubergine text-bone border-aubergine shadow-[0_2px_0_rgb(45_27_46)]'
            : 'bg-bone text-aubergine border-aubergine/20 hover:border-aubergine/40'
        }
      `}
    >
      {label}
    </button>
  );
}

function QuestionCard({
  question,
  isExpanded,
  onToggle,
  translation,
  rtl,
  categoryLabel,
}: {
  question: Question;
  isExpanded: boolean;
  onToggle: () => void;
  translation: { text: string; answer_hint: string } | undefined;
  rtl: boolean;
  categoryLabel: string;
}) {
  return (
    <li className="card !rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="
          w-full text-left p-5 flex items-start gap-4
          hover:bg-bone-deep/40 transition-colors
        "
      >
        <span
          className="
            shrink-0 mt-1 inline-flex items-center justify-center
            h-7 w-7 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold
          "
          aria-hidden
        >
          {question.id}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="font-display text-base sm:text-lg font-medium leading-snug"
            style={{ fontVariationSettings: "'opsz' 32" }}
          >
            {question.text_fr}
          </p>
          {translation ? (
            <p
              className="mt-1 text-sm text-ink-mute italic font-display leading-relaxed"
              dir={rtl ? 'rtl' : undefined}
            >
              {translation.text}
            </p>
          ) : null}
          <p className="mt-2 text-[0.7rem] font-display italic text-ink-mute uppercase tracking-wider">
            — {categoryLabel}
          </p>
        </div>
        <svg
          className={`
            shrink-0 mt-1 h-5 w-5 text-aubergine/40 transition-transform
            ${isExpanded ? 'rotate-180' : ''}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded ? (
        <div className="border-t border-aubergine/10 bg-saffron/10 px-5 py-4">
          <p className="text-[0.7rem] font-display italic text-aubergine uppercase tracking-wider mb-2">
            — Conseil de réponse
          </p>
          <p className="text-sm text-ink leading-relaxed">{question.answer_hint}</p>
          {translation ? (
            <p
              className="mt-3 pt-3 border-t border-aubergine/10 text-sm text-ink-mute italic font-display leading-relaxed"
              dir={rtl ? 'rtl' : undefined}
            >
              {translation.answer_hint}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
