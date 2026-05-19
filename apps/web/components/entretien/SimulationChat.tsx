'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { scoreAnswer, bucketLabel, type ScoreResult } from '@/lib/entretien-scoring';

interface Question {
  id: number;
  category: string;
  text_fr: string;
  answer_hint: string;
}

interface Props {
  questions: Question[];
  /** Categories the user wants to be drilled on. Empty = all. */
  categories: Record<string, string>;
}

interface Turn {
  /** Chronological id within this session — not the question id. */
  turnId: number;
  question: Question;
  userAnswer: string;
  score: ScoreResult;
}

/**
 * SimulationChat — chat-like dry-run of the assimilation interview.
 *
 * Why a free-form text input rather than multiple-choice
 * ------------------------------------------------------
 * The real entretien is open-ended. Multiple-choice would feed candidates
 * a false sense of preparedness — they'd memorize the option labels
 * instead of building the ability to articulate the answer in their
 * own words. Free-form is harder to grade, but it's the only format
 * that simulates the real conversation.
 *
 * Why client-side scoring
 * -----------------------
 * Privacy — the user's answer never leaves their device. The corpus
 * (240 questions + hints) is already bundled with the page. Scoring
 * is keyword-overlap, deterministic, explainable. See
 * lib/entretien-scoring.ts for the algorithm.
 *
 * Why we surface the hint AFTER submission, never before
 * ------------------------------------------------------
 * Reading the hint upfront defeats the simulation — the candidate would
 * just paraphrase it. Showing it after gives a structured way to
 * compare what they said to what a complete answer covers.
 */
export function SimulationChat({ questions, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Filtered question pool. Memoized because category changes but the
  // base questions array is stable.
  const pool = useMemo(() => {
    if (activeCategory === 'all') return questions;
    return questions.filter((q) => q.category === activeCategory);
  }, [questions, activeCategory]);

  // Pick the first question on mount, and re-roll when the category
  // changes (the previous question may belong to a different category).
  useEffect(() => {
    if (pool.length === 0) {
      setCurrentQuestion(null);
      return;
    }
    setCurrentQuestion(pickRandom(pool, currentQuestion?.id));
    setDraft('');
    setShowHint(false);
    // pool depends on activeCategory; ignoring currentQuestion avoids
    // resetting the screen every time we ask a follow-up.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  // Auto-scroll to the latest exchange. We attach the ref to a sentinel
  // div at the bottom of the transcript.
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns.length, showHint]);

  function handleSubmit() {
    if (!currentQuestion) return;
    const answer = draft.trim();
    if (answer.length < 5) {
      // Empty / one-word answers aren't useful to score. Don't even try.
      return;
    }
    const score = scoreAnswer(answer, currentQuestion.answer_hint);
    setTurns((prev) => [
      ...prev,
      {
        turnId: prev.length + 1,
        question: currentQuestion,
        userAnswer: answer,
        score,
      },
    ]);
    setShowHint(true);
  }

  function nextQuestion() {
    if (pool.length === 0) return;
    setCurrentQuestion(pickRandom(pool, currentQuestion?.id));
    setDraft('');
    setShowHint(false);
    // Re-focus the textarea so the candidate can keep typing without
    // moving the mouse. Slight delay to allow render.
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function resetSession() {
    // Two-step "press again to confirm" pattern instead of the native
    // confirm() dialog: respects the design system (vs a Chrome chrome
    // dialog), doesn't block the event loop, works with screen readers
    // via aria-live, and is trivially internationalisable later.
    if (turns.length === 0) {
      setConfirmReset(false);
      return;
    }
    if (!confirmReset) {
      setConfirmReset(true);
      // Auto-cancel the confirm state after 4 s so it doesn't linger.
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    setConfirmReset(false);
    setTurns([]);
    setShowHint(false);
    setDraft('');
    if (pool.length > 0) {
      setCurrentQuestion(pickRandom(pool));
    }
  }

  // Aggregate stats for the session footer — gentle reinforcement.
  const stats = useMemo(() => {
    if (turns.length === 0) return null;
    const totalRatio = turns.reduce((acc, t) => acc + t.score.ratio, 0) / turns.length;
    const solid = turns.filter((t) => t.score.bucket === 'solid').length;
    return { count: turns.length, avgRatio: totalRatio, solid };
  }, [turns]);

  return (
    <div className="min-h-screen bg-bone">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 sm:py-14">
        <header className="mb-8">
          <p className="eyebrow mb-3">— Simulation d'entretien</p>
          <h1
            className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-tight mb-3"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            Comme à la <span className="display-italic text-terracotta">préfecture</span>.
          </h1>
          <p className="text-ink-mute text-[1rem] leading-relaxed">
            Répondez à voix haute si vous le pouvez, puis recopiez votre
            réponse en texte. Votre réponse est <strong>analysée localement</strong>{' '}
            sur votre appareil — elle ne quitte jamais votre navigateur.
          </p>
        </header>

        {/* Category filter */}
        <nav
          aria-label="Filtrer par thème"
          className="mb-7 flex flex-wrap gap-2"
        >
          <CategoryPill
            label="Toutes les questions"
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {Object.entries(categories).map(([key, label]) => (
            <CategoryPill
              key={key}
              label={label}
              active={activeCategory === key}
              onClick={() => setActiveCategory(key)}
            />
          ))}
        </nav>

        {/* Transcript */}
        <section
          aria-label="Échanges précédents"
          className="mb-6 space-y-5"
        >
          {turns.map((turn) => (
            <TurnView key={turn.turnId} turn={turn} />
          ))}
          <div ref={transcriptEndRef} />
        </section>

        {/* Current question + input */}
        {currentQuestion ? (
          <section
            aria-label="Question en cours"
            className="rounded-3xl border-[1.5px] border-aubergine/15 bg-bone-deep p-6 sm:p-7"
          >
            <p className="font-display italic text-terracotta text-sm mb-2">— Question</p>
            <p className="font-display text-xl sm:text-2xl leading-snug font-medium mb-5">
              {currentQuestion.text_fr}
            </p>

            {!showHint ? (
              <>
                <label htmlFor="answer-input" className="sr-only">
                  Votre réponse
                </label>
                <textarea
                  id="answer-input"
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    // Cmd/Ctrl+Enter submits — matches GitHub / Slack
                    // muscle memory for "send".
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Répondez avec vos propres mots…"
                  rows={5}
                  className="
                    w-full rounded-2xl border-[1.5px] border-aubergine/20
                    bg-bone px-4 py-3 text-[1rem] leading-relaxed
                    focus:outline-none focus:border-terracotta
                    placeholder:text-ink-mute/60
                    resize-y min-h-[120px]
                  "
                  autoFocus
                />
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-xs text-ink-mute italic">
                    Astuce : <kbd className="px-1.5 py-0.5 rounded bg-aubergine/10 text-aubergine font-mono text-[0.7rem]">⌘/Ctrl + Entrée</kbd> pour valider.
                  </p>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={draft.trim().length < 5}
                    className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Valider ma réponse
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="btn-primary text-sm"
                >
                  Question suivante
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={resetSession}
                  aria-live="polite"
                  className={`btn-secondary text-sm ${confirmReset ? '!border-fr-red !text-fr-red' : ''}`}
                >
                  {confirmReset ? 'Confirmer la remise à zéro' : 'Recommencer'}
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-3xl border-[1.5px] border-aubergine/15 bg-bone-deep p-6 text-center text-ink-mute text-sm italic">
            Aucune question dans cette catégorie. Choisissez « Toutes les questions ».
          </section>
        )}

        {/* Session stats */}
        {stats ? (
          <aside
            aria-label="Statistiques de la session"
            className="mt-8 rounded-2xl border-[1.5px] border-aubergine/15 bg-bone p-5"
          >
            <p className="font-display italic text-terracotta text-xs mb-2">— Session en cours</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <Stat label="Questions" value={String(stats.count)} />
              <Stat label="Réponses solides" value={`${stats.solid}/${stats.count}`} />
              <Stat
                label="Couverture moyenne"
                value={`${Math.round(stats.avgRatio * 100)}%`}
              />
            </div>
            <p className="mt-3 text-xs text-ink-mute italic leading-relaxed">
              La couverture mesure combien de mots-clés du modèle de réponse
              apparaissent dans vos réponses. Ce n'est pas une note d'examen :
              c'est un repère pour identifier vos angles morts.
            </p>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function TurnView({ turn }: { turn: Turn }) {
  const { question, userAnswer, score } = turn;
  return (
    <div className="space-y-3">
      {/* Question (interviewer) */}
      <div className="flex items-start gap-3">
        <Avatar role="interviewer" />
        <div className="flex-1 rounded-2xl rounded-tl-md bg-aubergine text-bone px-4 py-3 max-w-[88%]">
          <p className="font-display italic text-saffron text-xs mb-1">— Question</p>
          <p className="leading-snug text-[0.98rem]">{question.text_fr}</p>
        </div>
      </div>
      {/* User answer */}
      <div className="flex items-start gap-3 justify-end">
        <div className="flex-1 rounded-2xl rounded-tr-md bg-bone border-[1.5px] border-aubergine/20 px-4 py-3 max-w-[88%]">
          <p className="font-display italic text-terracotta text-xs mb-1">— Votre réponse</p>
          <p className="leading-snug text-[0.98rem] whitespace-pre-wrap">{userAnswer}</p>
        </div>
        <Avatar role="user" />
      </div>
      {/* Feedback */}
      <div className="ml-12 sm:ml-14">
        <div
          className={`
            rounded-2xl px-4 py-3 border-[1.5px]
            ${
              score.bucket === 'solid'
                ? 'bg-success-bg/40 border-success/30'
                : score.bucket === 'partial'
                  ? 'bg-saffron/10 border-saffron/40'
                  : 'bg-error-bg border-fr-red/30'
            }
          `}
        >
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <p className="font-display italic text-xs">
              — {bucketLabel(score.bucket)}
            </p>
            <p className="text-xs text-ink-mute">
              {score.matched} / {score.total} mots-clés mentionnés
            </p>
          </div>
          {score.missed.length > 0 ? (
            <p className="text-[0.88rem] leading-relaxed text-ink">
              <strong className="text-aubergine">À enrichir :</strong>{' '}
              <span className="italic">
                {score.missed.slice(0, 8).join(', ')}
                {score.missed.length > 8 ? '…' : ''}
              </span>
            </p>
          ) : (
            <p className="text-[0.88rem] leading-relaxed text-ink">
              Excellente couverture. Vous avez intégré l'essentiel des
              points-clés attendus.
            </p>
          )}
          <details className="mt-3 group">
            <summary className="cursor-pointer text-xs text-ink-mute font-medium hover:text-terracotta transition-colors select-none">
              Voir le modèle de réponse complet ▾
            </summary>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-mute italic border-l-2 border-aubergine/20 pl-3">
              {question.answer_hint}
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

function Avatar({ role }: { role: 'interviewer' | 'user' }) {
  if (role === 'interviewer') {
    return (
      <div
        className="
          shrink-0 h-9 w-9 rounded-full bg-aubergine text-saffron
          flex items-center justify-center font-display font-medium text-sm
          shadow-[0_2px_0_rgb(45_27_46)]
        "
        aria-hidden
      >
        Pr
      </div>
    );
  }
  return (
    <div
      className="
        shrink-0 h-9 w-9 rounded-full bg-terracotta text-bone
        flex items-center justify-center font-display font-medium text-sm
        shadow-[0_2px_0_rgb(45_27_46)]
      "
      aria-hidden
    >
      Vs
    </div>
  );
}

function CategoryPill({
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-mute font-display italic mb-0.5">— {label}</p>
      <p
        className="font-display text-xl font-medium"
        style={{ fontVariationSettings: "'opsz' 32" }}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * Pick a random question from a pool, avoiding the most recent question
 * if possible (so the user doesn't get the same question twice in a row
 * even on a short category).
 */
function pickRandom(pool: Question[], avoidId?: number): Question {
  if (pool.length === 1) return pool[0]!;
  let candidate: Question;
  do {
    candidate = pool[Math.floor(Math.random() * pool.length)]!;
  } while (candidate.id === avoidId);
  return candidate;
}
