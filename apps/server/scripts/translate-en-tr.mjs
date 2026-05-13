#!/usr/bin/env node
/**
 * One-shot bulk translator: FR → EN + TR for the questions and fiches tables.
 *
 * Why this exists
 * ---------------
 * We shipped the EN + TR language *infrastructure* (picker pills, DB enum,
 * Zod validation, "translation pending" notice) without the actual content
 * translations. This script back-fills the content using Claude as the MT
 * engine. The notice disappears for a given page automatically once the
 * matching row exists in question_translations / fiche_translations.
 *
 * Why one model, one tool call per question
 * -----------------------------------------
 * Each question is small (one prompt, four choices, one explanation). Doing
 * both EN and TR in a single tool-use turn halves the round trips and keeps
 * the two translations consistent in voice. The tool schema gives us strict
 * JSON output — no parsing fragile prose.
 *
 * Idempotency
 * -----------
 * We INSERT … ON CONFLICT (question_id, lang) DO NOTHING. Re-running the
 * script never overwrites a row that already exists. To re-translate a row,
 * delete it first.
 *
 * Cost / rate-limit envelope
 * --------------------------
 * 610 questions × ~1.2k input tokens × 2 langs ≈ 1.5M in / ~600k out total.
 * Sonnet 4.5 pricing at ship date: ~$3/MTok in + $15/MTok out ≈ $13–18 USD.
 * We sleep `RATE_LIMIT_MS` (default 350 ms) between calls to stay well under
 * the org-level concurrency cap.
 *
 * Usage
 * -----
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-en-tr.mjs
 *   ANTHROPIC_API_KEY=sk-ant-... DRY_RUN=1 node scripts/translate-en-tr.mjs   # 5 items, no DB write
 *   ANTHROPIC_API_KEY=sk-ant-... ONLY=fiches node scripts/translate-en-tr.mjs
 *   ANTHROPIC_API_KEY=sk-ant-... ONLY=questions node scripts/translate-en-tr.mjs
 *
 * Connection pulled from apps/server/.env (DATABASE_URL).
 */

import 'dotenv/config';
import pg from 'pg';
import { setTimeout as sleep } from 'node:timers/promises';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DRY_RUN = process.env.DRY_RUN === '1';
const ONLY = process.env.ONLY; // 'questions' | 'fiches' | undefined
const RATE_LIMIT_MS = Number(process.env.RATE_LIMIT_MS || 350);
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres@localhost:5432/civique';

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY environment variable is required.');
  console.error('   Get a key at https://console.anthropic.com/ then re-run:');
  console.error('   ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-en-tr.mjs');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 4 });

// ─────────────────────────────────────────────────────────────
// Tool schemas — strict JSON output, no prose
// ─────────────────────────────────────────────────────────────

const questionTool = {
  name: 'submit_question_translations',
  description:
    'Submit the English and Turkish translations of a French civic-exam question.',
  input_schema: {
    type: 'object',
    properties: {
      en: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'The question text in English.' },
          explanation: {
            type: 'string',
            description: 'The explanation in English. Required.',
          },
          choices: {
            type: 'array',
            description:
              'Four answer choices in English, preserving the id letters a/b/c/d in the same order.',
            minItems: 4,
            maxItems: 4,
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', enum: ['a', 'b', 'c', 'd'] },
                text: { type: 'string' },
              },
              required: ['id', 'text'],
            },
          },
        },
        required: ['text', 'explanation', 'choices'],
      },
      tr: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'The question text in Turkish.' },
          explanation: {
            type: 'string',
            description: 'The explanation in Turkish. Required.',
          },
          choices: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', enum: ['a', 'b', 'c', 'd'] },
                text: { type: 'string' },
              },
              required: ['id', 'text'],
            },
          },
        },
        required: ['text', 'explanation', 'choices'],
      },
    },
    required: ['en', 'tr'],
  },
};

const ficheTool = {
  name: 'submit_fiche_translations',
  description:
    'Submit the English and Turkish translations of a French civic-exam study note. Preserve all markdown formatting (headings, bold, lists, etc.) byte-for-byte structurally — only translate the prose.',
  input_schema: {
    type: 'object',
    properties: {
      en: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: {
            type: 'string',
            description:
              'The full markdown content, translated. Keep heading levels (# ## ###), list markers (-, *, 1.), and emphasis (**, _) intact.',
          },
        },
        required: ['title', 'content'],
      },
      tr: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
        },
        required: ['title', 'content'],
      },
    },
    required: ['en', 'tr'],
  },
};

// ─────────────────────────────────────────────────────────────
// Anthropic call
// ─────────────────────────────────────────────────────────────

async function callAnthropic(systemPrompt, userPrompt, tool) {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      tools: [tool],
      tool_choice: { type: 'tool', name: tool.name },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${body}`);
  }
  const data = await res.json();
  const toolUse = data.content?.find((c) => c.type === 'tool_use');
  if (!toolUse) {
    throw new Error(`No tool_use block in response: ${JSON.stringify(data)}`);
  }
  return toolUse.input;
}

// ─────────────────────────────────────────────────────────────
// Question translation
// ─────────────────────────────────────────────────────────────

const QUESTION_SYSTEM_PROMPT = `You translate French civic-exam questions for the French citizenship test (CSP / CR / nationalité) into English and Turkish.

Translation principles:
- Be faithful to the FR meaning. Do not paraphrase, simplify or add commentary.
- Preserve official French names of institutions and laws in their original form, with the English/Turkish gloss in parentheses on first reference within the same string. Example: « La Sécurité sociale » → "La Sécurité sociale (the French social security system)" / "Sécurité sociale (Fransız sosyal güvenlik sistemi)". For acronyms commonly known (CAF, CPAM, SMIC) keep the acronym then gloss.
- Keep the same choice IDs (a/b/c/d) in the same order as the input. Do NOT reorder.
- Keep proper nouns of people and places untranslated (Marianne, Marseille, République française).
- Use plain, neutral, exam-appropriate register. Tu/vous becomes "you" / "siz" naturally.
- Output only via the tool. No prose, no apology, no preamble.`;

function buildQuestionUserPrompt(q) {
  const choicesFr = q.choices_fr
    .map((c) => `  ${c.id}) ${c.text}`)
    .join('\n');
  return `French source (question id ${q.id}):

Question: ${q.text_fr}

Choices:
${choicesFr}

Correct choice: ${q.correct_choice}

Explanation: ${q.explanation_fr ?? '(empty)'}

Translate this question into English (en) and Turkish (tr).`;
}

async function processQuestion(client, q) {
  const result = await callAnthropic(
    QUESTION_SYSTEM_PROMPT,
    buildQuestionUserPrompt(q),
    questionTool,
  );

  // Defensive validation — Claude very occasionally drops a field; we re-emit
  // a clear error so the row is left untouched and we can retry by re-running.
  for (const lang of ['en', 'tr']) {
    const t = result[lang];
    if (!t?.text || !t?.choices || t.choices.length !== 4) {
      throw new Error(
        `Question ${q.id}: incomplete ${lang} translation: ${JSON.stringify(t)}`,
      );
    }
    // Preserve choice order matching input ids a/b/c/d
    const sourceIds = q.choices_fr.map((c) => c.id);
    const outIds = t.choices.map((c) => c.id);
    if (JSON.stringify(sourceIds) !== JSON.stringify(outIds)) {
      // Re-sort by source order — last-resort safety net.
      t.choices = sourceIds.map(
        (id) => t.choices.find((c) => c.id === id) ?? { id, text: '' },
      );
    }
  }

  if (DRY_RUN) {
    console.log(`  ↳ [DRY] q${q.id}\n      EN: ${result.en.text.slice(0, 80)}…\n      TR: ${result.tr.text.slice(0, 80)}…`);
    return;
  }

  for (const lang of ['en', 'tr']) {
    const t = result[lang];
    await client.query(
      `INSERT INTO question_translations (question_id, lang, text, explanation, choices)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       ON CONFLICT (question_id, lang) DO NOTHING`,
      [q.id, lang, t.text, t.explanation ?? null, JSON.stringify(t.choices)],
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Fiche translation
// ─────────────────────────────────────────────────────────────

const FICHE_SYSTEM_PROMPT = `You translate French civic-exam study notes (markdown documents) into English and Turkish.

Translation principles:
- Translate the prose faithfully. Do not paraphrase, simplify, or add commentary.
- Preserve all markdown structure exactly: # / ## / ### heading levels, "- " bullet markers, "1. " numbered lists, **bold**, *italic*, inline \`code\`, blank lines between blocks.
- Preserve official French names of institutions and laws in the original form, with the English/Turkish gloss in parentheses on first reference. Acronyms keep their FR form (CAF, CPAM, SMIC, CGT…) with a gloss on first use.
- Keep proper nouns (Marianne, République française, Conseil constitutionnel) untranslated except where a widely-recognized English/Turkish equivalent exists (e.g. "the French Republic" / "Fransız Cumhuriyeti").
- Plain, neutral, exam-appropriate register.
- Output only via the tool. No prose, no preamble.`;

function buildFicheUserPrompt(f) {
  return `French source (fiche id ${f.id}, theme ${f.theme_id}):

Title: ${f.title_fr}

Content (markdown):
${f.content_fr}

Translate this fiche into English (en) and Turkish (tr), preserving the markdown structure exactly.`;
}

async function processFiche(client, f) {
  const result = await callAnthropic(
    FICHE_SYSTEM_PROMPT,
    buildFicheUserPrompt(f),
    ficheTool,
  );

  for (const lang of ['en', 'tr']) {
    const t = result[lang];
    if (!t?.title || !t?.content) {
      throw new Error(`Fiche ${f.id}: incomplete ${lang} translation`);
    }
  }

  if (DRY_RUN) {
    console.log(`  ↳ [DRY] fiche${f.id}\n      EN title: ${result.en.title}\n      TR title: ${result.tr.title}`);
    return;
  }

  for (const lang of ['en', 'tr']) {
    const t = result[lang];
    await client.query(
      `INSERT INTO fiche_translations (fiche_id, lang, title, content)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (fiche_id, lang) DO NOTHING`,
      [f.id, lang, t.title, t.content],
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  const client = await pool.connect();
  try {
    // ── Questions phase ──
    if (!ONLY || ONLY === 'questions') {
      const { rows: questionsToTranslate } = await client.query(`
        SELECT q.id, q.text_fr, q.choices_fr, q.correct_choice, q.explanation_fr
        FROM questions q
        WHERE NOT EXISTS (
          SELECT 1 FROM question_translations qt
          WHERE qt.question_id = q.id AND qt.lang = 'en'
        ) OR NOT EXISTS (
          SELECT 1 FROM question_translations qt
          WHERE qt.question_id = q.id AND qt.lang = 'tr'
        )
        ORDER BY q.id
        ${DRY_RUN ? 'LIMIT 5' : ''};
      `);

      console.log(
        `\n📝 Questions to translate: ${questionsToTranslate.length}${DRY_RUN ? ' (dry-run, 5 max)' : ''}`,
      );
      let done = 0;
      let failed = 0;
      const startedAt = Date.now();
      for (const q of questionsToTranslate) {
        try {
          await processQuestion(client, q);
          done++;
          if (done % 10 === 0 || done === questionsToTranslate.length) {
            const elapsed = (Date.now() - startedAt) / 1000;
            const rate = (done / elapsed).toFixed(2);
            const eta = ((questionsToTranslate.length - done) / Number(rate)).toFixed(0);
            console.log(
              `   ${done}/${questionsToTranslate.length} done (${rate} q/s, ETA ${eta}s, ${failed} failed)`,
            );
          }
          await sleep(RATE_LIMIT_MS);
        } catch (err) {
          failed++;
          console.error(`   ✗ Question ${q.id} failed: ${err.message}`);
          if (failed > 20) {
            console.error('   Aborting: too many failures.');
            break;
          }
        }
      }
      console.log(`✅ Questions phase done: ${done} translated, ${failed} failed.\n`);
    }

    // ── Fiches phase ──
    if (!ONLY || ONLY === 'fiches') {
      const { rows: fichesToTranslate } = await client.query(`
        SELECT f.id, f.theme_id, f.title_fr, f.content_fr
        FROM fiches f
        WHERE NOT EXISTS (
          SELECT 1 FROM fiche_translations ft
          WHERE ft.fiche_id = f.id AND ft.lang = 'en'
        ) OR NOT EXISTS (
          SELECT 1 FROM fiche_translations ft
          WHERE ft.fiche_id = f.id AND ft.lang = 'tr'
        )
        ORDER BY f.id;
      `);

      console.log(`📚 Fiches to translate: ${fichesToTranslate.length}`);
      let done = 0;
      let failed = 0;
      for (const f of fichesToTranslate) {
        try {
          await processFiche(client, f);
          done++;
          console.log(`   ✓ Fiche ${f.id} (${f.title_fr.slice(0, 50)}) translated`);
          await sleep(RATE_LIMIT_MS);
        } catch (err) {
          failed++;
          console.error(`   ✗ Fiche ${f.id} failed: ${err.message}`);
        }
      }
      console.log(`✅ Fiches phase done: ${done} translated, ${failed} failed.\n`);
    }

    // ── Final summary ──
    const { rows: summary } = await client.query(`
      SELECT
        'questions' AS kind,
        lang,
        COUNT(*)::int AS n
      FROM question_translations
      WHERE lang IN ('en', 'tr')
      GROUP BY lang
      UNION ALL
      SELECT 'fiches', lang, COUNT(*)::int
      FROM fiche_translations
      WHERE lang IN ('en', 'tr')
      GROUP BY lang
      ORDER BY kind, lang;
    `);

    console.log('📊 Final coverage:');
    for (const r of summary) {
      console.log(`   ${r.kind}.${r.lang} → ${r.n} rows`);
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
