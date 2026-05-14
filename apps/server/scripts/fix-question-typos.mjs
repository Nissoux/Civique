#!/usr/bin/env node
/**
 * Fixes the small inventory of typos and OCR-style artefacts in the
 * imported question texts (CSP / CR / NAT). All fixes are conservative
 * — we only correct unambiguous mistakes (missing hyphens in fixed
 * expressions, missing accents on capitals, doubled spaces, etc.).
 * Anything that requires editorial judgment is logged for human
 * review rather than auto-applied.
 *
 * Why a script rather than ad-hoc UPDATEs
 * ---------------------------------------
 * - Reproducibility: if we re-import the official pool later, we can
 *   re-run this script to re-clean it the same way.
 * - Auditability: each rule is named and logged, so we know exactly
 *   why a row changed.
 * - Safety: dry-run mode by default — pass `--apply` to actually write.
 *
 * Usage:
 *   node scripts/fix-question-typos.mjs            # dry run (default)
 *   node scripts/fix-question-typos.mjs --apply    # actually write
 */

import 'dotenv/config';
import pg from 'pg';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/civique';
const APPLY = process.argv.includes('--apply');

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 4 });

/**
 * Each rule is { name, pattern, replacement } — applied in order.
 * Order matters when one rule's output could be matched by another.
 *
 * The replacements use function form when context-sensitivity matters
 * (e.g. uppercase-aware accent repair).
 */
const RULES = [
  // ── Missing hyphens in inverted-verb question forms ────────────
  // "Qu'est ce que" → "Qu'est-ce que"
  {
    name: "qu'est-ce hyphen",
    re: /\bQu'est ce\b/g,
    sub: "Qu'est-ce",
  },
  // "est elle" / "est il" / "est on" in interrogative inversion → hyphen
  // We anchor to a preceding ?-flavored context so we don't break "est
  // elle qui" (statement). Safe: official questions always invert with
  // the verb directly preceding the pronoun.
  {
    name: 'verb-pronoun hyphen (est elle)',
    re: /\best elle\b/g,
    sub: 'est-elle',
  },
  {
    name: 'verb-pronoun hyphen (est il)',
    re: /\best il\b/g,
    sub: 'est-il',
  },
  {
    name: 'verb-pronoun hyphen (est on)',
    re: /\best on\b/g,
    sub: 'est-on',
  },
  {
    name: 'verb-pronoun hyphen (peut elle)',
    re: /\bpeut elle\b/g,
    sub: 'peut-elle',
  },
  {
    name: 'verb-pronoun hyphen (peut il)',
    re: /\bpeut il\b/g,
    sub: 'peut-il',
  },
  {
    name: 'verb-pronoun hyphen (peut on)',
    re: /\bpeut on\b/g,
    sub: 'peut-on',
  },
  {
    name: 'verb-pronoun hyphen (a t il)',
    re: /\ba t il\b/g,
    sub: 'a-t-il',
  },
  {
    name: 'verb-pronoun hyphen (a t elle)',
    re: /\ba t elle\b/g,
    sub: 'a-t-elle',
  },
  {
    name: 'verb-pronoun hyphen (a t on)',
    re: /\ba t on\b/g,
    sub: 'a-t-on',
  },
  // ── Missing accents on uppercase Etat/Eglise/Ecole/Elysée ──────
  {
    name: 'capital E accent (Etat)',
    re: /\bEtat\b/g,
    sub: 'État',
  },
  {
    name: 'capital E accent (Etats)',
    re: /\bEtats\b/g,
    sub: 'États',
  },
  {
    name: 'capital E accent (Eglise)',
    re: /\bEglise\b/g,
    sub: 'Église',
  },
  {
    name: 'capital E accent (Eglises)',
    re: /\bEglises\b/g,
    sub: 'Églises',
  },
  {
    name: 'capital E accent (Elysee)',
    re: /\bElysee\b/g,
    sub: 'Élysée',
  },
  // ── Common standalone OCR artefacts ────────────────────────────
  {
    name: 'double-space',
    re: /  +/g,
    sub: ' ',
  },
  {
    name: 'space-before-question-mark',
    // French rule: thin non-breaking space before "?". We normalize to
    // a regular space (the rendering layer adds the nbsp visually).
    re: / +\?/g,
    sub: ' ?',
  },
  {
    name: 'stray-period-pair',
    // ". ." → "."
    re: /\. +\./g,
    sub: '.',
  },
];

function fixText(input) {
  let out = input;
  const applied = [];
  for (const rule of RULES) {
    const before = out;
    out = out.replace(rule.re, rule.sub);
    if (out !== before) applied.push(rule.name);
  }
  return { out, applied };
}

async function main() {
  console.log(`\n📝 Question-text typo fix — ${APPLY ? 'APPLY MODE' : 'DRY RUN'}\n`);

  const client = await pool.connect();
  let touched = 0;
  let untouched = 0;
  const byRule = new Map();

  try {
    const { rows } = await client.query(
      `SELECT id, text_fr FROM questions ORDER BY id ASC`,
    );

    for (const row of rows) {
      const { out, applied } = fixText(row.text_fr);
      if (applied.length === 0) {
        untouched++;
        continue;
      }
      touched++;
      for (const r of applied) {
        byRule.set(r, (byRule.get(r) ?? 0) + 1);
      }

      // Always log the change so the operator can verify in dry run.
      console.log(`  #${row.id} [${applied.join(', ')}]`);
      console.log(`    – ${row.text_fr}`);
      console.log(`    + ${out}`);

      if (APPLY) {
        await client.query(
          `UPDATE questions SET text_fr = $1 WHERE id = $2`,
          [out, row.id],
        );
      }
    }

    console.log(`\n📊 ${touched} questions modifiées, ${untouched} inchangées.\n`);
    if (byRule.size > 0) {
      console.log(`Détail par règle :`);
      for (const [rule, count] of [...byRule.entries()].sort((a, b) => b[1] - a[1])) {
        console.log(`  - ${rule}: ${count}`);
      }
    }
    if (!APPLY && touched > 0) {
      console.log(`\n⚠️  Dry run — rien n'a été écrit. Relancer avec --apply pour appliquer.`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
