/**
 * Self-evaluation scoring for the entretien d'assimilation simulation.
 *
 * Why a heuristic, not an LLM
 * ---------------------------
 * The entretien is fundamentally subjective — the agent at the préfecture
 * judges sincerity, fluency, and command of the values, not a checklist.
 * A black-box LLM grade would feel arbitrary ("75/100 — why?"). A
 * deterministic keyword-overlap score, combined with the hint shown
 * after submission, gives the candidate something they can act on:
 * "you didn't mention laïcité in your answer about République values".
 *
 * The score is intentionally not a percentage you "pass" — it's a
 * coverage signal. The UI presents it as "X of Y key ideas mentioned"
 * rather than a grade.
 *
 * Algorithm
 * ---------
 * 1. Tokenize both the user's answer and the answer hint with the same
 *    pipeline: NFD-normalize (strip accents), lowercase, strip punctuation,
 *    split on whitespace, filter stopwords.
 * 2. Extract keywords from the hint by frequency-ranking (already terse
 *    — the hint is itself a coverage outline written by a domain SME).
 *    We use unique content words after stopword removal.
 * 3. Compute overlap = | userTokens ∩ hintTokens | / |hintTokens|.
 * 4. Return the count of matched keywords, the list of missed keywords,
 *    and a qualitative bucket (faible / partielle / solide).
 *
 * This is fast (synchronous, ~ms), private (runs entirely client-side
 * in the simulation page), and explainable.
 */

// Stopwords list — kept short on purpose; we want pedagogically-loaded
// words like "valeurs" or "république" to count as keywords. The list
// is biased toward what the hint paragraphs use as filler.
const STOPWORDS = new Set<string>([
  // articles + prepositions
  'le', 'la', 'les', 'l', 'un', 'une', 'des', 'de', 'du', 'd', 'au', 'aux',
  'a', 'à', 'en', 'dans', 'sur', 'sous', 'par', 'pour', 'avec', 'sans',
  'vers', 'chez', 'entre', 'depuis', 'pendant', 'avant', 'après',
  // pronouns
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles',
  'me', 'te', 'se', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa',
  'ses', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'ce', 'cet',
  'cette', 'ces', 'qui', 'que', 'quoi', 'dont', 'où',
  // conjunctions + common verbs
  'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'si', 'quand', 'parce',
  'est', 'sont', 'était', 'sera', 'soit', 'être', 'avoir', 'a', 'ai',
  'as', 'ont', 'avez', 'avons', 'fait', 'faire', 'peut', 'peuvent',
  'doit', 'doivent', 'va', 'vont', 'aller',
  // qualifiers
  'plus', 'moins', 'très', 'trop', 'beaucoup', 'peu', 'aussi', 'encore',
  'déjà', 'toujours', 'jamais', 'oui', 'non', 'pas', 'ne', 'rien', 'tout',
  'tous', 'toutes', 'autre', 'autres', 'même', 'mêmes', 'bien', 'mal',
  // hint-specific filler we want to ignore
  'evoquez', 'évoquez', 'mentionner', 'parler', 'expliquer', 'donner',
  'preciser', 'préciser', 'rappel', 'attention', 'evitez', 'évitez',
  'montrez', 'soyez', 'restez', 'reponse', 'réponse', 'phrase',
  'exemple', 'reste', 'votre', 'votre',
]);

/**
 * Strip diacritics & punctuation, lowercase. Same pipeline applied to
 * hint and to the user answer so the comparison is fair.
 */
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // accents
    .toLowerCase()
    .replace(/['']/g, ' ')           // typographic apostrophes
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ') // punctuation → space
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(' ')
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

export interface ScoreResult {
  /** Count of unique hint keywords found in the user's answer. */
  matched: number;
  /** Total unique hint keywords we tried to match against. */
  total: number;
  /** Hint keywords missing from the user's answer — what to highlight. */
  missed: string[];
  /** Hint keywords matched. */
  hit: string[];
  /** Bucket for fast UI render — keep stable for translation. */
  bucket: 'weak' | 'partial' | 'solid';
  /** 0–1 score (matched/total), clamped, NaN-safe. */
  ratio: number;
}

/**
 * Score the user's free-form answer against the hint paragraph.
 * Both strings are tokenized through the same pipeline.
 */
export function scoreAnswer(userAnswer: string, hint: string): ScoreResult {
  // Trivial input → trivial result. Avoid division by zero downstream.
  if (!hint?.trim()) {
    return {
      matched: 0,
      total: 0,
      missed: [],
      hit: [],
      bucket: 'weak',
      ratio: 0,
    };
  }

  const userTokens = new Set(tokenize(userAnswer));
  // Dedupe hint tokens: if a hint says "valeurs valeurs valeurs", count it
  // once. Keep insertion order so the missed list reads in hint order.
  const hintTokens: string[] = [];
  const hintSeen = new Set<string>();
  for (const t of tokenize(hint)) {
    if (!hintSeen.has(t)) {
      hintSeen.add(t);
      hintTokens.push(t);
    }
  }

  const hit: string[] = [];
  const missed: string[] = [];
  for (const t of hintTokens) {
    if (userTokens.has(t)) hit.push(t);
    else missed.push(t);
  }

  const total = hintTokens.length;
  const matched = hit.length;
  const ratio = total > 0 ? matched / total : 0;

  // Buckets are deliberately permissive — the goal is encouragement, not
  // gatekeeping. A 30%+ overlap is genuinely solid for free-form text.
  const bucket: ScoreResult['bucket'] =
    ratio >= 0.35 ? 'solid' : ratio >= 0.15 ? 'partial' : 'weak';

  return { matched, total, missed, hit, bucket, ratio };
}

/**
 * French-language UI label for a score bucket. Kept in this file so
 * the component layer stays purely presentational.
 */
export function bucketLabel(b: ScoreResult['bucket']): string {
  switch (b) {
    case 'solid':
      return 'Réponse solide';
    case 'partial':
      return 'Réponse partielle';
    case 'weak':
      return 'Réponse à enrichir';
  }
}
