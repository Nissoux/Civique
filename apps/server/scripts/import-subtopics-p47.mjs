#!/usr/bin/env node
/**
 * Imports the second-pass sub-topic classification for the 47
 * questions that escaped the first classifier (the ones imported via
 * missing_questions_p1.json after the seed files were parsed).
 *
 * Same shape as import-subtopics.mjs but reads
 * question_subtopics_p47.json — which carries `id` alongside `text_fr`
 * because the agent pulled from the DB directly.
 *
 * Idempotent — UPDATE by id, no-op on already-classified rows.
 */

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '../data/question_subtopics_p47.json');
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/civique';

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 4 });

async function main() {
  const raw = await readFile(DATA_FILE, 'utf8');
  const data = JSON.parse(raw);
  const assignments = data.assignments ?? [];
  console.log(`\n📦 Importing ${assignments.length} P1-batch sub-topic assignments…\n`);

  const client = await pool.connect();
  let updated = 0;
  let missing = 0;
  try {
    for (const a of assignments) {
      if (!a.subtopic) continue;
      const res = await client.query(
        `UPDATE questions SET subtopic = $1 WHERE id = $2 RETURNING id`,
        [a.subtopic, a.id],
      );
      if (res.rowCount > 0) updated++;
      else missing++;
    }
    console.log(`✓ Updated ${updated} rows.`);
    if (missing > 0) console.log(`⚠️  ${missing} ids had no matching row.`);

    const { rows } = await client.query(`
      SELECT
        COUNT(*) FILTER (WHERE subtopic IS NOT NULL) AS classified,
        COUNT(*) AS total
      FROM questions;
    `);
    console.log(`\n📊 TOTAL classified: ${rows[0].classified} / ${rows[0].total}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
