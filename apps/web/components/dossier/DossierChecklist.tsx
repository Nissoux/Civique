'use client';

import { useMemo, useState } from 'react';
import {
  EXAM_TYPE_LABELS,
  SITUATIONS_BY_EXAM_TYPE,
  buildChecklist,
  type ExamTypeCode,
} from '@/lib/data/dossier';

interface Props {
  /** Pre-selected exam type from the user's profile, if any. */
  initialExamType?: ExamTypeCode | null;
}

const LS_KEY = 'civique_dossier_checks_v1';

/**
 * DossierChecklist
 *
 * Interactive client component to walk the candidate through the
 * supporting documents required for their CSP / CR / NAT application,
 * tailored by situation (student / employee / family / etc.).
 *
 * Why client-side
 * ---------------
 * The user wants to tick items off as they collect them. We persist
 * the checked state in localStorage so the dossier doesn't reset if
 * they reload the page mid-collection. No need for a DB round-trip
 * — the checklist itself is read-only, and the per-document tick is
 * deeply personal and useless to anyone else.
 *
 * Why no print stylesheet (yet)
 * -----------------------------
 * Most candidates print today only as a fallback. We'll add a clean
 * print CSS once we see real usage. For now the page renders cleanly
 * with the browser's default print → PDF.
 */
export function DossierChecklist({ initialExamType }: Props) {
  const [examType, setExamType] = useState<ExamTypeCode>(initialExamType ?? 'nat');
  const [situationId, setSituationId] = useState<string>(
    SITUATIONS_BY_EXAM_TYPE[examType][0].id,
  );
  const [checked, setChecked] = useState<Set<string>>(() => loadChecks());

  const situations = SITUATIONS_BY_EXAM_TYPE[examType];
  const checklist = useMemo(
    () => buildChecklist(examType, situationId),
    [examType, situationId],
  );

  // Flat list of all document labels currently visible — used to compute
  // progress and the print-friendly title.
  const visibleDocs = useMemo(() => {
    return checklist.sections.flatMap((s) =>
      s.documents.map((d) => `${examType}:${situationId}:${d.label}`),
    );
  }, [checklist, examType, situationId]);

  const progress = useMemo(() => {
    if (visibleDocs.length === 0) return { done: 0, total: 0, pct: 0 };
    const done = visibleDocs.filter((k) => checked.has(k)).length;
    return {
      done,
      total: visibleDocs.length,
      pct: Math.round((done / visibleDocs.length) * 100),
    };
  }, [visibleDocs, checked]);

  function toggle(docKey: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(docKey)) next.delete(docKey);
      else next.add(docKey);
      // Persist immediately — the user could close the tab any moment.
      saveChecks(next);
      return next;
    });
  }

  function changeExamType(t: ExamTypeCode) {
    setExamType(t);
    // Reset to the first situation in the new exam type — the previous
    // situationId may be undefined for the new exam.
    setSituationId(SITUATIONS_BY_EXAM_TYPE[t][0].id);
  }

  return (
    <div className="min-h-screen bg-bone">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 sm:py-14">
        <header className="mb-8">
          <p className="eyebrow mb-3">— Mon dossier</p>
          <h1
            className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-tight mb-3"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            Vérifier mon <span className="display-italic text-terracotta">dossier</span>.
          </h1>
          <p className="text-ink-mute text-[1rem] leading-relaxed">
            Une checklist personnalisée des justificatifs à préparer pour votre
            demande. Cochez les pièces au fur et à mesure — votre progression
            est sauvegardée sur cet appareil. Ce n'est pas une liste
            officielle : confirmez toujours auprès de votre préfecture ou de{' '}
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/N111"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-wavy text-terracotta hover:text-aubergine"
            >
              service-public.fr
            </a>
            .
          </p>
        </header>

        {/* Exam type selector */}
        <fieldset className="mb-5">
          <legend className="font-display italic text-terracotta text-xs mb-2">
            — Type de titre
          </legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EXAM_TYPE_LABELS) as ExamTypeCode[]).map((t) => (
              <SelectorPill
                key={t}
                label={EXAM_TYPE_LABELS[t]}
                active={examType === t}
                onClick={() => changeExamType(t)}
              />
            ))}
          </div>
        </fieldset>

        {/* Situation selector */}
        <fieldset className="mb-7">
          <legend className="font-display italic text-terracotta text-xs mb-2">
            — Votre situation
          </legend>
          <div className="flex flex-wrap gap-2">
            {situations.map((s) => (
              <SelectorPill
                key={s.id}
                label={s.label}
                active={situationId === s.id}
                onClick={() => setSituationId(s.id)}
                title={s.blurb}
              />
            ))}
          </div>
        </fieldset>

        {/* Progress */}
        <div className="mb-7 rounded-2xl border-[1.5px] border-aubergine/15 bg-bone-deep p-4">
          <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
            <p className="font-display italic text-terracotta text-xs">
              — Progression
            </p>
            <p className="font-display font-medium text-lg" style={{ fontVariationSettings: "'opsz' 32" }}>
              {progress.done} / {progress.total}{' '}
              <span className="text-ink-mute text-sm">documents</span>
            </p>
          </div>
          <div className="relative h-2 rounded-full bg-aubergine/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-terracotta transition-all"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>

        {/* Sections */}
        {checklist.sections.map((section) => (
          <section key={section.title} className="mb-8">
            <h2
              className="font-display text-xl font-medium mb-3"
              style={{ fontVariationSettings: "'opsz' 32" }}
            >
              {section.title}
            </h2>
            <ul className="space-y-2.5">
              {section.documents.map((doc) => {
                const key = `${examType}:${situationId}:${doc.label}`;
                const isChecked = checked.has(key);
                return (
                  <li
                    key={doc.label}
                    className={`
                      rounded-2xl border-[1.5px] p-3.5 transition-colors
                      ${
                        isChecked
                          ? 'bg-success-bg/40 border-success/30'
                          : 'bg-bone-deep border-aubergine/15'
                      }
                    `}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(key)}
                        className="
                          mt-1 h-5 w-5 rounded border-[1.5px] border-aubergine/30
                          text-terracotta focus:ring-terracotta cursor-pointer
                          shrink-0
                        "
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span
                            className={`font-medium leading-snug ${
                              isChecked ? 'text-ink-mute line-through' : 'text-ink'
                            }`}
                          >
                            {doc.label}
                          </span>
                          {doc.pitfall ? (
                            <span className="text-[0.65rem] font-semibold text-fr-red bg-error-bg px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              Vigilance
                            </span>
                          ) : null}
                        </div>
                        {doc.hint ? (
                          <p className="text-[0.85rem] text-ink-mute italic mt-1 leading-relaxed">
                            {doc.hint}
                          </p>
                        ) : null}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        {/* Notes */}
        {checklist.notes && checklist.notes.length > 0 ? (
          <aside className="rounded-2xl border-[1.5px] border-saffron/40 bg-saffron/10 p-5">
            <p className="font-display italic text-aubergine text-xs mb-2">
              — À retenir
            </p>
            <ul className="space-y-2 text-sm text-ink leading-relaxed">
              {checklist.notes.map((note, i) => (
                <li key={i}>• {note}</li>
              ))}
            </ul>
          </aside>
        ) : null}

        {/* Disclaimer */}
        <footer className="mt-10 text-xs text-ink-mute italic leading-relaxed">
          — Liste non exhaustive. Civique est indépendant et n'a aucune
          affiliation officielle avec l'État français ou les préfectures.
          Pour la liste réglementaire à jour, consultez le portail{' '}
          <a
            href="https://administration-etrangers-en-france.interieur.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-wavy text-terracotta hover:text-aubergine not-italic"
          >
            ANEF
          </a>{' '}
          ou le site officiel{' '}
          <a
            href="https://www.service-public.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-wavy text-terracotta hover:text-aubergine not-italic"
          >
            service-public.fr
          </a>
          .
        </footer>
      </div>
    </div>
  );
}

function SelectorPill({
  label,
  active,
  onClick,
  title,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        px-3.5 py-1.5 rounded-full text-[0.82rem] font-medium border-[1.5px]
        transition-all
        ${
          active
            ? 'bg-terracotta text-bone border-terracotta shadow-[0_2px_0_rgb(45_27_46)]'
            : 'bg-bone-deep text-aubergine border-aubergine/20 hover:border-terracotta/40'
        }
      `}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function loadChecks(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return new Set(parsed.filter((x) => typeof x === 'string'));
    return new Set();
  } catch {
    return new Set();
  }
}

function saveChecks(s: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...s]));
  } catch {
    // Quota or disabled — silently degrade. The in-memory state still
    // works for the rest of the session.
  }
}
