import type { Choice } from '@civique/shared';

const LABELS: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];

export interface ShuffledResult {
  choices: Choice[];
  originalToNew: Record<string, string>;
}

/**
 * Hash function that produces well-distributed values for sequential inputs.
 * Based on MurmurHash3 finalizer.
 */
function hashSeed(n: number): number {
  let h = n | 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0); // Ensure positive
}

/**
 * Seeded random number generator with good distribution.
 */
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
 * Shuffle choices and relabel them A, B, C, D in the new order.
 * Deterministic: same questionId always produces the same shuffle.
 * Uses MurmurHash3 finalizer for proper distribution across sequential IDs.
 */
export function shuffleChoices(choices: Choice[], questionId: number): ShuffledResult {
  const shuffled = [...choices];
  const random = createRng(questionId + 7919); // Add prime offset for extra mixing

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Build mapping from original ID to new label
  const originalToNew: Record<string, string> = {};

  const relabeled = shuffled.map((choice, index) => {
    const newLabel = LABELS[index];
    originalToNew[choice.id] = newLabel;
    return { id: newLabel, text: choice.text };
  });

  return { choices: relabeled, originalToNew };
}

/**
 * Get the new label for the correct choice after shuffle.
 */
export function getShuffledCorrectChoice(
  originalCorrect: string,
  originalToNew: Record<string, string>,
): string {
  return originalToNew[originalCorrect] || originalCorrect;
}
