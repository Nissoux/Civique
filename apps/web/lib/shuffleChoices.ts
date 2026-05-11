// Ported verbatim from apps/mobile/utils/shuffleChoices.ts.
// CRITICAL: must produce IDENTICAL shuffles to mobile so progression / answer
// records remain consistent across platforms (same questionId → same A/B/C/D).
import type { Choice } from '@civique/shared';

const LABELS: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];

export interface ShuffledResult {
  choices: Choice[];
  originalToNew: Record<string, string>;
}

/** MurmurHash3 finalizer — well-distributed for sequential inputs. */
function hashSeed(n: number): number {
  let h = n | 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** xorshift32 seeded RNG. */
function createRng(seed: number) {
  let s = hashSeed(seed);
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

/**
 * Shuffle choices and relabel A/B/C/D in the new order.
 * Deterministic per `questionId` — same id → same shuffle.
 */
export function shuffleChoices(
  choices: Choice[],
  questionId: number,
): ShuffledResult {
  const shuffled = [...choices];
  const random = createRng(questionId + 7919); // prime offset for extra mixing

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const originalToNew: Record<string, string> = {};
  const relabeled = shuffled.map((choice, index) => {
    const newLabel = LABELS[index];
    originalToNew[choice.id] = newLabel;
    return { id: newLabel, text: choice.text };
  });

  return { choices: relabeled, originalToNew };
}

/** Map the originally-correct choice id to its new shuffled label. */
export function getShuffledCorrectChoice(
  originalCorrect: string,
  originalToNew: Record<string, string>,
): string {
  return originalToNew[originalCorrect] ?? originalCorrect;
}

/** Number of levels for a theme given its question count (10 questions/level). */
export function computeLevelsForTheme(
  totalQuestions: number,
  questionsPerLevel = 10,
): number {
  return Math.ceil(totalQuestions / questionsPerLevel);
}
