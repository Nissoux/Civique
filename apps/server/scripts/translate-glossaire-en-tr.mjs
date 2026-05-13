#!/usr/bin/env node
/**
 * Bulk translator: FR → EN + TR for the static glossary file
 * (apps/web/lib/data/glossaire.ts).
 *
 * Why a separate script
 * ---------------------
 * The glossary is a TS file (~1300 lines, ~70 terms), not a DB table — so
 * the patching strategy is regex + file rewrite, not INSERTs. Splitting
 * keeps the question/fiche script (DB-only) simple and replayable.
 *
 * What it does
 * ------------
 *   - Reads apps/web/lib/data/glossaire.ts
 *   - Finds every GlossaryTerm block
 *   - For each, calls Claude to translate `term` + `definition` to EN + TR
 *   - Injects `en: { term, definition }` and `tr: { term, definition }`
 *     into the `translations: { ... }` object of that block
 *   - Writes the file back
 *
 * Idempotency
 * -----------
 * Skips any term that already has both `en:` and `tr:` keys in its
 * translations block. Re-runnable safely.
 *
 * Usage
 * -----
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-glossaire-en-tr.mjs
 *   ANTHROPIC_API_KEY=sk-ant-... DRY_RUN=1 node scripts/translate-glossaire-en-tr.mjs
 *
 * After it runs, remember to:
 *   - rebuild the web app (`pnpm --filter web build`)
 *   - the type definition in glossaire.ts already accepts en/tr after this commit
 */

import 'dotenv/config';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DRY_RUN = process.env.DRY_RUN === '1';
const RATE_LIMIT_MS = Number(process.env.RATE_LIMIT_MS || 350);

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY environment variable is required.');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const GLOSSAIRE_PATH = resolve(__dirname, '../../web/lib/data/glossaire.ts');

// ─────────────────────────────────────────────────────────────
// Tool schema
// ─────────────────────────────────────────────────────────────

const glossaryTool = {
  name: 'submit_glossary_translations',
  description:
    'Submit the English and Turkish translations of a French civic-exam glossary entry.',
  input_schema: {
    type: 'object',
    properties: {
      en: {
        type: 'object',
        properties: {
          term: { type: 'string', description: 'The English term/headword.' },
          definition: {
            type: 'string',
            description: 'The English definition. Same register and length as the FR source.',
          },
        },
        required: ['term', 'definition'],
      },
      tr: {
        type: 'object',
        properties: {
          term: { type: 'string' },
          definition: { type: 'string' },
        },
        required: ['term', 'definition'],
      },
    },
    required: ['en', 'tr'],
  },
};

const SYSTEM_PROMPT = `You translate French civic-exam glossary entries into English and Turkish.

Translation principles:
- Translate the term faithfully. For terms with no direct equivalent (e.g. "Laïcité"), use the closest English/Turkish concept and keep the French term in parentheses if useful: "Secularism (Laïcité)" / "Laiklik (Laïcité)".
- Translate the definition faithfully — same length, same register, same level of detail. No paraphrase, no add-on commentary.
- Preserve official French institution names (Sécurité sociale, Conseil constitutionnel, CAF…) with an English/Turkish gloss in parentheses on first mention inside the definition.
- Plain, neutral, exam-appropriate register.
- Output only via the tool. No prose.`;

// ─────────────────────────────────────────────────────────────
// Anthropic call
// ─────────────────────────────────────────────────────────────

async function callAnthropic(userPrompt) {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
      tools: [glossaryTool],
      tool_choice: { type: 'tool', name: glossaryTool.name },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic ${res.status}: ${body}`);
  }
  const data = await res.json();
  const toolUse = data.content?.find((c) => c.type === 'tool_use');
  if (!toolUse) throw new Error('No tool_use in response');
  return toolUse.input;
}

// ─────────────────────────────────────────────────────────────
// File patching
// ─────────────────────────────────────────────────────────────

/**
 * Escape a JS-string-literal value for embedding inside single quotes in TS:
 *   - backslash, single quote, control chars
 *   - We use the same convention as the existing file (single-quoted strings).
 */
function escapeJsString(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Parse one GlossaryTerm block. Returns { id, term, definition, hasEn, hasTr,
 * translationsInner, translationsStart, translationsEnd }.
 *
 * Matches a block of the form:
 *   {
 *     id: 12,
 *     term: '...',
 *     definition: '...',
 *     themeId: 3,
 *     translations: {
 *       ar: { ... },
 *       ...
 *     },
 *   },
 */
function* iterateTerms(source) {
  const re =
    /(\{\s*id:\s*(\d+),\s*term:\s*'((?:[^'\\]|\\.)*)',\s*definition:\s*'((?:[^'\\]|\\.)*)',\s*themeId:\s*\d+,\s*translations:\s*)(\{)([\s\S]*?)(\n\s*\},)/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const [
      full,
      leading,
      idStr,
      termRaw,
      definitionRaw,
      openingBrace,
      innerBody,
      closingBrace,
    ] = m;
    yield {
      matchStart: m.index,
      matchEnd: m.index + full.length,
      id: Number(idStr),
      term: termRaw.replace(/\\'/g, "'").replace(/\\\\/g, '\\'),
      definition: definitionRaw.replace(/\\'/g, "'").replace(/\\\\/g, '\\'),
      leading,
      openingBrace,
      innerBody,
      closingBrace,
      hasEn: /\ben:\s*\{/.test(innerBody),
      hasTr: /\btr:\s*\{/.test(innerBody),
    };
  }
}

function injectEnTr(innerBody, en, tr) {
  // Append en + tr just before the closing newline.
  const enLine = `      en: { term: '${escapeJsString(en.term)}', definition: '${escapeJsString(en.definition)}' },`;
  const trLine = `      tr: { term: '${escapeJsString(tr.term)}', definition: '${escapeJsString(tr.definition)}' },`;
  // Ensure trailing newline before our additions (avoid jamming on one line).
  const trimmed = innerBody.replace(/\s+$/, '');
  return `${trimmed}\n${enLine}\n${trLine}`;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  let source = await readFile(GLOSSAIRE_PATH, 'utf8');
  console.log(`📖 Loaded ${GLOSSAIRE_PATH} (${source.length} chars)`);

  // Walk every term, then rebuild the file by stitching slices.
  // We iterate first to a list (so we have stable indices), then rebuild.
  const terms = Array.from(iterateTerms(source));
  console.log(`   Found ${terms.length} glossary terms.`);

  let toTranslate = terms.filter((t) => !t.hasEn || !t.hasTr);
  if (DRY_RUN) toTranslate = toTranslate.slice(0, 3);
  console.log(`   Need EN+TR for: ${toTranslate.length} terms${DRY_RUN ? ' (dry-run, 3 max)' : ''}\n`);

  // Translate sequentially to respect rate limits.
  const translations = new Map(); // term.id → { en, tr }
  let done = 0;
  let failed = 0;
  for (const term of toTranslate) {
    try {
      const result = await callAnthropic(
        `French source (glossary id ${term.id}):

Term: ${term.term}
Definition: ${term.definition}

Translate this glossary entry into English (en) and Turkish (tr).`,
      );
      if (!result.en?.term || !result.tr?.term) {
        throw new Error('Missing en/tr in tool output');
      }
      translations.set(term.id, result);
      done++;
      console.log(
        `   ✓ [${done}/${toTranslate.length}] id ${term.id} "${term.term}" → EN: "${result.en.term}" · TR: "${result.tr.term}"`,
      );
      await sleep(RATE_LIMIT_MS);
    } catch (err) {
      failed++;
      console.error(`   ✗ id ${term.id} "${term.term}" failed: ${err.message}`);
    }
  }

  if (DRY_RUN) {
    console.log('\n🔍 DRY_RUN: not writing file. Sample output above.');
    return;
  }

  if (translations.size === 0) {
    console.log('\nℹ️  Nothing to write.');
    return;
  }

  // Rebuild file: walk matches again, replace innerBody where we have a
  // translation. We do this on the freshly-loaded source so positions are
  // stable.
  let out = '';
  let cursor = 0;
  for (const term of terms) {
    out += source.slice(cursor, term.matchStart);
    if (translations.has(term.id)) {
      const t = translations.get(term.id);
      const newInner = injectEnTr(term.innerBody, t.en, t.tr);
      out +=
        term.leading +
        term.openingBrace +
        newInner +
        term.closingBrace;
    } else {
      out += source.slice(term.matchStart, term.matchEnd);
    }
    cursor = term.matchEnd;
  }
  out += source.slice(cursor);

  await writeFile(GLOSSAIRE_PATH, out, 'utf8');
  console.log(`\n✅ Wrote ${GLOSSAIRE_PATH}`);
  console.log(`   ${done} terms translated, ${failed} failed.`);
  console.log(`   Run: pnpm --filter web build  → then redeploy web.`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
