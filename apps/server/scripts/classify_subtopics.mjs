#!/usr/bin/env node
// Classify all civic questions into official subtopics per arrêté du 10 octobre 2025.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '..', 'src', 'db');
const OUT_PATH = path.join(__dirname, '..', 'data', 'question_subtopics.json');

// ────────────────────────────────────────────────────────────────
// 1. Parse all questions from TS files using a robust object parser
// ────────────────────────────────────────────────────────────────

/**
 * Parse a TS file containing an array of question objects.
 * Each object has fields: themeId, type, textFr, explanationFr, choicesFr.
 * We use a brace-counting parser to extract each top-level { ... } block.
 */
function extractObjectBlocks(source) {
  const blocks = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let stringChar = '';
  let escape = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (c === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (c === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inString) {
      if (escape) {
        escape = false;
      } else if (c === '\\') {
        escape = true;
      } else if (c === stringChar) {
        inString = false;
      }
      continue;
    }

    if (c === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (c === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      inString = true;
      stringChar = c;
      continue;
    }
    if (c === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        blocks.push(source.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return blocks;
}

function getStringField(block, fieldName) {
  // Match: fieldName: "value" or fieldName: 'value' (handle escapes minimally)
  const re = new RegExp(`${fieldName}\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`);
  const m = block.match(re);
  if (!m) return null;
  // Strip surrounding quotes and unescape \" \' \\
  let s = m[1];
  s = s.slice(1, -1);
  s = s.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\').replace(/\\n/g, '\n');
  return s;
}

function getNumericField(block, fieldName) {
  const re = new RegExp(`${fieldName}\\s*:\\s*(\\d+)`);
  const m = block.match(re);
  return m ? Number(m[1]) : null;
}

function getTypeField(block) {
  // type: 'knowledge' as const  OR  type: 'situational' as const
  // (some files use double quotes)
  const m = block.match(/type\s*:\s*['"](knowledge|situational)['"]/);
  return m ? m[1] : null;
}

function parseQuestionFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  // Drop the leading `export const xxx = [` and trailing `];` for clarity, but
  // the parser already ignores those when counting top-level braces inside the array.
  const blocks = extractObjectBlocks(src);
  const questions = [];
  for (const block of blocks) {
    const themeId = getNumericField(block, 'themeId');
    const type = getTypeField(block);
    const textFr = getStringField(block, 'textFr');
    // Skip nested objects inside choicesFr (those have `id` and `text` but no themeId)
    if (themeId == null || !textFr) continue;
    questions.push({
      themeId,
      type: type ?? 'knowledge',
      textFr,
    });
  }
  return questions;
}

// ────────────────────────────────────────────────────────────────
// 2. Classifier — keyword-based, theme-scoped
// ────────────────────────────────────────────────────────────────

/**
 * Normalize a French string for matching: lowercase, strip accents.
 */
function norm(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Return list of [keyword, score] hits in normalized text.
 * keywordSet is a list of {kw, weight?, wholeWord?}.
 * - Short keywords (<= 4 chars) and acronyms get whole-word matching automatically.
 * - Keywords with surrounding spaces are matched as-is (already explicit boundary).
 */
function hits(text, keywords) {
  const n = norm(text);
  const padded = ' ' + n + ' '; // so leading/trailing word boundaries work via spaces
  const hitList = [];
  for (const { kw, weight = 1, wholeWord } of keywords) {
    let found = false;
    const useWhole = wholeWord || (kw.length <= 4 && !kw.includes(' '));
    if (useWhole) {
      // Build regex with word boundaries
      try {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`);
        if (re.test(n)) found = true;
      } catch {
        found = n.includes(kw);
      }
    } else {
      found = n.includes(kw);
    }
    if (found) hitList.push({ kw, weight });
  }
  return hitList;
}

function scoreSubtopics(text, subtopicKwMap) {
  const scores = {};
  for (const [st, kws] of Object.entries(subtopicKwMap)) {
    const hs = hits(text, kws);
    scores[st] = hs.reduce((s, h) => s + h.weight, 0);
  }
  return scores;
}

function pickWinner(scores) {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return { winner: null, ambiguous: true };
  if (entries[0][1] === 0) return { winner: null, ambiguous: true };
  // ambiguous if top two tied or close
  const ambiguous = entries.length >= 2 && entries[1][1] === entries[0][1];
  return { winner: entries[0][0], ambiguous };
}

// ── Keyword maps per theme ─────────────────────────────────────────────

const KW_THEME1 = {
  devise: [
    { kw: 'devise', weight: 3 },
    { kw: 'marianne', weight: 3 },
    { kw: 'drapeau', weight: 3 },
    { kw: 'marseillaise', weight: 3 },
    { kw: '14 juillet', weight: 3 },
    { kw: 'quatorze juillet', weight: 3 },
    { kw: 'symbole', weight: 2 },
    { kw: 'hymne', weight: 3 },
    { kw: 'liberte, egalite', weight: 3 },
    { kw: 'liberte egalite', weight: 3 },
    { kw: 'fraternite', weight: 2 },
    { kw: 'coq', weight: 2 },
    { kw: 'bastille', weight: 3 },
    { kw: 'fete nationale', weight: 3 },
    { kw: 'sceau', weight: 2 },
    { kw: 'phrygien', weight: 2 },
    { kw: 'tricolore', weight: 3 },
    { kw: 'bleu blanc rouge', weight: 3 },
    { kw: 'principe d\'egalite', weight: 2 },
    { kw: 'egalite homme', weight: 2 },
    { kw: 'egalite femme', weight: 2 },
    { kw: 'parite', weight: 2 },
    { kw: 'majorite', weight: 1 },
    { kw: 'principes de la republique', weight: 2 },
    { kw: 'valeurs de la republique', weight: 2 },
    { kw: 'indivisible', weight: 2 },
    { kw: 'sociale', weight: 1 },
    { kw: 'democratique', weight: 1 },
  ],
  laicite: [
    { kw: 'laicite', weight: 4 },
    { kw: 'laique', weight: 3 },
    { kw: '1905', weight: 4 },
    { kw: 'religion', weight: 3 },
    { kw: 'religieu', weight: 3 },
    { kw: 'eglise', weight: 3 },
    { kw: 'culte', weight: 3 },
    { kw: 'priere', weight: 3 },
    { kw: 'voile', weight: 3 },
    { kw: 'foulard', weight: 3 },
    { kw: 'kippa', weight: 3 },
    { kw: 'croix', weight: 2 },
    { kw: 'signe religieux', weight: 4 },
    { kw: 'signes religieux', weight: 4 },
    { kw: 'separation', weight: 2 },
    { kw: 'neutralite', weight: 3 },
    { kw: 'spirituel', weight: 2 },
    { kw: 'croyance', weight: 2 },
    { kw: 'athee', weight: 2 },
    { kw: 'islam', weight: 2 },
    { kw: 'juif', weight: 2 },
    { kw: 'chretien', weight: 2 },
    { kw: 'catholique', weight: 2 },
    { kw: 'protestant', weight: 2 },
    { kw: 'musulman', weight: 2 },
    { kw: 'halal', weight: 3 },
    { kw: 'casher', weight: 3 },
    { kw: 'ramadan', weight: 3 },
  ],
  // situation is forced by type field, not by keyword
};

const KW_THEME2 = {
  vote: [
    { kw: 'voter', weight: 4 },
    { kw: 'vote', weight: 3 },
    { kw: 'election', weight: 4 },
    { kw: 'elire', weight: 3 },
    { kw: 'suffrage', weight: 4 },
    { kw: 'electeur', weight: 3 },
    { kw: 'electrice', weight: 3 },
    { kw: 'scrutin', weight: 3 },
    { kw: 'urne', weight: 3 },
    { kw: 'bureau de vote', weight: 4 },
    { kw: 'liste electorale', weight: 4 },
    { kw: 'majorite electorale', weight: 3 },
    { kw: 'democratie', weight: 3 },
    { kw: 'democratique', weight: 2 },
    { kw: 'referendum', weight: 4 },
    { kw: 'campagne', weight: 2 },
    { kw: 'candidat', weight: 3 },
    { kw: 'parti politique', weight: 3 },
    { kw: 'mandat', weight: 3 },
  ],
  organisation: [
    { kw: 'president de la republique', weight: 4 },
    { kw: 'premier ministre', weight: 4 },
    { kw: 'gouvernement', weight: 4 },
    { kw: 'ministre', weight: 3 },
    { kw: 'matignon', weight: 3 },
    { kw: 'elysee', weight: 3 },
    { kw: 'assemblee nationale', weight: 4 },
    { kw: 'depute', weight: 3 },
    { kw: 'senat', weight: 4 },
    { kw: 'senateur', weight: 3 },
    { kw: 'parlement', weight: 3 },
    { kw: 'pouvoir executif', weight: 4 },
    { kw: 'pouvoir legislatif', weight: 4 },
    { kw: 'pouvoir judiciaire', weight: 4 },
    { kw: 'separation des pouvoirs', weight: 4 },
    { kw: 'conseil constitutionnel', weight: 4 },
    { kw: 'conseil d\'etat', weight: 3 },
    { kw: 'cour de cassation', weight: 3 },
    { kw: 'cour de justice', weight: 3 },
    { kw: 'maire', weight: 4 },
    { kw: 'mairie', weight: 3 },
    { kw: 'conseil municipal', weight: 4 },
    { kw: 'commune', weight: 3 },
    { kw: 'departement', weight: 3 },
    { kw: 'prefet', weight: 4 },
    { kw: 'prefecture', weight: 3 },
    { kw: 'region', weight: 3 },
    { kw: 'collectivite', weight: 3 },
    { kw: 'constitution', weight: 3 },
    { kw: 'republique', weight: 1 },
    { kw: 'magistrat', weight: 3 },
    { kw: 'juge', weight: 3 },
    { kw: 'tribunal', weight: 3 },
    { kw: 'justice', weight: 2 },
    { kw: 'administration', weight: 2 },
    { kw: 'service public', weight: 2 },
    { kw: 'fonctionnaire', weight: 2 },
  ],
  union_europ: [
    { kw: 'union europeenne', weight: 5 },
    { kw: 'europeenne', weight: 3 },
    { kw: 'europe', weight: 2 },
    { kw: 'ue', weight: 4, wholeWord: true },
    { kw: 'euro', weight: 3 },
    { kw: 'bruxelles', weight: 4 },
    { kw: 'strasbourg', weight: 2 },
    { kw: 'parlement europeen', weight: 5 },
    { kw: 'commission europeenne', weight: 5 },
    { kw: 'conseil europeen', weight: 4 },
    { kw: 'etats membres', weight: 4 },
    { kw: 'schengen', weight: 4 },
    { kw: 'erasmus', weight: 4 },
    { kw: 'monnaie unique', weight: 4 },
    { kw: 'traite', weight: 2 },
    { kw: 'maastricht', weight: 4 },
    { kw: 'rome', weight: 1 },
  ],
};

const KW_THEME3 = {
  droits_fond: [
    { kw: 'liberte d\'expression', weight: 4 },
    { kw: 'liberte de pensee', weight: 4 },
    { kw: 'liberte d\'opinion', weight: 4 },
    { kw: 'liberte d\'association', weight: 4 },
    { kw: 'liberte de reunion', weight: 4 },
    { kw: 'liberte de la presse', weight: 4 },
    { kw: 'liberte de circulation', weight: 4 },
    { kw: 'liberte syndicale', weight: 3 },
    { kw: 'liberte de conscience', weight: 4 },
    { kw: 'liberte religieuse', weight: 3 },
    { kw: 'droit de vote', weight: 4 },
    { kw: 'droit de greve', weight: 4 },
    { kw: 'droit a la propriete', weight: 4 },
    { kw: 'droits fondamentaux', weight: 5 },
    { kw: 'droits de l\'homme', weight: 4 },
    { kw: 'declaration des droits', weight: 5 },
    { kw: 'droit a l\'education', weight: 4 },
    { kw: 'droit au logement', weight: 4 },
    { kw: 'droit a la sante', weight: 4 },
    { kw: 'droit de manifester', weight: 4 },
    { kw: 'liberte individuelle', weight: 4 },
    { kw: 'presomption d\'innocence', weight: 4 },
    { kw: 'liberte publique', weight: 4 },
    { kw: 'droit syndical', weight: 3 },
    { kw: 'libertes fondamentales', weight: 5 },
    { kw: 'protection sociale', weight: 2 },
  ],
  obligations: [
    { kw: 'devoir', weight: 4 },
    { kw: 'devoirs', weight: 4 },
    { kw: 'obligation', weight: 4 },
    { kw: 'obligatoire', weight: 3 },
    { kw: 'impot', weight: 4 },
    { kw: 'impots', weight: 4 },
    { kw: 'taxe', weight: 3 },
    { kw: 'fiscalite', weight: 3 },
    { kw: 'respect de la loi', weight: 4 },
    { kw: 'respecter la loi', weight: 4 },
    { kw: 'jury', weight: 4 },
    { kw: 'jure', weight: 3 },
    { kw: 'service national', weight: 4 },
    { kw: 'snu', weight: 4 },
    { kw: 'recensement', weight: 4 },
    { kw: 'defense nationale', weight: 4 },
    { kw: 'journee defense', weight: 5 },
    { kw: 'jdc', weight: 4 },
    { kw: 'instruction obligatoire', weight: 4 },
    { kw: 'scolarite obligatoire', weight: 4 },
    { kw: 'contribution', weight: 3 },
    { kw: 'respect d\'autrui', weight: 3 },
    { kw: 'civisme', weight: 3 },
    { kw: 'code penal', weight: 3 },
    { kw: 'code civil', weight: 3 },
    { kw: 'loi', weight: 1 },
    { kw: 'amende', weight: 3 },
    { kw: 'sanction', weight: 2 },
    { kw: 'declaration d\'impots', weight: 4 },
    { kw: 'declaration des revenus', weight: 4 },
    { kw: 'infraction', weight: 4 },
    { kw: 'delit', weight: 3 },
    { kw: 'crime', weight: 3 },
    { kw: 'police', weight: 3 },
    { kw: 'gendarmerie', weight: 3 },
    { kw: 'gendarme', weight: 3 },
    { kw: 'incivilite', weight: 4 },
    { kw: 'incivique', weight: 4 },
    { kw: 'depot sauvage', weight: 4 },
    { kw: 'dechet', weight: 3 },
    { kw: 'environnement', weight: 2 },
    { kw: 'tri', weight: 2 },
    { kw: 'recycler', weight: 3 },
    { kw: 'recyclage', weight: 3 },
    { kw: 'pollution', weight: 3 },
    { kw: 'punir', weight: 3 },
    { kw: 'puni', weight: 3 },
    { kw: 'punition', weight: 3 },
    { kw: 'peine', weight: 2 },
    { kw: 'contravention', weight: 4 },
    { kw: 'penal', weight: 3 },
    { kw: 'penale', weight: 3 },
    { kw: 'tribunal', weight: 2 },
    { kw: 'condamnation', weight: 3 },
    { kw: 'transport en commun', weight: 2 },
    { kw: 'metro', weight: 2 },
    { kw: 'ticket', weight: 2 },
    { kw: 'fraude', weight: 3 },
    { kw: 'frauder', weight: 3 },
    { kw: 'voter est', weight: 4 },
    { kw: 'voter constitue', weight: 4 },
    { kw: 'jeter', weight: 3 },
    { kw: 'deposer', weight: 1 },
    { kw: 'bruit', weight: 2 },
    { kw: 'tapage', weight: 4 },
    { kw: 'violences', weight: 1 },
    { kw: 'agression', weight: 2 },
  ],
};

const KW_THEME4 = {
  periodes: [
    { kw: 'revolution', weight: 4 },
    { kw: 'roi', weight: 3 },
    { kw: 'reine', weight: 3 },
    { kw: 'monarchie', weight: 3 },
    { kw: 'empire', weight: 3 },
    { kw: 'napoleon', weight: 4 },
    { kw: 'republique', weight: 1 },
    { kw: 'premiere republique', weight: 4 },
    { kw: 'iiie republique', weight: 4 },
    { kw: 'troisieme republique', weight: 4 },
    { kw: 'quatrieme republique', weight: 4 },
    { kw: 'cinquieme republique', weight: 4 },
    { kw: 've republique', weight: 4 },
    { kw: 'guerre mondiale', weight: 4 },
    { kw: 'premiere guerre', weight: 4 },
    { kw: 'seconde guerre', weight: 4 },
    { kw: 'deuxieme guerre', weight: 4 },
    { kw: 'guerre franco-prussienne', weight: 4 },
    { kw: 'occupation', weight: 3 },
    { kw: 'resistance', weight: 4 },
    { kw: 'liberation', weight: 3 },
    { kw: 'vichy', weight: 4 },
    { kw: 'petain', weight: 4 },
    { kw: 'de gaulle', weight: 4 },
    { kw: 'shoah', weight: 4 },
    { kw: 'genocide', weight: 4 },
    { kw: 'esclavage', weight: 4 },
    { kw: 'abolition', weight: 3 },
    { kw: 'declaration des droits de l\'homme', weight: 4 },
    { kw: 'dreyfus', weight: 4 },
    { kw: 'louis xiv', weight: 4 },
    { kw: 'francois ier', weight: 4 },
    { kw: 'henri iv', weight: 4 },
    { kw: 'jeanne d\'arc', weight: 4 },
    { kw: 'clovis', weight: 4 },
    { kw: 'charlemagne', weight: 4 },
    { kw: 'mitterrand', weight: 4 },
    { kw: 'chirac', weight: 4 },
    { kw: 'pompidou', weight: 4 },
    { kw: 'sarkozy', weight: 4 },
    { kw: 'hollande', weight: 4 },
    { kw: 'macron', weight: 4 },
    { kw: 'pompidou', weight: 4 },
    { kw: 'mai 68', weight: 4 },
    { kw: 'communard', weight: 3 },
    { kw: 'commune de paris', weight: 4 },
    { kw: 'verdun', weight: 4 },
    { kw: 'armistice', weight: 4 },
    { kw: 'traite de versailles', weight: 4 },
    { kw: 'ancien regime', weight: 4 },
    { kw: 'siecle', weight: 2 },
    { kw: 'moyen age', weight: 4 },
    { kw: 'gaule', weight: 3 },
    { kw: 'gaulois', weight: 3 },
    { kw: 'romain', weight: 2 },
    { kw: 'feodalite', weight: 3 },
    { kw: 'croisade', weight: 3 },
    { kw: 'guerre de cent ans', weight: 4 },
    { kw: 'renaissance', weight: 3 },
    { kw: 'lumieres', weight: 3 },
    { kw: 'siecle des lumieres', weight: 4 },
    { kw: 'voltaire', weight: 3 },
    { kw: 'rousseau', weight: 3 },
    { kw: 'iiie reich', weight: 3 },
    { kw: 'restauration', weight: 3 },
    { kw: 'consulat', weight: 3 },
    { kw: 'directoire', weight: 3 },
    { kw: '1789', weight: 4 },
    { kw: '1799', weight: 3 },
    { kw: '1804', weight: 3 },
    { kw: '1815', weight: 3 },
    { kw: '1848', weight: 4 },
    { kw: '1870', weight: 4 },
    { kw: '1871', weight: 4 },
    { kw: '1905', weight: 3 },
    { kw: '1914', weight: 4 },
    { kw: '1918', weight: 4 },
    { kw: '1936', weight: 3 },
    { kw: '1939', weight: 4 },
    { kw: '1940', weight: 4 },
    { kw: '1944', weight: 4 },
    { kw: '1945', weight: 4 },
    { kw: '1946', weight: 3 },
    { kw: '1958', weight: 4 },
    { kw: 'front populaire', weight: 4 },
    { kw: 'abolition de la peine de mort', weight: 4 },
    { kw: 'droit de vote des femmes', weight: 4 },
    { kw: 'simone veil', weight: 4 },
    { kw: 'olympe de gouges', weight: 3 },
    { kw: 'marie curie', weight: 3 },
    { kw: 'jean moulin', weight: 4 },
    { kw: 'badinter', weight: 3 },
    { kw: 'pasteur', weight: 3 },
    { kw: 'colbert', weight: 3 },
    { kw: 'richelieu', weight: 3 },
    { kw: 'jules ferry', weight: 4 },
    { kw: 'leon blum', weight: 4 },
    { kw: 'clemenceau', weight: 3 },
  ],
  geographie: [
    { kw: 'capitale', weight: 4 },
    { kw: 'region', weight: 3 },
    { kw: 'departement', weight: 3 },
    { kw: 'fleuve', weight: 4 },
    { kw: 'riviere', weight: 3 },
    { kw: 'rhone', weight: 3 },
    { kw: 'seine', weight: 3 },
    { kw: 'loire', weight: 3 },
    { kw: 'garonne', weight: 3 },
    { kw: 'rhin', weight: 3 },
    { kw: 'montagne', weight: 4 },
    { kw: 'alpes', weight: 3 },
    { kw: 'pyrenees', weight: 3 },
    { kw: 'massif central', weight: 3 },
    { kw: 'vosges', weight: 3 },
    { kw: 'jura', weight: 3 },
    { kw: 'mer', weight: 3 },
    { kw: 'mediterranee', weight: 3 },
    { kw: 'manche', weight: 3 },
    { kw: 'atlantique', weight: 3 },
    { kw: 'ocean', weight: 3 },
    { kw: 'outre-mer', weight: 4 },
    { kw: 'outre mer', weight: 4 },
    { kw: 'guadeloupe', weight: 3 },
    { kw: 'martinique', weight: 3 },
    { kw: 'guyane', weight: 3 },
    { kw: 'reunion', weight: 3 },
    { kw: 'mayotte', weight: 3 },
    { kw: 'corse', weight: 3 },
    { kw: 'frontiere', weight: 3 },
    { kw: 'pays frontalier', weight: 3 },
    { kw: 'pays voisin', weight: 3 },
    { kw: 'metropolitain', weight: 3 },
    { kw: 'metropolitaine', weight: 3 },
    { kw: 'territoire', weight: 2 },
    { kw: 'paysage', weight: 3 },
    { kw: 'climat', weight: 3 },
    { kw: 'cote', weight: 2 },
    { kw: 'plage', weight: 2 },
    { kw: 'plus grande ville', weight: 4 },
    { kw: 'population', weight: 2 },
    { kw: 'habitant', weight: 2 },
    { kw: 'demograph', weight: 2 },
    { kw: 'superficie', weight: 3 },
    { kw: 'km2', weight: 3 },
    { kw: 'km²', weight: 3 },
    { kw: 'climat', weight: 3 },
  ],
  patrimoine: [
    { kw: 'tour eiffel', weight: 4 },
    { kw: 'louvre', weight: 4 },
    { kw: 'versailles', weight: 4 },
    { kw: 'notre-dame', weight: 4 },
    { kw: 'arc de triomphe', weight: 4 },
    { kw: 'pantheon', weight: 4 },
    { kw: 'mont saint-michel', weight: 4 },
    { kw: 'monument', weight: 3 },
    { kw: 'chateau', weight: 3 },
    { kw: 'musee', weight: 3 },
    { kw: 'cathedrale', weight: 3 },
    { kw: 'basilique', weight: 3 },
    { kw: 'moliere', weight: 4 },
    { kw: 'victor hugo', weight: 4 },
    { kw: 'hugo', weight: 3 },
    { kw: 'monet', weight: 4 },
    { kw: 'cezanne', weight: 4 },
    { kw: 'renoir', weight: 4 },
    { kw: 'matisse', weight: 4 },
    { kw: 'picasso', weight: 3 },
    { kw: 'baudelaire', weight: 4 },
    { kw: 'rimbaud', weight: 4 },
    { kw: 'verlaine', weight: 3 },
    { kw: 'la fontaine', weight: 4 },
    { kw: 'corneille', weight: 4 },
    { kw: 'racine', weight: 4 },
    { kw: 'balzac', weight: 4 },
    { kw: 'flaubert', weight: 4 },
    { kw: 'zola', weight: 4 },
    { kw: 'proust', weight: 4 },
    { kw: 'camus', weight: 4 },
    { kw: 'sartre', weight: 4 },
    { kw: 'duras', weight: 4 },
    { kw: 'simone de beauvoir', weight: 4 },
    { kw: 'debussy', weight: 4 },
    { kw: 'ravel', weight: 4 },
    { kw: 'piaf', weight: 4 },
    { kw: 'gainsbourg', weight: 4 },
    { kw: 'brassens', weight: 4 },
    { kw: 'litterature', weight: 3 },
    { kw: 'peinture', weight: 3 },
    { kw: 'peintre', weight: 3 },
    { kw: 'sculpture', weight: 3 },
    { kw: 'sculpteur', weight: 3 },
    { kw: 'cinema', weight: 3 },
    { kw: 'film', weight: 2 },
    { kw: 'realisateur', weight: 2 },
    { kw: 'cannes', weight: 3 },
    { kw: 'festival', weight: 2 },
    { kw: 'gastronomie', weight: 3 },
    { kw: 'cuisine francaise', weight: 3 },
    { kw: 'fromage', weight: 3 },
    { kw: 'baguette', weight: 3 },
    { kw: 'croissant', weight: 3 },
    { kw: 'patrimoine', weight: 4 },
    { kw: 'unesco', weight: 4 },
    { kw: 'patrimoine mondial', weight: 4 },
    { kw: 'litteraire', weight: 3 },
    { kw: 'tradition', weight: 2 },
    { kw: 'culture', weight: 2 },
    { kw: 'culturel', weight: 2 },
    { kw: 'musical', weight: 3 },
    { kw: 'roman', weight: 2 },
    { kw: 'poesie', weight: 3 },
    { kw: 'poete', weight: 3 },
    { kw: 'philosophe', weight: 3 },
    { kw: 'sacre-coeur', weight: 4 },
    { kw: 'arc-en-ciel', weight: 1 },
    { kw: 'rodin', weight: 4 },
    { kw: 'delacroix', weight: 4 },
    { kw: 'manet', weight: 4 },
    { kw: 'georges sand', weight: 3 },
    { kw: 'george sand', weight: 4 },
    { kw: 'dumas', weight: 4 },
    { kw: 'rousseau', weight: 2 },
    { kw: 'rabelais', weight: 4 },
    { kw: 'olympiques', weight: 3 },
    { kw: 'jeux olympiques', weight: 3 },
    { kw: 'sport', weight: 2 },
    { kw: 'tour de france', weight: 3 },
    { kw: 'roland-garros', weight: 4 },
    { kw: 'champagne', weight: 3 },
    { kw: 'bordeaux', weight: 2 },
    { kw: 'cuisine', weight: 2 },
  ],
};

const KW_THEME5 = {
  installation: [
    { kw: 'titre de sejour', weight: 5 },
    { kw: 'carte de sejour', weight: 5 },
    { kw: 'carte de resident', weight: 5 },
    { kw: 'sejour', weight: 3 },
    { kw: 'visa', weight: 4 },
    { kw: 'ofpra', weight: 4 },
    { kw: 'ofii', weight: 4 },
    { kw: 'prefecture', weight: 4 },
    { kw: 'asile', weight: 4 },
    { kw: 'refugie', weight: 4 },
    { kw: 'naturalisation', weight: 4 },
    { kw: 'demande de nationalite', weight: 4 },
    { kw: 'integration', weight: 3 },
    { kw: 'mairie', weight: 3 },
    { kw: 'etat civil', weight: 5 },
    { kw: 'etat-civil', weight: 5 },
    { kw: 'mariage', weight: 4 },
    { kw: 'marier', weight: 3 },
    { kw: 'pacs', weight: 5 },
    { kw: 'divorce', weight: 4 },
    { kw: 'famille', weight: 3 },
    { kw: 'enfant', weight: 2 },
    { kw: 'parentalite', weight: 3 },
    { kw: 'naissance', weight: 4 },
    { kw: 'acte de naissance', weight: 5 },
    { kw: 'livret de famille', weight: 5 },
    { kw: 'logement', weight: 3 },
    { kw: 'allocation logement', weight: 3 },
    { kw: 'apl', weight: 3 },
    { kw: 'caf', weight: 3 },
    { kw: 'rsa', weight: 3 },
    { kw: 'permis de conduire', weight: 4 },
    { kw: 'carte d\'identite', weight: 4 },
    { kw: 'passeport', weight: 4 },
    { kw: 'carte vitale', weight: 2 }, // could overlap with soins; prefer soins
    { kw: 'regroupement familial', weight: 5 },
    { kw: 'sans-papier', weight: 4 },
    { kw: 'cni', weight: 4 },
    { kw: 'demande de logement', weight: 4 },
    { kw: 'allocation familiale', weight: 4 },
    { kw: 'aide sociale', weight: 3 },
    { kw: 'expulsion', weight: 3 },
    { kw: 'logement social', weight: 4 },
    { kw: 'hlm', weight: 4 },
    { kw: 'banque', weight: 2 },
    { kw: 'compte bancaire', weight: 3 },
    { kw: 'mairie', weight: 2 },
    { kw: 'recepisse', weight: 4 },
    { kw: 'titre d\'identite', weight: 4 },
  ],
  soins: [
    { kw: 'samu', weight: 5 },
    { kw: '15 (numero)', weight: 1 },
    { kw: 'medecin', weight: 4 },
    { kw: 'medecin traitant', weight: 5 },
    { kw: 'sante', weight: 4 },
    { kw: 'hopital', weight: 4 },
    { kw: 'urgences', weight: 4 },
    { kw: 'urgence', weight: 3 },
    { kw: 'carte vitale', weight: 5 },
    { kw: 'mutuelle', weight: 5 },
    { kw: 'complementaire sante', weight: 5 },
    { kw: 'css', weight: 3 },
    { kw: 'vaccin', weight: 4 },
    { kw: 'vaccination', weight: 4 },
    { kw: 'pharmacie', weight: 3 },
    { kw: 'pharmacien', weight: 3 },
    { kw: 'medicament', weight: 3 },
    { kw: 'maladie', weight: 4 },
    { kw: 'consultation', weight: 4 },
    { kw: 'remboursement', weight: 4 },
    { kw: 'secu', weight: 3 },
    { kw: 'securite sociale', weight: 5 },
    { kw: 'assurance maladie', weight: 5 },
    { kw: 'cpam', weight: 5 },
    { kw: 'ameli', weight: 5 },
    { kw: 'specialiste', weight: 3 },
    { kw: 'generaliste', weight: 4 },
    { kw: 'gynecologue', weight: 4 },
    { kw: 'dentiste', weight: 4 },
    { kw: 'kine', weight: 3 },
    { kw: 'arret de travail', weight: 3 },
    { kw: 'arret maladie', weight: 4 },
    { kw: 'don du sang', weight: 4 },
    { kw: 'pmi', weight: 4 },
    { kw: 'protection maternelle', weight: 4 },
    { kw: 'medicaux', weight: 3 },
    { kw: 'medicale', weight: 2 },
    { kw: 'pompiers', weight: 4 },
    { kw: 'soin', weight: 3 },
    { kw: 'patient', weight: 2 },
    { kw: 'examen medical', weight: 4 },
  ],
  travail: [
    { kw: 'smic', weight: 5 },
    { kw: 'salaire minimum', weight: 5 },
    { kw: 'salaire', weight: 4 },
    { kw: 'emploi', weight: 4 },
    { kw: 'travail', weight: 3 },
    { kw: 'travailler', weight: 3 },
    { kw: 'embauche', weight: 4 },
    { kw: 'embaucher', weight: 4 },
    { kw: 'cdi', weight: 5 },
    { kw: 'cdd', weight: 5 },
    { kw: 'contrat de travail', weight: 5 },
    { kw: 'france travail', weight: 5 },
    { kw: 'pole emploi', weight: 5 },
    { kw: 'chomage', weight: 4 },
    { kw: 'entreprise', weight: 4 },
    { kw: 'employeur', weight: 4 },
    { kw: 'employe', weight: 3 },
    { kw: 'salarie', weight: 4 },
    { kw: 'patron', weight: 3 },
    { kw: 'syndicat', weight: 4 },
    { kw: 'greve', weight: 4 },
    { kw: 'licenciement', weight: 4 },
    { kw: 'demission', weight: 4 },
    { kw: 'conge', weight: 3 },
    { kw: 'rupture conventionnelle', weight: 5 },
    { kw: 'heures supplementaires', weight: 4 },
    { kw: '35 heures', weight: 4 },
    { kw: '35h', weight: 4 },
    { kw: '39 heures', weight: 4 },
    { kw: '39h', weight: 4 },
    { kw: 'inspection du travail', weight: 5 },
    { kw: 'prud\'hommes', weight: 5 },
    { kw: 'prudhomme', weight: 5 },
    { kw: 'conseil de prud\'hommes', weight: 5 },
    { kw: 'urssaf', weight: 4 },
    { kw: 'auto-entrepreneur', weight: 5 },
    { kw: 'auto entrepreneur', weight: 5 },
    { kw: 'micro-entrepreneur', weight: 5 },
    { kw: 'retraite', weight: 4 },
    { kw: 'apprentissage', weight: 4 },
    { kw: 'apprenti', weight: 4 },
    { kw: 'stage', weight: 3 },
    { kw: 'stagiaire', weight: 4 },
    { kw: 'allocation chomage', weight: 5 },
    { kw: 'are', weight: 3 },
    { kw: 'profession', weight: 3 },
    { kw: 'metier', weight: 3 },
    { kw: 'fiche de paie', weight: 5 },
    { kw: 'bulletin de salaire', weight: 5 },
    { kw: 'cotisation', weight: 3 },
    { kw: 'fonction publique', weight: 3 },
    { kw: 'temps partiel', weight: 4 },
    { kw: 'temps plein', weight: 4 },
  ],
  education: [
    { kw: 'ecole', weight: 4 },
    { kw: 'collège', weight: 4 }, // french char
    { kw: 'college', weight: 4 },
    { kw: 'lycee', weight: 4 },
    { kw: 'baccalaureat', weight: 5 },
    { kw: 'bac', weight: 3, wholeWord: true },
    { kw: 'instruction', weight: 4 },
    { kw: 'enseignant', weight: 5 },
    { kw: 'enseignante', weight: 5 },
    { kw: 'professeur', weight: 4 },
    { kw: 'institutrice', weight: 4 },
    { kw: 'instituteur', weight: 4 },
    { kw: 'maitresse', weight: 3 },
    { kw: 'maitre d\'ecole', weight: 4 },
    { kw: 'education', weight: 4 },
    { kw: 'educative', weight: 3 },
    { kw: 'eleve', weight: 4 },
    { kw: 'eleves', weight: 4 },
    { kw: 'scolarite', weight: 5 },
    { kw: 'scolaire', weight: 3 },
    { kw: 'creche', weight: 4 },
    { kw: 'maternelle', weight: 4 },
    { kw: 'primaire', weight: 4 },
    { kw: 'secondaire', weight: 3 },
    { kw: 'universite', weight: 4 },
    { kw: 'etudiant', weight: 4 },
    { kw: 'etudiante', weight: 4 },
    { kw: 'cours', weight: 2 },
    { kw: 'classe', weight: 3 },
    { kw: 'cantine', weight: 3 },
    { kw: 'rectorat', weight: 4 },
    { kw: 'directeur d\'ecole', weight: 4 },
    { kw: 'cpe', weight: 3 },
    { kw: 'inscription scolaire', weight: 5 },
    { kw: 'parents d\'eleves', weight: 5 },
    { kw: 'parent d\'eleve', weight: 5 },
    { kw: 'absenteisme', weight: 4 },
    { kw: 'redoublement', weight: 4 },
    { kw: 'conseil de classe', weight: 4 },
    { kw: 'parcoursup', weight: 5 },
    { kw: 'apb', weight: 3 },
    { kw: 'orientation scolaire', weight: 4 },
    { kw: 'cap', weight: 3 },
    { kw: 'bep', weight: 3 },
    { kw: 'bts', weight: 3 },
    { kw: 'licence', weight: 3 },
    { kw: 'master', weight: 3 },
    { kw: 'doctorat', weight: 3 },
    { kw: 'devoirs scolaires', weight: 4 },
    { kw: 'formation', weight: 2 },
    { kw: 'apprentissage', weight: 1 },
    { kw: 'jules ferry', weight: 3 }, // historical figure for education
  ],
};

// ────────────────────────────────────────────────────────────────
// 3. Classification function
// ────────────────────────────────────────────────────────────────

const SUBTOPICS_BY_THEME = {
  1: ['devise', 'laicite', 'situation'],
  2: ['vote', 'organisation', 'union_europ'],
  3: ['droits_fond', 'obligations', 'situation'],
  4: ['periodes', 'geographie', 'patrimoine'],
  5: ['installation', 'soins', 'travail', 'education'],
};

function classify(q) {
  const { themeId, type, textFr } = q;
  // Themes 1 & 3: situational type forces 'situation'
  if ((themeId === 1 || themeId === 3) && type === 'situational') {
    return { subtopic: 'situation', ambiguous: false };
  }

  let kwMap;
  switch (themeId) {
    case 1:
      kwMap = { devise: KW_THEME1.devise, laicite: KW_THEME1.laicite };
      break;
    case 2:
      kwMap = KW_THEME2;
      break;
    case 3:
      kwMap = { droits_fond: KW_THEME3.droits_fond, obligations: KW_THEME3.obligations };
      break;
    case 4:
      kwMap = KW_THEME4;
      break;
    case 5:
      kwMap = KW_THEME5;
      break;
    default:
      return { subtopic: null, ambiguous: true };
  }

  const scores = scoreSubtopics(textFr, kwMap);
  const { winner, ambiguous } = pickWinner(scores);

  // Fallback per theme when no keywords match
  if (winner == null) {
    const fallback = {
      1: 'devise',
      2: 'organisation',
      3: 'droits_fond',
      4: 'periodes',
      5: 'installation',
    }[themeId];
    return { subtopic: fallback, ambiguous: true, scores };
  }

  return { subtopic: winner, ambiguous, scores };
}

// ────────────────────────────────────────────────────────────────
// 4. Main
// ────────────────────────────────────────────────────────────────

const files = [
  'questions_theme1.ts',
  'questions_theme2.ts',
  'questions_theme3.ts',
  'questions_theme4.ts',
  'questions_theme5.ts',
  'situations_theme1_2.ts',
  'situations_theme3.ts',
  'situations_theme4_5.ts',
];

const allQuestions = [];
for (const f of files) {
  const qs = parseQuestionFile(path.join(DB_DIR, f));
  for (const q of qs) {
    allQuestions.push({ ...q, _source: f });
  }
}

console.log(`Parsed ${allQuestions.length} questions from ${files.length} files`);

const assignments = [];
const byTheme = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
let ambiguousCount = 0;

for (const q of allQuestions) {
  const { subtopic, ambiguous, scores } = classify(q);
  assignments.push({
    text_fr: q.textFr,
    theme_id: q.themeId,
    subtopic,
    ...(ambiguous ? { ambiguous: true } : {}),
    type: q.type,
    _source: q._source,
  });
  if (ambiguous) ambiguousCount++;
  if (!byTheme[q.themeId][subtopic]) byTheme[q.themeId][subtopic] = 0;
  byTheme[q.themeId][subtopic]++;
}

// Validate sentinel: every theme must have all expected subtopics
const expected = {
  1: { devise: 3, laicite: 2, situation: 6 },
  2: { vote: 3, organisation: 2, union_europ: 1 },
  3: { droits_fond: 2, obligations: 3, situation: 6 },
  4: { periodes: 3, geographie: 3, patrimoine: 2 },
  5: { installation: 1, soins: 1, travail: 1, education: 1 },
};
const validationFailures = [];
for (const [t, mins] of Object.entries(expected)) {
  for (const [st, m] of Object.entries(mins)) {
    const got = (byTheme[t][st] || 0);
    if (got < m) {
      validationFailures.push(`Theme ${t} / ${st}: ${got} < required ${m}`);
    }
  }
}

const out = {
  generated_at: '2026-05-14',
  method: 'heuristic keyword scoring + situational type force',
  count: allQuestions.length,
  by_theme: byTheme,
  ambiguous_count: ambiguousCount,
  validation_failures: validationFailures,
  assignments: assignments.map((a) => ({
    text_fr: a.text_fr,
    theme_id: a.theme_id,
    subtopic: a.subtopic,
    ...(a.ambiguous ? { ambiguous: true } : {}),
  })),
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8');

console.log('');
console.log('Distribution by (theme, subtopic):');
for (const t of [1, 2, 3, 4, 5]) {
  console.log(`  Theme ${t}:`);
  for (const st of SUBTOPICS_BY_THEME[t]) {
    const n = byTheme[t][st] || 0;
    const min = expected[t][st] || 0;
    const ok = n >= min ? 'OK' : 'FAIL';
    console.log(`    ${st.padEnd(14)} ${String(n).padStart(4)}  (min ${min}) ${ok}`);
  }
}
console.log('');
console.log(`Ambiguous (low confidence): ${ambiguousCount}`);
console.log(`Validation failures: ${validationFailures.length}`);
if (validationFailures.length) console.log(validationFailures.join('\n'));

// ─── Sample 2 questions per (theme, subtopic) for manual validation
console.log('');
console.log('=== Sample (2 per subtopic) ===');
for (const t of [1, 2, 3, 4, 5]) {
  for (const st of SUBTOPICS_BY_THEME[t]) {
    const ex = assignments.filter((a) => a.theme_id === t && a.subtopic === st).slice(0, 2);
    console.log(`-- Theme ${t} / ${st} --`);
    for (const e of ex) {
      console.log(`   • ${e.text_fr.slice(0, 110)}${e.text_fr.length > 110 ? '…' : ''}`);
    }
  }
}

console.log('');
console.log(`Wrote → ${OUT_PATH}`);
