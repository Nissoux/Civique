import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { questions, questionTranslations, themes } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const querySchema = z.object({
  themeId: z.coerce.number().optional(),
  type: z.enum(['knowledge', 'situational']).optional(),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  isPremium: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  lang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

const idParamSchema = z.object({
  id: z.coerce.number(),
});

const randomQuerySchema = z.object({
  themeId: z.coerce.number().optional(),
  type: z.enum(['knowledge', 'situational']).optional(),
  isPremium: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  lang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  perTheme: z.coerce.number().min(1).max(20).optional(),
});

// ── Helpers ────────────────────────────────────

type QuestionRow = typeof questions.$inferSelect & {
  translations?: (typeof questionTranslations.$inferSelect)[];
};

function flattenTranslation(question: QuestionRow, lang?: string) {
  const { translations, ...rest } = question;

  if (!lang || lang === 'fr' || !translations || translations.length === 0) {
    return {
      ...rest,
      translatedText: rest.textFr,
      translatedChoices: rest.choicesFr,
      translatedExplanation: rest.explanationFr,
    };
  }

  const t = translations[0];
  return {
    ...rest,
    translatedText: t.text,
    translatedChoices: t.choices,
    translatedExplanation: t.explanation,
  };
}

// ── Routes ─────────────────────────────────────

export default async function questionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  // ── GET / ────────────────────────────────────
  app.get('/', async (request) => {
    const query = querySchema.parse(request.query);
    const conditions = [];

    if (query.themeId) conditions.push(eq(questions.themeId, query.themeId));
    if (query.type) conditions.push(eq(questions.type, query.type));
    if (query.difficulty) conditions.push(eq(questions.difficulty, query.difficulty));
    if (query.isPremium !== undefined) conditions.push(eq(questions.isPremium, query.isPremium));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db.query.questions.findMany({
      where,
      limit: query.limit,
      offset: query.offset,
      with: {
        translations: query.lang && query.lang !== 'fr'
          ? { where: eq(questionTranslations.lang, query.lang) }
          : undefined,
      },
    });

    const data = results.map((q) => flattenTranslation(q as QuestionRow, query.lang));

    return { data, total: data.length };
  });

  // ── GET /random ──────────────────────────────
  // NOTE: must be registered before /:id to avoid route conflict
  app.get('/random', async (request) => {
    const query = randomQuerySchema.parse(request.query);
    const conditions = [];

    if (query.themeId) conditions.push(eq(questions.themeId, query.themeId));
    if (query.type) conditions.push(eq(questions.type, query.type));
    if (query.isPremium !== undefined) conditions.push(eq(questions.isPremium, query.isPremium));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // If perTheme is specified, distribute evenly across themes
    if (query.perTheme && !query.themeId) {
      const allThemes = await db.query.themes.findMany({
        columns: { id: true },
      });

      const perThemeQuestions: QuestionRow[] = [];

      for (const theme of allThemes) {
        const themeConditions = [...conditions, eq(questions.themeId, theme.id)];
        const themeWhere = and(...themeConditions);

        const themeResults = await db.query.questions.findMany({
          where: themeWhere,
          limit: query.perTheme,
          orderBy: sql`RANDOM()`,
          with: {
            translations: query.lang && query.lang !== 'fr'
              ? { where: eq(questionTranslations.lang, query.lang) }
              : undefined,
          },
        });

        perThemeQuestions.push(...(themeResults as QuestionRow[]));
      }

      // Shuffle the combined results
      for (let i = perThemeQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [perThemeQuestions[i], perThemeQuestions[j]] = [perThemeQuestions[j], perThemeQuestions[i]];
      }

      const limited = perThemeQuestions.slice(0, query.limit);
      const data = limited.map((q) => flattenTranslation(q, query.lang));
      return { data, total: data.length };
    }

    // Standard random
    const results = await db.query.questions.findMany({
      where,
      limit: query.limit,
      orderBy: sql`RANDOM()`,
      with: {
        translations: query.lang && query.lang !== 'fr'
          ? { where: eq(questionTranslations.lang, query.lang) }
          : undefined,
      },
    });

    const data = results.map((q) => flattenTranslation(q as QuestionRow, query.lang));
    return { data, total: data.length };
  });

  // ── GET /:id ─────────────────────────────────
  app.get('/:id', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const lang = (request.query as { lang?: string }).lang as
      | 'fr' | 'ar' | 'fa' | 'pt' | 'es' | 'hi'
      | undefined;

    const question = await db.query.questions.findFirst({
      where: eq(questions.id, id),
      with: {
        translations: lang && lang !== 'fr'
          ? { where: eq(questionTranslations.lang, lang) }
          : undefined,
      },
    });

    if (!question) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    const data = flattenTranslation(question as QuestionRow, lang);
    return { data };
  });
}
