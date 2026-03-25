import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, asc } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { fiches, ficheTranslations } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const querySchema = z.object({
  themeId: z.coerce.number().optional(),
  lang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi']).optional(),
});

export default async function ficheRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  app.get('/', async (request) => {
    const query = querySchema.parse(request.query);

    const results = await db.query.fiches.findMany({
      where: query.themeId ? eq(fiches.themeId, query.themeId) : undefined,
      orderBy: [asc(fiches.themeId), asc(fiches.displayOrder)],
      with: {
        translations: query.lang
          ? { where: eq(ficheTranslations.lang, query.lang) }
          : undefined,
      },
    });

    return { data: results };
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const fiche = await db.query.fiches.findFirst({
      where: eq(fiches.id, parseInt(id, 10)),
      with: { translations: true },
    });

    if (!fiche) {
      return reply.status(404).send({ error: 'Fiche not found' });
    }

    return { data: fiche };
  });
}
