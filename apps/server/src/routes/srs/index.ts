import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { and, eq, lte, sql, isNotNull } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { srsProgress } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';
import { reviewSrs, feedbackToQuality, SRS_INITIAL } from '../../services/srs.js';

/**
 * SRS API — persists SM-2 review state per (user, item).
 *
 *   POST /api/srs/review
 *     body: { itemType, itemId, feedback }
 *     Records a review on a card or question, returns the new SRS state
 *     and the computed next-review timestamp. The client uses
 *     nextReviewAt to nice-format "next review in 6 days" feedback.
 *
 *   GET /api/srs/due
 *     query: ?itemType=flashcard&limit=20
 *     Lists items whose nextReviewAt is in the past (or null = never
 *     reviewed). The client filters its local deck by these ids to
 *     build today's session.
 *
 *   GET /api/srs/stats
 *     Aggregate counts for the dashboard: how many cards/questions are
 *     due today, learning, mature.
 */

const itemTypeSchema = z.enum(['question', 'flashcard']);
const feedbackSchema = z.enum(['lapse', 'hard', 'good', 'easy']);

const reviewBodySchema = z.object({
  itemType: itemTypeSchema,
  itemId: z.number().int().positive(),
  feedback: feedbackSchema,
});

const dueQuerySchema = z.object({
  itemType: itemTypeSchema,
  limit: z.coerce.number().int().min(1).max(200).default(20),
});

export default async function srsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  // ── POST /review ──────────────────────────────
  app.post('/review', async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = reviewBodySchema.parse(request.body);
    const quality = feedbackToQuality(body.feedback);

    // Read current state (or SRS_INITIAL if first review).
    const [existing] = await db
      .select()
      .from(srsProgress)
      .where(
        and(
          eq(srsProgress.userId, userId),
          eq(srsProgress.itemType, body.itemType),
          eq(srsProgress.itemId, body.itemId),
        ),
      )
      .limit(1);

    const previousState = existing
      ? {
          easeFactor: existing.easeFactor,
          intervalDays: existing.intervalDays,
          consecutiveCorrect: existing.consecutiveCorrect,
          totalReviews: existing.totalReviews,
          lastReviewedAt: existing.lastReviewedAt,
          nextReviewAt: existing.nextReviewAt,
        }
      : SRS_INITIAL;

    const nextState = reviewSrs(previousState, { quality });

    // Upsert. We trade-off one extra DB round-trip for code clarity
    // (read-then-write); a single ON CONFLICT update would be marginally
    // faster but harder to reason about.
    if (existing) {
      await db
        .update(srsProgress)
        .set({
          easeFactor: nextState.easeFactor,
          intervalDays: nextState.intervalDays,
          consecutiveCorrect: nextState.consecutiveCorrect,
          totalReviews: nextState.totalReviews,
          lastReviewedAt: nextState.lastReviewedAt,
          nextReviewAt: nextState.nextReviewAt,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(srsProgress.userId, userId),
            eq(srsProgress.itemType, body.itemType),
            eq(srsProgress.itemId, body.itemId),
          ),
        );
    } else {
      await db.insert(srsProgress).values({
        userId,
        itemType: body.itemType,
        itemId: body.itemId,
        easeFactor: nextState.easeFactor,
        intervalDays: nextState.intervalDays,
        consecutiveCorrect: nextState.consecutiveCorrect,
        totalReviews: nextState.totalReviews,
        lastReviewedAt: nextState.lastReviewedAt,
        nextReviewAt: nextState.nextReviewAt,
      });
    }

    return reply.send({
      data: {
        ...nextState,
        // Serialise Date → ISO string for the wire.
        lastReviewedAt: nextState.lastReviewedAt?.toISOString() ?? null,
        nextReviewAt: nextState.nextReviewAt?.toISOString() ?? null,
      },
    });
  });

  // ── GET /due ──────────────────────────────────
  app.get('/due', async (request, reply) => {
    const userId = request.currentUser!.id;
    const q = dueQuerySchema.parse(request.query);
    const now = new Date();

    const rows = await db
      .select({
        itemId: srsProgress.itemId,
        intervalDays: srsProgress.intervalDays,
        nextReviewAt: srsProgress.nextReviewAt,
        consecutiveCorrect: srsProgress.consecutiveCorrect,
      })
      .from(srsProgress)
      .where(
        and(
          eq(srsProgress.userId, userId),
          eq(srsProgress.itemType, q.itemType),
          isNotNull(srsProgress.nextReviewAt),
          lte(srsProgress.nextReviewAt, now),
        ),
      )
      .orderBy(srsProgress.nextReviewAt)
      .limit(q.limit);

    return reply.send({
      data: {
        dueIds: rows.map((r) => r.itemId),
        details: rows,
        as_of: now.toISOString(),
      },
    });
  });

  // ── GET /stats ────────────────────────────────
  app.get('/stats', async (request, reply) => {
    const userId = request.currentUser!.id;
    const now = new Date();

    const [stats] = await db
      .select({
        flashcards_total: sql<number>`count(*) FILTER (WHERE ${srsProgress.itemType} = 'flashcard')::int`,
        flashcards_due: sql<number>`count(*) FILTER (WHERE ${srsProgress.itemType} = 'flashcard' AND ${srsProgress.nextReviewAt} <= ${now})::int`,
        flashcards_mature: sql<number>`count(*) FILTER (WHERE ${srsProgress.itemType} = 'flashcard' AND ${srsProgress.intervalDays} >= 21)::int`,
        questions_total: sql<number>`count(*) FILTER (WHERE ${srsProgress.itemType} = 'question')::int`,
        questions_due: sql<number>`count(*) FILTER (WHERE ${srsProgress.itemType} = 'question' AND ${srsProgress.nextReviewAt} <= ${now})::int`,
        questions_mature: sql<number>`count(*) FILTER (WHERE ${srsProgress.itemType} = 'question' AND ${srsProgress.intervalDays} >= 21)::int`,
      })
      .from(srsProgress)
      .where(eq(srsProgress.userId, userId));

    return reply.send({
      data: {
        flashcards: {
          total: stats?.flashcards_total ?? 0,
          due: stats?.flashcards_due ?? 0,
          mature: stats?.flashcards_mature ?? 0,
        },
        questions: {
          total: stats?.questions_total ?? 0,
          due: stats?.questions_due ?? 0,
          mature: stats?.questions_mature ?? 0,
        },
        as_of: now.toISOString(),
      },
    });
  });
}
