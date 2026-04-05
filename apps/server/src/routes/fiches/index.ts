import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, asc } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { fiches, ficheTranslations } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const querySchema = z.object({
  themeId: z.coerce.number().optional(),
  isPremium: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  lang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

const idParamSchema = z.object({
  id: z.coerce.number(),
});

// ── Helpers ────────────────────────────────────

type FicheRow = typeof fiches.$inferSelect & {
  translations?: (typeof ficheTranslations.$inferSelect)[];
};

function flattenTranslation(fiche: FicheRow, lang?: string) {
  const { translations, ...rest } = fiche;

  if (!lang || lang === 'fr' || !translations || translations.length === 0) {
    return {
      ...rest,
      translatedTitle: rest.titleFr,
      translatedContent: rest.contentFr,
    };
  }

  const t = translations[0];
  return {
    ...rest,
    translatedTitle: t.title,
    translatedContent: t.content,
  };
}

// ── Routes ─────────────────────────────────────

export default async function ficheRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  // ── GET / ────────────────────────────────────
  app.get('/', async (request) => {
    const query = querySchema.parse(request.query);
    const conditions = [];

    if (query.themeId) conditions.push(eq(fiches.themeId, query.themeId));
    if (query.isPremium !== undefined) conditions.push(eq(fiches.isPremium, query.isPremium));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db.query.fiches.findMany({
      where,
      limit: query.limit,
      offset: query.offset,
      orderBy: [asc(fiches.themeId), asc(fiches.displayOrder)],
      with: {
        translations: query.lang && query.lang !== 'fr'
          ? { where: eq(ficheTranslations.lang, query.lang) }
          : undefined,
      },
    });

    const data = results.map((f) => flattenTranslation(f as FicheRow, query.lang));
    return { data, total: data.length };
  });

  // ── GET /:id ─────────────────────────────────
  app.get('/:id', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const lang = (request.query as { lang?: string }).lang as
      | 'fr' | 'ar' | 'fa' | 'pt' | 'es' | 'hi'
      | undefined;

    const fiche = await db.query.fiches.findFirst({
      where: eq(fiches.id, id),
      with: {
        translations: lang && lang !== 'fr'
          ? { where: eq(ficheTranslations.lang, lang) }
          : undefined,
      },
    });

    if (!fiche) {
      return reply.status(404).send({ error: 'Fiche not found' });
    }

    const data = flattenTranslation(fiche as FicheRow, lang);
    return { data };
  });
}
