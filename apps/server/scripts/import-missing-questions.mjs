#!/usr/bin/env node
/**
 * Imports the questions that the 2026 conformity audit flagged as
 * "present in the Ministry official pool but missing from our DB".
 *
 * Reads
 * -----
 *   apps/server/data/missing_questions_p1.json
 *     46 fully-formed entries produced by a translation agent:
 *     text_fr, choices_fr, correct_choice, explanation_fr,
 *     translations.{en,tr}, official_ref ("CR#1", "NAT#138", "CR#77 + NAT#88")
 *
 * Writes
 * ------
 *   - INSERT INTO questions (...) with is_official=true and the right
 *     official_csp_order / official_cr_order / official_nat_order parsed
 *     from official_ref. Difficulty defaults to 1, is_premium to false —
 *     same defaults the rest of the pool uses.
 *   - INSERT INTO question_translations for en + tr.
 *
 * Idempotent
 * ----------
 * text_fr has a unique constraint. If a question already exists, we skip
 * it (and report it). Re-running the script after a partial run only
 * inserts the still-missing rows.
 *
 * Usage
 * -----
 *   node apps/server/scripts/import-missing-questions.mjs
 *   DRY_RUN=1 node ...   # parse + report, no DB write
 *
 * Connection: DATABASE_URL env var (loaded from apps/server/.env).
 */

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '../data/missing_questions_p1.json');
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/civique';
const DRY_RUN = process.env.DRY_RUN === '1';

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 4 });

/**
 * Parse "CR#1", "NAT#138", "CR#77 + NAT#88" into per-mention orders.
 * Returns { csp, cr, nat } where missing mentions are null.
 */
function parseOfficialRef(ref) {
  const out = { csp: null, cr: null, nat: null };
  if (!ref) return out;
  const parts = ref.split('+').map((s) => s.trim());
  for (const p of parts) {
    const m = p.match(/^(CSP|CR|NAT)\s*#\s*(\d+)$/i);
    if (m) {
      out[m[1].toLowerCase()] = Number(m[2]);
    }
  }
  return out;
}

async function importOne(client, q) {
  // Quick existence check — text_fr has a unique constraint, but we want
  // to report skips loudly rather than catch a 23505.
  const existing = await client.query(
    `SELECT id FROM questions WHERE text_fr = $1 LIMIT 1`,
    [q.text_fr],
  );
  if (existing.rowCount > 0) {
    return { status: 'skipped', id: existing.rows[0].id, reason: 'text_fr already exists' };
  }

  const orders = parseOfficialRef(q.official_ref);

  if (DRY_RUN) {
    return {
      status: 'dry-run',
      reason: `would insert with official_ref ${q.official_ref} → csp:${orders.csp} cr:${orders.cr} nat:${orders.nat}`,
    };
  }

  // Insert question row
  const insertRes = await client.query(
    `INSERT INTO questions (
       theme_id, type, exam_types, text_fr, choices_fr,
       correct_choice, explanation_fr,
       is_official, official_csp_order, official_cr_order, official_nat_order
     )
     VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, true, $8, $9, $10)
     RETURNING id`,
    [
      q.theme_id,
      q.type,
      q.exam_types,
      q.text_fr,
      JSON.stringify(q.choices_fr),
      q.correct_choice,
      q.explanation_fr,
      orders.csp,
      orders.cr,
      orders.nat,
    ],
  );
  const questionId = insertRes.rows[0].id;

  // Insert translations
  for (const lang of ['en', 'tr']) {
    const t = q.translations?.[lang];
    if (!t?.text) continue;
    await client.query(
      `INSERT INTO question_translations (question_id, lang, text, explanation, choices)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       ON CONFLICT (question_id, lang) DO NOTHING`,
      [
        questionId,
        lang,
        t.text,
        t.explanation ?? null,
        JSON.stringify(t.choices),
      ],
    );
  }

  return { status: 'inserted', id: questionId };
}

async function main() {
  const raw = await readFile(DATA_FILE, 'utf8');
  const data = JSON.parse(raw);
  const questions = data.questions ?? [];

  console.log(`\n📦 Importing ${questions.length} missing questions${DRY_RUN ? ' (DRY RUN)' : ''}…\n`);

  const client = await pool.connect();
  let inserted = 0;
  let skipped = 0;
  let failed = 0;
  try {
    for (const q of questions) {
      try {
        const res = await importOne(client, q);
        if (res.status === 'inserted') {
          inserted++;
          console.log(`   ✓ id=${res.id} "${q.text_fr.slice(0, 60)}…"`);
        } else if (res.status === 'skipped') {
          skipped++;
          console.log(`   ⏭️  skip id=${res.id} (${res.reason}) "${q.text_fr.slice(0, 60)}…"`);
        } else {
          console.log(`   🔍 ${res.reason} — "${q.text_fr.slice(0, 60)}…"`);
        }
      } catch (err) {
        failed++;
        console.error(`   ✗ failed "${q.text_fr.slice(0, 60)}…": ${err.message}`);
      }
    }

    if (!DRY_RUN) {
      const { rows: cov } = await client.query(`
        SELECT
          COUNT(*) FILTER (WHERE is_official) AS official,
          COUNT(*) AS total
        FROM questions
      `);
      const o = Number(cov[0].official);
      const t = Number(cov[0].total);
      console.log(`\n📊 Total inserted: ${inserted} · skipped: ${skipped} · failed: ${failed}`);
      console.log(`   Coverage: ${o} / ${t} = ${((o * 100) / t).toFixed(1)}% official`);
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
