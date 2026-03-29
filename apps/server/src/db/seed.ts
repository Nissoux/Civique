import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { THEMES } from '@civique/shared';
import * as schema from './schema.js';
import { questionsTheme1 } from './questions_theme1.js';
import { questionsTheme2 } from './questions_theme2.js';
import { questionsTheme3 } from './questions_theme3.js';
import { questionsTheme4 } from './questions_theme4.js';
import { questionsTheme5 } from './questions_theme5.js';
import { situationsTheme1, situationsTheme2 } from './situations_theme1_2.js';
import { situationsTheme3 } from './situations_theme3.js';
import { situationsTheme4, situationsTheme5 } from './situations_theme4_5.js';
// Translation imports
import { theme1Ar } from './translations/theme1_ar.js';
import { theme1Es } from './translations/theme1_es.js';
import { theme1Fa } from './translations/theme1_fa.js';
import { theme1Hi } from './translations/theme1_hi.js';
import { theme1Pt } from './translations/theme1_pt.js';
import { theme2Ar } from './translations/theme2_ar.js';
import { theme2Es } from './translations/theme2_es.js';
import { theme2Fa } from './translations/theme2_fa.js';
import { theme2Hi } from './translations/theme2_hi.js';
import { theme2Pt } from './translations/theme2_pt.js';
import { theme3Ar } from './translations/theme3_ar.js';
import { theme3Es } from './translations/theme3_es.js';
import { theme3Fa } from './translations/theme3_fa.js';
import { theme3Hi } from './translations/theme3_hi.js';
import { theme3Pt } from './translations/theme3_pt.js';
import { theme4Ar } from './translations/theme4_ar.js';
import { theme4Es } from './translations/theme4_es.js';
import { theme4Fa } from './translations/theme4_fa.js';
import { theme4Hi } from './translations/theme4_hi.js';
import { theme4Pt } from './translations/theme4_pt.js';
import { theme5Ar } from './translations/theme5_ar.js';
import { theme5Es } from './translations/theme5_es.js';
import { theme5Fa } from './translations/theme5_fa.js';
import { theme5Hi } from './translations/theme5_hi.js';
import { theme5Pt } from './translations/theme5_pt.js';
// Situational question translation imports
import { sitTheme12Ar, sitTheme12Es } from './translations/situations_theme1_2_ar_es.js';
import { sitTheme12Fa, sitTheme12Hi, sitTheme12Pt } from './translations/situations_theme1_2_fa_hi_pt.js';
import { sitTheme3Ar, sitTheme3Es, sitTheme3Fa, sitTheme3Hi, sitTheme3Pt } from './translations/situations_theme3_all.js';
import { sitTheme4Ar, sitTheme4Es, sitTheme4Fa, sitTheme4Hi, sitTheme4Pt, sitTheme5Ar, sitTheme5Es, sitTheme5Fa, sitTheme5Hi, sitTheme5Pt } from './translations/situations_theme4_5_all.js';
// Fiche translation imports
import { fichesAr } from './translations/fiches_ar.js';
import { fichesEs } from './translations/fiches_es.js';
import { fichesFa } from './translations/fiches_fa.js';
import { fichesHi } from './translations/fiches_hi.js';
import { fichesPt } from './translations/fiches_pt.js';

// Combine all translations into a lookup map by French question text
type TranslationEntry = {
  textFr: string;
  lang: 'ar' | 'es' | 'fa' | 'hi' | 'pt';
  text: string;
  explanation: string;
  choices: { id: 'a' | 'b' | 'c' | 'd'; text: string }[];
};

const allTranslations: TranslationEntry[] = [
  ...theme1Ar, ...theme1Es, ...theme1Fa, ...theme1Hi, ...theme1Pt,
  ...theme2Ar, ...theme2Es, ...theme2Fa, ...theme2Hi, ...theme2Pt,
  ...theme3Ar, ...theme3Es, ...theme3Fa, ...theme3Hi, ...theme3Pt,
  ...theme4Ar, ...theme4Es, ...theme4Fa, ...theme4Hi, ...theme4Pt,
  ...theme5Ar, ...theme5Es, ...theme5Fa, ...theme5Hi, ...theme5Pt,
] as TranslationEntry[];

type FicheTranslationEntry = {
  themeId: number;
  lang: 'ar' | 'es' | 'fa' | 'hi' | 'pt';
  title: string;
  content: string;
};

const allFicheTranslations: FicheTranslationEntry[] = [
  ...fichesAr, ...fichesEs, ...fichesFa, ...fichesHi, ...fichesPt,
] as FicheTranslationEntry[];

// Build lookup: themeId -> fiche translations[]
const ficheTranslationsByTheme = new Map<number, FicheTranslationEntry[]>();
for (const ft of allFicheTranslations) {
  if (!ficheTranslationsByTheme.has(ft.themeId)) {
    ficheTranslationsByTheme.set(ft.themeId, []);
  }
  ficheTranslationsByTheme.get(ft.themeId)!.push(ft);
}

// Build lookup: textFr -> translations[]
const translationsByQuestion = new Map<string, TranslationEntry[]>();
for (const t of allTranslations) {
  const key = t.textFr;
  if (!translationsByQuestion.has(key)) {
    translationsByQuestion.set(key, []);
  }
  translationsByQuestion.get(key)!.push(t);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// ────────────────────────────────────────────────────────────────
// Themes
// ────────────────────────────────────────────────────────────────

const themesData = THEMES.map((t, i) => ({
  id: t.id,
  code: t.code,
  nameFr: t.nameFr,
  icon: t.icon,
  color: t.color,
  displayOrder: i + 1,
}));

// ────────────────────────────────────────────────────────────────
// Questions - 10+ per theme = 50+ total
// ────────────────────────────────────────────────────────────────

interface QuestionSeed {
  themeId: number;
  type: 'knowledge' | 'situational';
  difficulty: number;
  isPremium: boolean;
  examTypes: ('csp' | 'cr' | 'nat')[];
  textFr: string;
  explanationFr: string;
  choicesFr: { id: 'a' | 'b' | 'c' | 'd'; text: string }[];
  correctChoice: 'a' | 'b' | 'c' | 'd';
  translations?: {
    lang: 'ar' | 'es' | 'fa' | 'hi' | 'pt';
    text: string;
    explanation: string;
    choices: { id: 'a' | 'b' | 'c' | 'd'; text: string }[];
  }[];
}

type SitTranslation = { text: string; explanation: string; choices: { id: 'a' | 'b' | 'c' | 'd'; text: string }[] };

function attachSitTranslations(
  questions: QuestionSeed[],
  translations: Record<string, SitTranslation[]>
): QuestionSeed[] {
  return questions.map((q, idx) => {
    const qTranslations: QuestionSeed['translations'] = [];
    for (const [lang, arr] of Object.entries(translations)) {
      if (arr[idx]) {
        qTranslations.push({
          lang: lang as 'ar' | 'es' | 'fa' | 'hi' | 'pt',
          text: arr[idx].text,
          explanation: arr[idx].explanation,
          choices: arr[idx].choices,
        });
      }
    }
    return { ...q, translations: qTranslations };
  });
}

const questionsData: QuestionSeed[] = [
  ...(questionsTheme1 as unknown as QuestionSeed[]),
  ...(questionsTheme2 as unknown as QuestionSeed[]),
  ...(questionsTheme3 as unknown as QuestionSeed[]),
  ...(questionsTheme4 as unknown as QuestionSeed[]),
  ...(questionsTheme5 as unknown as QuestionSeed[]),
  // Mises en situation with translations
  ...attachSitTranslations(
    [...situationsTheme1, ...situationsTheme2] as unknown as QuestionSeed[],
    { ar: sitTheme12Ar, es: sitTheme12Es, fa: sitTheme12Fa, hi: sitTheme12Hi, pt: sitTheme12Pt }
  ),
  ...attachSitTranslations(
    situationsTheme3 as unknown as QuestionSeed[],
    { ar: sitTheme3Ar, es: sitTheme3Es, fa: sitTheme3Fa, hi: sitTheme3Hi, pt: sitTheme3Pt }
  ),
  ...attachSitTranslations(
    situationsTheme4 as unknown as QuestionSeed[],
    { ar: sitTheme4Ar, es: sitTheme4Es, fa: sitTheme4Fa, hi: sitTheme4Hi, pt: sitTheme4Pt }
  ),
  ...attachSitTranslations(
    situationsTheme5 as unknown as QuestionSeed[],
    { ar: sitTheme5Ar, es: sitTheme5Es, fa: sitTheme5Fa, hi: sitTheme5Hi, pt: sitTheme5Pt }
  ),
];



// ────────────────────────────────────────────────────────────────
// Fiches - 1 per theme
// ────────────────────────────────────────────────────────────────

const fichesData = [
  {
    themeId: 1,
    titleFr: 'Les principes et valeurs de la R\u00e9publique fran\u00e7aise',
    contentFr: `# Les principes et valeurs de la R\u00e9publique fran\u00e7aise

## La devise : Libert\u00e9, \u00c9galit\u00e9, Fraternit\u00e9

La devise de la R\u00e9publique fran\u00e7aise est inscrite dans la Constitution. Elle r\u00e9sume les valeurs fondamentales de la nation.

- **Libert\u00e9** : chaque citoyen est libre de ses opinions, de sa religion, de ses d\u00e9placements.
- **\u00c9galit\u00e9** : tous les citoyens sont \u00e9gaux devant la loi, sans distinction d'origine, de race ou de religion.
- **Fraternit\u00e9** : les citoyens doivent faire preuve de solidarit\u00e9 les uns envers les autres.

## La la\u00efcit\u00e9

La loi du 9 d\u00e9cembre 1905 a instaur\u00e9 la s\u00e9paration des \u00c9glises et de l'\u00c9tat. La la\u00efcit\u00e9 garantit la libert\u00e9 de conscience : chacun est libre de croire ou de ne pas croire. L'\u00c9tat ne privil\u00e9gie aucune religion.

## Les symboles de la R\u00e9publique

- Le **drapeau tricolore** (bleu, blanc, rouge)
- L'**hymne national** : la Marseillaise
- **Marianne** : figure f\u00e9minine qui repr\u00e9sente la R\u00e9publique
- La **devise** : Libert\u00e9, \u00c9galit\u00e9, Fraternit\u00e9

## La d\u00e9mocratie

La France est une r\u00e9publique d\u00e9mocratique. Le pouvoir appartient au peuple, qui l'exerce par le vote. Le suffrage est universel : tout citoyen majeur peut voter.`,
    displayOrder: 1,
    isPremium: false,
  },
  {
    themeId: 2,
    titleFr: 'Le syst\u00e8me institutionnel et politique fran\u00e7ais',
    contentFr: `# Le syst\u00e8me institutionnel et politique fran\u00e7ais

## La Constitution de 1958

La Ve R\u00e9publique a \u00e9t\u00e9 fond\u00e9e par la Constitution du 4 octobre 1958. Elle organise les pouvoirs de l'\u00c9tat.

## Le Pr\u00e9sident de la R\u00e9publique

- Chef de l'\u00c9tat, \u00e9lu au suffrage universel direct pour 5 ans (quinquennat)
- Nomme le Premier ministre
- Peut dissoudre l'Assembl\u00e9e nationale
- Chef des arm\u00e9es

## Le Gouvernement

- Dirig\u00e9 par le Premier ministre
- Conduit la politique de la nation
- Responsable devant l'Assembl\u00e9e nationale

## Le Parlement

Le Parlement vote les lois. Il est compos\u00e9 de deux assembl\u00e9es :
- L'**Assembl\u00e9e nationale** : 577 d\u00e9put\u00e9s \u00e9lus au suffrage universel direct pour 5 ans
- Le **S\u00e9nat** : 348 s\u00e9nateurs \u00e9lus au suffrage universel indirect pour 6 ans

## Les collectivit\u00e9s territoriales

- **Communes** : plus de 35 000, dirig\u00e9es par un maire et un conseil municipal
- **D\u00e9partements** : 101 (96 m\u00e9tropolitains + 5 d'outre-mer)
- **R\u00e9gions** : 18 (13 m\u00e9tropolitaines + 5 d'outre-mer)`,
    displayOrder: 1,
    isPremium: false,
  },
  {
    themeId: 3,
    titleFr: 'Les droits et devoirs du citoyen',
    contentFr: `# Les droits et devoirs du citoyen

## Les droits fondamentaux

La D\u00e9claration des Droits de l'Homme et du Citoyen (1789) et la Constitution garantissent :

- **Libert\u00e9 d'expression** : chacun peut exprimer ses opinions (dans le respect de la loi)
- **Libert\u00e9 de conscience et de religion** : chacun est libre de ses croyances
- **Droit de vote** : tout citoyen majeur (18 ans) peut voter
- **\u00c9galit\u00e9 devant la loi** : sans distinction d'origine, de sexe ou de religion
- **Droit \u00e0 l'\u00e9ducation** : l'instruction est obligatoire de 3 \u00e0 16 ans
- **Droit d'asile** : protection des personnes pers\u00e9cut\u00e9es
- **Pr\u00e9somption d'innocence** : toute personne est innocente jusqu'\u00e0 preuve du contraire

## Les devoirs

- **Respecter les lois** de la R\u00e9publique
- **Payer les imp\u00f4ts** : ils financent les services publics
- **Participer \u00e0 la d\u00e9fense nationale** : Journ\u00e9e d\u00e9fense et citoyennet\u00e9 (JDC)
- **Voter** : c'est un devoir moral (pas juridiquement obligatoire)
- **Respecter les droits d'autrui**
- **Scolariser ses enfants**

## L'\u00e9galit\u00e9 femmes-hommes

L'\u00e9galit\u00e9 entre les femmes et les hommes est un principe constitutionnel. Les femmes ont obtenu le droit de vote en 1944.`,
    displayOrder: 1,
    isPremium: false,
  },
  {
    themeId: 4,
    titleFr: 'Histoire, g\u00e9ographie et culture de la France',
    contentFr: `# Histoire, g\u00e9ographie et culture de la France

## Grandes dates de l'histoire

- **1789** : R\u00e9volution fran\u00e7aise, prise de la Bastille (14 juillet), D\u00e9claration des Droits de l'Homme et du Citoyen
- **1848** : Abolition d\u00e9finitive de l'esclavage (Victor Sch\u0153lcher)
- **1905** : Loi de s\u00e9paration des \u00c9glises et de l'\u00c9tat
- **1944** : Droit de vote des femmes
- **1945** : Fin de la Seconde Guerre mondiale (8 mai)
- **1958** : Fondation de la Ve R\u00e9publique (Constitution du 4 octobre)

## Les jours f\u00e9ri\u00e9s et comm\u00e9morations

- **14 juillet** : F\u00eate nationale (prise de la Bastille)
- **11 novembre** : Armistice de 1918 (fin de la Premi\u00e8re Guerre mondiale)
- **8 mai** : Victoire de 1945 (fin de la Seconde Guerre mondiale en Europe)

## G\u00e9ographie

- **Capitale** : Paris
- **Population** : environ 68 millions d'habitants
- **13 r\u00e9gions m\u00e9tropolitaines** et 5 r\u00e9gions d'outre-mer
- La France est le plus grand pays de l'Union europ\u00e9enne par sa superficie

## Les Lumi\u00e8res

Mouvement intellectuel du XVIIIe si\u00e8cle portant les id\u00e9es de raison, libert\u00e9 et progr\u00e8s. Figures principales : Voltaire, Rousseau, Montesquieu, Diderot.`,
    displayOrder: 1,
    isPremium: false,
  },
  {
    themeId: 5,
    titleFr: 'Vivre dans la soci\u00e9t\u00e9 fran\u00e7aise',
    contentFr: `# Vivre dans la soci\u00e9t\u00e9 fran\u00e7aise

## D\u00e9marches administratives

- **Naissance** : d\u00e9claration \u00e0 la mairie dans les 5 jours
- **Titre de s\u00e9jour** : demande \u00e0 la pr\u00e9fecture
- **Inscription \u00e9lectorale** : \u00e0 la mairie ou en ligne
- **Carte Vitale** : carte d'assurance maladie d\u00e9livr\u00e9e par la S\u00e9curit\u00e9 sociale

## Les num\u00e9ros d'urgence

- **15** : SAMU (urgences m\u00e9dicales)
- **17** : Police / Gendarmerie
- **18** : Pompiers
- **112** : Num\u00e9ro d'urgence europ\u00e9en (fonctionne dans toute l'UE)

## La protection sociale

La S\u00e9curit\u00e9 sociale est le syst\u00e8me de protection sociale fran\u00e7ais. Elle couvre :
- Maladie et maternit\u00e9
- Retraite
- Allocations familiales (CAF)
- Accidents du travail

## L'emploi

- **France Travail** (ex-P\u00f4le emploi) : aide \u00e0 la recherche d'emploi et indemnisation ch\u00f4mage
- Le SMIC (salaire minimum) garantit un revenu minimum \u00e0 tout travailleur
- Le contrat de travail (CDI, CDD) d\u00e9finit les droits et obligations

## Le contrat d'int\u00e9gration r\u00e9publicaine (CIR)

Les \u00e9trangers primo-arrivants signent le CIR qui comprend :
- Une formation civique sur les valeurs de la R\u00e9publique
- Une formation linguistique en fran\u00e7ais (si n\u00e9cessaire)
- Un accompagnement vers l'emploi et le logement`,
    displayOrder: 1,
    isPremium: false,
  },
];

// ────────────────────────────────────────────────────────────────
// Main seed function
// ────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Seeding database...');

  // 1. Insert themes (upsert by id)
  console.log('Inserting themes...');
  for (const t of themesData) {
    await db
      .insert(schema.themes)
      .values(t)
      .onConflictDoUpdate({
        target: schema.themes.code,
        set: {
          nameFr: t.nameFr,
          icon: t.icon,
          color: t.color,
          displayOrder: t.displayOrder,
        },
      });
  }
  console.log(`  ${themesData.length} themes inserted.`);

  // 2. Insert questions
  console.log('Inserting questions...');
  let questionCount = 0;
  let translationCount = 0;

  for (const q of questionsData) {
    const [inserted] = await db
      .insert(schema.questions)
      .values({
        themeId: q.themeId,
        type: q.type,
        difficulty: q.difficulty,
        isPremium: q.isPremium,
        examTypes: q.examTypes,
        textFr: q.textFr,
        explanationFr: q.explanationFr,
        choicesFr: q.choicesFr,
        correctChoice: q.correctChoice,
      })
      .onConflictDoUpdate({
        target: schema.questions.textFr,
        set: {
          themeId: q.themeId,
          type: q.type,
          difficulty: q.difficulty,
          isPremium: q.isPremium,
          examTypes: q.examTypes,
          explanationFr: q.explanationFr,
          choicesFr: q.choicesFr,
          correctChoice: q.correctChoice,
        },
      })
      .returning({ id: schema.questions.id });

    questionCount++;

    // Insert translations: from external files (matched by textFr) + inline translations
    const translations = [
      ...(translationsByQuestion.get(q.textFr) || []),
      ...(q.translations || []).map((t) => ({ ...t, textFr: q.textFr })),
    ];
    for (const tr of translations) {
      await db
        .insert(schema.questionTranslations)
        .values({
          questionId: inserted.id,
          lang: tr.lang,
          text: tr.text,
          explanation: tr.explanation,
          choices: tr.choices,
        })
        .onConflictDoNothing();
      translationCount++;
    }
  }
  console.log(`  ${questionCount} questions inserted.`);
  console.log(`  ${translationCount} question translations inserted.`);

  // 3. Insert fiches (upsert by themeId + displayOrder)
  console.log('Inserting fiches...');
  let ficheTranslationCount = 0;

  for (const f of fichesData) {
    const [insertedFiche] = await db
      .insert(schema.fiches)
      .values({
        themeId: f.themeId,
        titleFr: f.titleFr,
        contentFr: f.contentFr,
        displayOrder: f.displayOrder,
        isPremium: f.isPremium,
      })
      .onConflictDoUpdate({
        target: [schema.fiches.themeId, schema.fiches.displayOrder],
        set: {
          titleFr: f.titleFr,
          contentFr: f.contentFr,
          isPremium: f.isPremium,
        },
      })
      .returning({ id: schema.fiches.id });

    // Insert fiche translations
    const ficheTranslations = ficheTranslationsByTheme.get(f.themeId) || [];
    for (const ft of ficheTranslations) {
      await db
        .insert(schema.ficheTranslations)
        .values({
          ficheId: insertedFiche.id,
          lang: ft.lang,
          title: ft.title,
          content: ft.content,
        })
        .onConflictDoNothing();
      ficheTranslationCount++;
    }
  }
  console.log(`  ${fichesData.length} fiches inserted.`);
  console.log(`  ${ficheTranslationCount} fiche translations inserted.`);

  console.log('Seeding complete!');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
