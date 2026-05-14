#!/usr/bin/env node
/**
 * Imports the heuristic sub-topic classification produced by the
 * background agent into the `questions.subtopic` column.
 *
 * Reads
 * -----
 *   apps/server/data/question_subtopics.json
 *     { assignments: [{ text_fr, theme_id, subtopic, ambiguous? }, ...] }
 *
 * Writes
 * ------
 *   For each assignment, run:
 *     UPDATE questions SET subtopic = $1 WHERE text_fr = $2;
 *
 *   Reports per-(theme, subtopic) counts after the run so we can
 *   sanity-check that the official thresholds are met:
 *     T1: ≥3 devise, ≥2 laicite, ≥6 situation
 *     T2: ≥3 vote, ≥2 organisation, ≥1 union_europ
 *     T3: ≥2 droits_fond, ≥3 obligations, ≥6 situation
 *     T4: ≥3 periodes, ≥3 geographie, ≥2 patrimoine
 *     T5: ≥1 per sub-topic
 *
 * Idempotent — re-running overwrites the same value.
 *
 * Usage
 * -----
 *   node apps/server/scripts/import-subtopics.mjs
 *   DRY_RUN=1 node ...   # report only, no DB write
 */

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '../data/question_subtopics.json');
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/civique';
const DRY_RUN = process.env.DRY_RUN === '1';

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 4 });

async function main() {
  const raw = await readFile(DATA_FILE, 'utf8');
  const data = JSON.parse(raw);
  const assignments = data.assignments ?? [];

  console.log(`\n📦 Importing ${assignments.length} sub-topic assignments${DRY_RUN ? ' (DRY RUN)' : ''}…\n`);

  const client = await pool.connect();
  let updated = 0;
  let missing = 0;
  try {
    for (const a of assignments) {
      if (!a.subtopic) continue;
      if (DRY_RUN) {
        updated++;
        continue;
      }
      const res = await client.query(
        `UPDATE questions SET subtopic = $1 WHERE text_fr = $2 RETURNING id`,
        [a.subtopic, a.text_fr],
      );
      if (res.rowCount > 0) {
        updated++;
      } else {
        missing++;
      }
    }

    console.log(`✓ Updated ${updated} rows.`);
    if (missing > 0) {
      console.log(`⚠️  ${missing} assignments had no matching text_fr in DB (likely typographic drift).`);
    }

    if (!DRY_RUN) {
      const { rows } = await client.query(`
        SELECT theme_id, subtopic, COUNT(*)::int AS n
        FROM questions
        WHERE subtopic IS NOT NULL
        GROUP BY theme_id, subtopic
        ORDER BY theme_id, subtopic;
      `);
      console.log(`\n📊 Per-(theme, subtopic) counts:`);
      let currentTheme = -1;
      for (const r of rows) {
        if (r.theme_id !== currentTheme) {
          console.log(`\n   Thème ${r.theme_id}:`);
          currentTheme = r.theme_id;
        }
        console.log(`     ${r.subtopic.padEnd(15)} ${r.n}`);
      }

      const { rows: total } = await client.query(`
        SELECT
          COUNT(*) FILTER (WHERE subtopic IS NOT NULL) AS classified,
          COUNT(*) AS total
        FROM questions;
      `);
      console.log(
        `\n   TOTAL classified: ${total[0].classified} / ${total[0].total}`,
      );
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
