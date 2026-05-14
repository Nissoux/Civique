#!/usr/bin/env node
/**
 * Maps the Ministry of the Interior's published official question pools
 * onto our `questions` table.
 *
 * Inputs
 * ------
 *   apps/server/data/official_questions_csp.json   (191 entries)
 *   apps/server/data/official_questions_cr.json    (TBD)
 *   apps/server/data/official_questions_nat.json   (TBD)
 *
 * Each JSON file is an array of `{ n, theme, text }` entries scraped from
 * the official source (formation-civique.interieur.gouv.fr or DGEF), with
 * `n` being the 1-based ordering inside the official list and `text` the
 * exact French wording.
 *
 * What it does
 * ------------
 * For every official entry, run:
 *   UPDATE questions
 *      SET is_official = true,
 *          official_<mention>_order = $n
 *    WHERE text_fr = $text;
 *
 * Match is **exact** on text_fr because our sample showed 8/8 textual
 * match on the first 8 official questions — our corpus is clearly sourced
 * from the same official lists. We don't need fuzzy matching today; if
 * we ever drift, we'll add normalized text comparison later.
 *
 * Reports
 * -------
 *   - How many official entries matched a row in our DB
 *   - How many didn't (potential gaps in our pool)
 *   - How many of our 610 rows are now flagged is_official
 *
 * Usage
 * -----
 *   node apps/server/scripts/flag-official-questions.mjs
 *
 * Connection: DATABASE_URL env var, or default localhost.
 * Idempotent: re-running it just rewrites the same flags.
 */

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../data');

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/civique';

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 4 });

const MENTIONS = [
  { mention: 'csp', file: 'official_questions_csp.json', column: 'official_csp_order' },
  { mention: 'cr', file: 'official_questions_cr.json', column: 'official_cr_order' },
  { mention: 'nat', file: 'official_questions_nat.json', column: 'official_nat_order' },
];

async function loadPool(file) {
  try {
    const raw = await readFile(resolve(DATA_DIR, file), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.questions;
  } catch (err) {
    if (err.code === 'ENOENT') return null; // file not provisioned yet
    throw err;
  }
}

/**
 * Normalize a French question text for comparison purposes.
 *
 * Why
 * ---
 * Min Intérieur publishes questions with typographic apostrophes (U+2019 `'`)
 * and sometimes drops accents on capital letters ("Etat" instead of "État").
 * Our DB rows have ASCII apostrophes and full accents. Strict equality misses
 * these pairs, but they're semantically the same question. We normalize both
 * sides before comparison so the matching catches them.
 *
 * Steps:
 *   1. NFD-decompose (separates base char from combining accents)
 *   2. Drop common combining diacritics — only for the *match key*, never
 *      for the stored text (we don't want to lose accents in the DB)
 *   3. Map all apostrophe variants → ASCII '
 *   4. Map em-dash, ellipsis variants → simple equivalents
 *   5. Collapse all whitespace runs to single spaces
 *   6. Lowercase + trim
 *
 * This is *only* used to find the matching row in the DB; the row's
 * text_fr is left untouched.
 */
function normalizeForMatch(s) {
  if (!s) return '';
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks
    .replace(/[‘’‚‛ʼ′]/g, "'") // typographic apostrophes → '
    .replace(/[“”]/g, '"') // smart quotes → "
    .replace(/[–—]/g, '-') // en/em dash → -
    .replace(/[…]/g, '...') // ellipsis → ...
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

async function flagMention(client, { mention, column, questions }) {
  // Load all DB rows once, index them by normalized text. O(n+m) instead of
  // O(n*m), and tolerant to typographic differences.
  const allRows = await client.query(`SELECT id, text_fr FROM questions`);
  const byNorm = new Map();
  for (const row of allRows.rows) {
    const key = normalizeForMatch(row.text_fr);
    if (!byNorm.has(key)) byNorm.set(key, []);
    byNorm.get(key).push(row.id);
  }

  let matched = 0;
  const unmatched = [];
  for (const q of questions) {
    const key = normalizeForMatch(q.text);
    const ids = byNorm.get(key);
    if (!ids || ids.length === 0) {
      unmatched.push({ n: q.n, theme: q.theme, text: q.text.slice(0, 80) });
      continue;
    }
    // Multiple DB rows can share the same normalized key (e.g. two slight
    // variants of the same question). We flag all of them — same official
    // index, same provenance. Cheaper to be inclusive than to ship two
    // "identical-looking" questions where only one counts as official.
    const idList = ids.map((id) => Number(id));
    await client.query(
      `UPDATE questions
          SET is_official = true,
              ${column} = $1
        WHERE id = ANY($2::int[])`,
      [q.n, idList],
    );
    matched++;
  }
  return { matched, unmatched };
}

async function main() {
  const client = await pool.connect();
  try {
    console.log('━━━ Official-pool flagging ━━━\n');

    for (const cfg of MENTIONS) {
      const questions = await loadPool(cfg.file);
      if (!questions) {
        console.log(`⏭️  ${cfg.mention.toUpperCase()} — ${cfg.file} not present yet, skipping`);
        continue;
      }

      console.log(`📋 ${cfg.mention.toUpperCase()} — ${questions.length} questions loaded from ${cfg.file}`);
      const { matched, unmatched } = await flagMention(client, { ...cfg, questions });
      console.log(`   ✓ Matched: ${matched} / ${questions.length}`);
      if (unmatched.length > 0) {
        console.log(`   ✗ Unmatched (${unmatched.length}) — present in official list but absent from our DB:`);
        for (const u of unmatched.slice(0, 10)) {
          console.log(`       n=${u.n} (theme ${u.theme}): "${u.text}"`);
        }
        if (unmatched.length > 10) {
          console.log(`       … and ${unmatched.length - 10} more`);
        }
      }
      console.log('');
    }

    // Summary stats on the DB side
    const summary = await client.query(`
      SELECT
        theme_id,
        COUNT(*) FILTER (WHERE is_official) AS official,
        COUNT(*) FILTER (WHERE NOT is_official) AS custom,
        COUNT(*) AS total
      FROM questions
      GROUP BY theme_id
      ORDER BY theme_id;
    `);
    console.log('📊 Per-theme coverage after flagging:');
    console.log('   theme | official | custom | total');
    for (const row of summary.rows) {
      console.log(
        `   ${row.theme_id}     |    ${String(row.official).padStart(3)}   |  ${String(row.custom).padStart(3)}   | ${row.total}`,
      );
    }
    const total = await client.query(
      `SELECT COUNT(*) FILTER (WHERE is_official) AS o, COUNT(*) AS t FROM questions`,
    );
    const o = Number(total.rows[0].o);
    const t = Number(total.rows[0].t);
    console.log(
      `   TOTAL | ${o} official / ${t} rows = ${((o * 100) / t).toFixed(1)}% official coverage`,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
