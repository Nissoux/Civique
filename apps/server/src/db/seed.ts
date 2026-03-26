import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES } from '@civique/shared';
import * as schema from './schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool, { schema });

// Load exported data
function loadJson<T>(filename: string): T {
  const raw = readFileSync(join(__dirname, filename), 'utf-8');
  return JSON.parse(raw) as T;
}

interface QuestionData {
  id: number;
  themeId: number;
  type: 'knowledge' | 'situational';
  difficulty: number;
  isPremium: boolean;
  textFr: string;
  explanationFr: string;
  choicesFr: { id: 'a' | 'b' | 'c' | 'd'; text: string }[];
  correctChoice: 'a' | 'b' | 'c' | 'd';
}

interface TranslationData {
  qid: number;
  lang: 'ar' | 'fa' | 'pt' | 'es' | 'hi';
  text: string;
  explanation: string;
  choices: { id: 'a' | 'b' | 'c' | 'd'; text: string }[];
}

interface FicheData {
  id: number;
  themeId: number;
  titleFr: string;
  contentFr: string;
  displayOrder: number;
  isPremium: boolean;
}

// Theme translations (all 5 languages)
const themeTranslationsData = [
  { themeId: 1, lang: 'ar' as const, name: 'مبادئ وقيم الجمهورية' },
  { themeId: 1, lang: 'fa' as const, name: 'اصول و ارزش\u200cهای جمهوری' },
  { themeId: 1, lang: 'pt' as const, name: 'Princípios e valores da República' },
  { themeId: 1, lang: 'es' as const, name: 'Principios y valores de la República' },
  { themeId: 1, lang: 'hi' as const, name: 'गणतंत्र के सिद्धांत और मूल्य' },
  { themeId: 2, lang: 'ar' as const, name: 'النظام المؤسسي والسياسي' },
  { themeId: 2, lang: 'fa' as const, name: 'نظام نهادی و سیاسی' },
  { themeId: 2, lang: 'pt' as const, name: 'Sistema institucional e político' },
  { themeId: 2, lang: 'es' as const, name: 'Sistema institucional y político' },
  { themeId: 2, lang: 'hi' as const, name: 'संस्थागत और राजनीतिक प्रणाली' },
  { themeId: 3, lang: 'ar' as const, name: 'الحقوق والواجبات' },
  { themeId: 3, lang: 'fa' as const, name: 'حقوق و وظایف' },
  { themeId: 3, lang: 'pt' as const, name: 'Direitos e deveres' },
  { themeId: 3, lang: 'es' as const, name: 'Derechos y deberes' },
  { themeId: 3, lang: 'hi' as const, name: 'अधिकार और कर्तव्य' },
  { themeId: 4, lang: 'ar' as const, name: 'التاريخ والجغرافيا والثقافة' },
  { themeId: 4, lang: 'fa' as const, name: 'تاریخ، جغرافیا و فرهنگ' },
  { themeId: 4, lang: 'pt' as const, name: 'História, geografia e cultura' },
  { themeId: 4, lang: 'es' as const, name: 'Historia, geografía y cultura' },
  { themeId: 4, lang: 'hi' as const, name: 'इतिहास, भूगोल और संस्कृति' },
  { themeId: 5, lang: 'ar' as const, name: 'العيش في المجتمع الفرنسي' },
  { themeId: 5, lang: 'fa' as const, name: 'زندگی در جامعه فرانسه' },
  { themeId: 5, lang: 'pt' as const, name: 'Viver na sociedade francesa' },
  { themeId: 5, lang: 'es' as const, name: 'Vivir en la sociedad francesa' },
  { themeId: 5, lang: 'hi' as const, name: 'फ्रांसीसी समाज में रहना' },
];

async function seed() {
  console.log('Seeding database...');

  // 0. Clear existing data (reverse dependency order)
  console.log('Clearing existing data...');
  await db.delete(schema.challengeAnswers);
  await db.delete(schema.challenges);
  await db.delete(schema.comments);
  await db.delete(schema.friendships);
  await db.delete(schema.practiceAnswers);
  await db.delete(schema.examAnswers);
  await db.delete(schema.examSessions);
  await db.delete(schema.questionTranslations);
  await db.delete(schema.ficheTranslations);
  await db.delete(schema.themeTranslations);
  await db.delete(schema.fiches);
  await db.delete(schema.questions);
  await db.delete(schema.users);
  await db.delete(schema.themes);
  console.log('  Done.');

  // 1. Insert themes
  console.log('Inserting themes...');
  for (let i = 0; i < THEMES.length; i++) {
    const t = THEMES[i];
    await db.insert(schema.themes).values({
      id: t.id,
      code: t.code,
      nameFr: t.nameFr,
      icon: t.icon,
      color: t.color,
      displayOrder: i + 1,
    });
  }
  // Reset sequence
  await pool.query(`SELECT setval('themes_id_seq', (SELECT MAX(id) FROM themes))`);
  console.log(`  ${THEMES.length} themes.`);

  // 2. Insert theme translations
  console.log('Inserting theme translations...');
  for (const tt of themeTranslationsData) {
    await db.insert(schema.themeTranslations).values(tt);
  }
  console.log(`  ${themeTranslationsData.length} theme translations.`);

  // 3. Insert questions
  console.log('Inserting questions...');
  const questionsData = loadJson<QuestionData[]>('questions-export.json');
  const idMap = new Map<number, number>(); // old id -> new id

  for (const q of questionsData) {
    const [inserted] = await db.insert(schema.questions).values({
      themeId: q.themeId,
      type: q.type,
      difficulty: q.difficulty,
      isPremium: q.isPremium,
      textFr: q.textFr,
      explanationFr: q.explanationFr,
      choicesFr: q.choicesFr,
      correctChoice: q.correctChoice,
    }).returning({ id: schema.questions.id });
    idMap.set(q.id, inserted.id);
  }
  console.log(`  ${questionsData.length} questions.`);

  // 4. Insert question translations
  console.log('Inserting question translations...');
  const translationsData = loadJson<TranslationData[]>('translations-export.json');
  let trCount = 0;

  for (const tr of translationsData) {
    const newQid = idMap.get(tr.qid);
    if (!newQid) continue;

    await db.insert(schema.questionTranslations).values({
      questionId: newQid,
      lang: tr.lang,
      text: tr.text,
      explanation: tr.explanation,
      choices: tr.choices,
    });
    trCount++;
  }
  console.log(`  ${trCount} question translations.`);

  // 5. Insert fiches
  console.log('Inserting fiches...');
  const fichesData = loadJson<FicheData[]>('fiches-export.json');

  for (const f of fichesData) {
    await db.insert(schema.fiches).values({
      themeId: f.themeId,
      titleFr: f.titleFr,
      contentFr: f.contentFr,
      displayOrder: f.displayOrder,
      isPremium: f.isPremium,
    });
  }
  console.log(`  ${fichesData.length} fiches.`);

  console.log('\nSeeding complete!');
  console.log(`  Themes: ${THEMES.length}`);
  console.log(`  Theme translations: ${themeTranslationsData.length}`);
  console.log(`  Questions: ${questionsData.length}`);
  console.log(`  Question translations: ${trCount}`);
  console.log(`  Fiches: ${fichesData.length}`);
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
