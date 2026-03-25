import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, or, and } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { friendships, challenges, comments } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const friendRequestSchema = z.object({
  addresseeId: z.string().uuid(),
});

const challengeCreateSchema = z.object({
  challengedId: z.string().uuid(),
  themeId: z.number().optional(),
  questionCount: z.number().min(5).max(20).default(10),
});

const commentCreateSchema = z.object({
  questionId: z.number(),
  parentId: z.number().optional(),
  body: z.string().min(1).max(2000),
});

export default async function socialRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  // ── Friendships ──

  app.get('/friends', async (request) => {
    const userId = request.currentUser!.id;
    const results = await db.query.friendships.findMany({
      where: or(eq(friendships.requesterId, userId), eq(friendships.addresseeId, userId)),
      with: { requester: true, addressee: true },
    });
    return { data: results };
  });

  app.post('/friends/request', async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = friendRequestSchema.parse(request.body);

    if (body.addresseeId === userId) {
      return reply.status(400).send({ error: 'Cannot friend yourself' });
    }

    const existing = await db.query.friendships.findFirst({
      where: or(
        and(eq(friendships.requesterId, userId), eq(friendships.addresseeId, body.addresseeId)),
        and(eq(friendships.requesterId, body.addresseeId), eq(friendships.addresseeId, userId)),
      ),
    });

    if (existing) {
      return reply.status(409).send({ error: 'Friend request already exists' });
    }

    const [friendship] = await db
      .insert(friendships)
      .values({ requesterId: userId, addresseeId: body.addresseeId })
      .returning();

    return reply.status(201).send({ data: friendship });
  });

  app.patch('/friends/:id/accept', async (request) => {
    const { id } = request.params as { id: string };
    const [updated] = await db
      .update(friendships)
      .set({ status: 'accepted' })
      .where(eq(friendships.id, parseInt(id, 10)))
      .returning();
    return { data: updated };
  });

  // ── Challenges ──

  app.get('/challenges', async (request) => {
    const userId = request.currentUser!.id;
    const results = await db.query.challenges.findMany({
      where: or(eq(challenges.challengerId, userId), eq(challenges.challengedId, userId)),
      with: { challenger: true, challenged: true },
    });
    return { data: results };
  });

  app.post('/challenges', async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = challengeCreateSchema.parse(request.body);

    const [challenge] = await db
      .insert(challenges)
      .values({
        challengerId: userId,
        challengedId: body.challengedId,
        themeId: body.themeId,
        questionCount: body.questionCount,
      })
      .returning();

    return reply.status(201).send({ data: challenge });
  });

  // ── Comments ──

  app.get('/comments/:questionId', async (request) => {
    const { questionId } = request.params as { questionId: string };
    const results = await db.query.comments.findMany({
      where: eq(comments.questionId, parseInt(questionId, 10)),
      with: { user: true, replies: true },
    });
    return { data: results };
  });

  app.post('/comments', async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = commentCreateSchema.parse(request.body);

    const [comment] = await db
      .insert(comments)
      .values({
        userId,
        questionId: body.questionId,
        parentId: body.parentId,
        body: body.body,
      })
      .returning();

    return reply.status(201).send({ data: comment });
  });
}
