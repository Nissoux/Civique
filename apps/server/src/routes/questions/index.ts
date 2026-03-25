import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { questions, questionTranslations } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const querySchema = z.object({
  themeId: z.coerce.number().optional(),
  type: z.enum(['knowledge', 'situational']).optional(),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  lang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export default async function questionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  app.get('/', async (request) => {
    const query = querySchema.parse(request.query);
    const conditions = [];

    if (query.themeId) conditions.push(eq(questions.themeId, query.themeId));
    if (query.type) conditions.push(eq(questions.type, query.type));
    if (query.difficulty) conditions.push(eq(questions.difficulty, query.difficulty));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db.query.questions.findMany({
      where,
      limit: query.limit,
      offset: query.offset,
      with: {
        translations: query.lang
          ? { where: eq(questionTranslations.lang, query.lang) }
          : undefined,
      },
    });

    return { data: results };
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, parseInt(id, 10)),
      with: { translations: true },
    });

    if (!question) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    return { data: question };
  });

  app.get('/random', async (request) => {
    const query = querySchema.parse(request.query);
    const conditions = [];

    if (query.themeId) conditions.push(eq(questions.themeId, query.themeId));
    if (query.type) conditions.push(eq(questions.type, query.type));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db.query.questions.findMany({
      where,
      limit: query.limit,
      orderBy: sql`RANDOM()`,
      with: {
        translations: query.lang
          ? { where: eq(questionTranslations.lang, query.lang) }
          : undefined,
      },
    });

    return { data: results };
  });
}
