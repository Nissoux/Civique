import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { and, ilike, ne, or, sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { users } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

// Accept input via query OR body so this route is friendly to web/mobile clients
const searchSchema = z.object({
  q: z.string().min(2).max(100),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export default async function userRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  // ── POST /users/search ─────────────────────────
  // Recherche d'utilisateurs par email ou displayName (insensible à la casse)
  app.post(
    '/search',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
          keyGenerator: (req) => req.currentUser?.id ?? req.ip,
        },
      },
    },
    async (request) => {
      const raw = {
        ...(typeof request.body === 'object' && request.body !== null ? request.body : {}),
        ...(typeof request.query === 'object' && request.query !== null ? request.query : {}),
      };
      const { q, limit } = searchSchema.parse(raw);
      const userId = request.currentUser!.id;

      const needle = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;

      const results = await db
        .select({
          id: users.id,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(
          and(
            ne(users.id, userId),
            or(
              ilike(users.email, needle),
              ilike(users.displayName, needle),
            ),
          ),
        )
        .orderBy(sql`length(${users.displayName})`)
        .limit(limit);

      return { data: results };
    },
  );
}
