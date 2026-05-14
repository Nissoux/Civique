/**
 * SM-2 spaced repetition algorithm — pure functions, no DB.
 *
 * Reference: Piotr Wozniak's SuperMemo SM-2 algorithm (1990), the basis
 * of Anki, Mochi, RemNote, etc. Implementation tracks four pieces of
 * state per (user, item) pair:
 *
 *   easeFactor          how forgiving the spacing is for this card.
 *                       2.5 at start; +0.1 on a perfect recall, slight
 *                       penalties on lower qualities, never below 1.3.
 *   intervalDays        how long until the next review (in days).
 *   consecutiveCorrect  current streak of recalls with quality ≥ 3.
 *   nextReviewAt        timestamp the API uses to fetch the "due now"
 *                       list.
 *
 * Quality scale (we accept 0–5 to stay compatible with the original
 * paper, but the UI only ever produces 0, 2, 4 or 5 — see review() in
 * the API):
 *   5 — perfect
 *   4 — correct, easy
 *   3 — correct, hard
 *   2 — wrong, but felt familiar
 *   0–1 — wrong, no idea
 *
 * Anything below 3 means the card "lapsed" and re-enters learning:
 * interval resets to 1 day, the ease factor takes the same hit, and
 * the streak counter is zeroed.
 */

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  consecutiveCorrect: number;
  totalReviews: number;
  lastReviewedAt: Date | null;
  nextReviewAt: Date | null;
}

export interface SrsReviewInput {
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  now?: Date;
}

export const SRS_INITIAL: SrsState = {
  easeFactor: 2.5,
  intervalDays: 0,
  consecutiveCorrect: 0,
  totalReviews: 0,
  lastReviewedAt: null,
  nextReviewAt: null,
};

const EASE_FLOOR = 1.3;
const EASE_CEILING = 3.0;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Compute the next SRS state from the previous state + a quality grade.
 *
 * Pure. Doesn't touch the DB; the caller is responsible for persisting
 * the returned state.
 */
export function reviewSrs(prev: SrsState, input: SrsReviewInput): SrsState {
  const { quality } = input;
  const now = input.now ?? new Date();

  let ef = prev.easeFactor;
  let interval = prev.intervalDays;
  let streak = prev.consecutiveCorrect;

  if (quality < 3) {
    // Lapse — reset the streak, schedule for tomorrow, ease takes a hit.
    streak = 0;
    interval = 1;
  } else {
    // Recall — bump streak, expand the interval per SM-2's schedule.
    streak += 1;
    if (streak === 1) interval = 1;
    else if (streak === 2) interval = 6;
    else interval = Math.max(1, Math.round(interval * ef));
  }

  // Ease factor update — Wozniak's formula. Quality 5 gives +0.10,
  // quality 3 keeps it flat-ish, lower qualities push down hard.
  const delta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  ef = clamp(ef + delta, EASE_FLOOR, EASE_CEILING);

  return {
    easeFactor: round(ef, 3),
    intervalDays: interval,
    consecutiveCorrect: streak,
    totalReviews: prev.totalReviews + 1,
    lastReviewedAt: now,
    nextReviewAt: new Date(now.getTime() + interval * DAY_MS),
  };
}

/**
 * Convert the UI's three-button feedback ("À revoir / J'ai du mal /
 * Je sais") into an SM-2 quality grade. Keeps the algorithm details
 * out of the client and the routes.
 */
export function feedbackToQuality(
  feedback: 'lapse' | 'hard' | 'good' | 'easy',
): SrsReviewInput['quality'] {
  switch (feedback) {
    case 'lapse':
      return 1;
    case 'hard':
      return 3;
    case 'good':
      return 4;
    case 'easy':
      return 5;
  }
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
