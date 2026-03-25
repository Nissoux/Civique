import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, or, and, sql, desc } from 'drizzle-orm';
import { db } from '../../config/database.js';
import {
  friendships,
  challenges,
  challengeAnswers,
  comments,
  users,
  questions,
  examSessions,
  themes,
} from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const friendRequestSchema = z.object({
  addresseeId: z.string().uuid(),
});

const friendUpdateSchema = z.object({
  status: z.enum(['accepted', 'declined']),
});

const challengeCreateSchema = z.object({
  challengedId: z.string().uuid(),
  themeId: z.number().optional(),
  questionCount: z.number().min(5).max(20).default(10),
});

const challengeAnswerSchema = z.object({
  questionId: z.number(),
  selectedChoice: z.enum(['a', 'b', 'c', 'd']),
  timeSpentMs: z.number().optional(),
});

const commentCreateSchema = z.object({
  questionId: z.number(),
  parentId: z.number().optional(),
  body: z.string().min(1).max(2000),
});

const leaderboardQuerySchema = z.object({
  period: z.enum(['week', 'month', 'all']).default('all'),
});

const commentsQuerySchema = z.object({
  questionId: z.coerce.number(),
});

export default async function socialRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  // ═══════════════════════════════════════════════
  // LEADERBOARD
  // ═══════════════════════════════════════════════

  app.get('/leaderboard', async (request) => {
    const { period } = leaderboardQuerySchema.parse(request.query);

    let dateFilter = sql`true`;
    if (period === 'week') {
      dateFilter = sql`${examSessions.finishedAt} >= now() - interval '7 days'`;
    } else if (period === 'month') {
      dateFilter = sql`${examSessions.finishedAt} >= now() - interval '30 days'`;
    }

    const leaderboard = await db
      .select({
        userId: users.id,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        bestScore: sql<number>`max(${examSessions.score})::int`,
        examCount: sql<number>`count(${examSessions.id})::int`,
      })
      .from(examSessions)
      .innerJoin(users, eq(examSessions.userId, users.id))
      .where(
        and(
          sql`${examSessions.finishedAt} IS NOT NULL`,
          dateFilter,
        ),
      )
      .groupBy(users.id, users.displayName, users.avatarUrl)
      .orderBy(desc(sql`max(${examSessions.score})`))
      .limit(50);

    const ranked = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    return { data: ranked };
  });

  // ═══════════════════════════════════════════════
  // FRIENDS
  // ═══════════════════════════════════════════════

  app.get('/friends', async (request) => {
    const userId = request.currentUser!.id;
    const results = await db.query.friendships.findMany({
      where: or(
        eq(friendships.requesterId, userId),
        eq(friendships.addresseeId, userId),
      ),
      with: {
        requester: {
          columns: { id: true, displayName: true, avatarUrl: true },
        },
        addressee: {
          columns: { id: true, displayName: true, avatarUrl: true },
        },
      },
    });
    return { data: results };
  });

  app.post('/friends/request', async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = friendRequestSchema.parse(request.body);

    if (body.addresseeId === userId) {
      return reply.status(400).send({ error: 'Cannot friend yourself' });
    }

    // Check no existing friendship in either direction
    const existing = await db.query.friendships.findFirst({
      where: or(
        and(eq(friendships.requesterId, userId), eq(friendships.addresseeId, body.addresseeId)),
        and(eq(friendships.requesterId, body.addresseeId), eq(friendships.addresseeId, userId)),
      ),
    });

    if (existing) {
      return reply.status(409).send({ error: 'Friend request already exists' });
    }

    // Verify addressee exists
    const addressee = await db.query.users.findFirst({
      where: eq(users.id, body.addresseeId),
      columns: { id: true },
    });

    if (!addressee) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const [friendship] = await db
      .insert(friendships)
      .values({ requesterId: userId, addresseeId: body.addresseeId })
      .returning();

    return reply.status(201).send({ data: friendship });
  });

  // Accept or decline friend request
  app.patch('/friends/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = request.currentUser!.id;
    const body = friendUpdateSchema.parse(request.body);

    // Only the addressee can accept/decline
    const friendship = await db.query.friendships.findFirst({
      where: and(
        eq(friendships.id, parseInt(id, 10)),
        eq(friendships.addresseeId, userId),
        eq(friendships.status, 'pending'),
      ),
    });

    if (!friendship) {
      return reply.status(404).send({ error: 'Pending friend request not found' });
    }

    const [updated] = await db
      .update(friendships)
      .set({ status: body.status })
      .where(eq(friendships.id, parseInt(id, 10)))
      .returning();

    return { data: updated };
  });

  // ═══════════════════════════════════════════════
  // CHALLENGES
  // ═══════════════════════════════════════════════

  app.post('/challenges', async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = challengeCreateSchema.parse(request.body);

    if (body.challengedId === userId) {
      return reply.status(400).send({ error: 'Cannot challenge yourself' });
    }

    // Generate random questions
    const questionFilter = body.themeId
      ? and(eq(questions.themeId, body.themeId))
      : sql`true`;

    const randomQuestions = await db
      .select({ id: questions.id })
      .from(questions)
      .where(questionFilter)
      .orderBy(sql`RANDOM()`)
      .limit(body.questionCount);

    if (randomQuestions.length < body.questionCount) {
      return reply.status(400).send({ error: 'Not enough questions available' });
    }

    // Create challenge
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

    const [challenge] = await db
      .insert(challenges)
      .values({
        challengerId: userId,
        challengedId: body.challengedId,
        themeId: body.themeId,
        questionCount: body.questionCount,
        expiresAt,
      })
      .returning();

    // Create answer rows for both participants
    const answerRows: {
      challengeId: string;
      userId: string;
      questionId: number;
    }[] = [];

    for (const q of randomQuestions) {
      answerRows.push({
        challengeId: challenge.id,
        userId,
        questionId: q.id,
      });
      answerRows.push({
        challengeId: challenge.id,
        userId: body.challengedId,
        questionId: q.id,
      });
    }

    await db.insert(challengeAnswers).values(answerRows);

    return reply.status(201).send({ data: challenge });
  });

  app.get('/challenges', async (request) => {
    const userId = request.currentUser!.id;
    const results = await db.query.challenges.findMany({
      where: or(
        eq(challenges.challengerId, userId),
        eq(challenges.challengedId, userId),
      ),
      with: {
        challenger: {
          columns: { id: true, displayName: true, avatarUrl: true },
        },
        challenged: {
          columns: { id: true, displayName: true, avatarUrl: true },
        },
        theme: {
          columns: { id: true, nameFr: true },
        },
      },
      orderBy: desc(challenges.createdAt),
    });
    return { data: results };
  });

  app.get('/challenges/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = request.currentUser!.id;

    const challenge = await db.query.challenges.findFirst({
      where: and(
        eq(challenges.id, id),
        or(
          eq(challenges.challengerId, userId),
          eq(challenges.challengedId, userId),
        ),
      ),
      with: {
        challenger: {
          columns: { id: true, displayName: true, avatarUrl: true },
        },
        challenged: {
          columns: { id: true, displayName: true, avatarUrl: true },
        },
        theme: {
          columns: { id: true, nameFr: true },
        },
      },
    });

    if (!challenge) {
      return reply.status(404).send({ error: 'Challenge not found' });
    }

    // Get questions for this user in this challenge
    const myAnswers = await db
      .select({
        answerId: challengeAnswers.id,
        questionId: challengeAnswers.questionId,
        selectedChoice: challengeAnswers.selectedChoice,
        isCorrect: challengeAnswers.isCorrect,
        questionText: questions.textFr,
        choicesFr: questions.choicesFr,
        themeId: questions.themeId,
      })
      .from(challengeAnswers)
      .innerJoin(questions, eq(challengeAnswers.questionId, questions.id))
      .where(
        and(
          eq(challengeAnswers.challengeId, id),
          eq(challengeAnswers.userId, userId),
        ),
      );

    return {
      data: {
        challenge,
        questions: myAnswers,
      },
    };
  });

  app.post('/challenges/:id/answer', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = request.currentUser!.id;
    const body = challengeAnswerSchema.parse(request.body);

    // Verify challenge exists and user is a participant
    const challenge = await db.query.challenges.findFirst({
      where: and(
        eq(challenges.id, id),
        or(
          eq(challenges.challengerId, userId),
          eq(challenges.challengedId, userId),
        ),
      ),
      columns: { id: true, status: true },
    });

    if (!challenge) {
      return reply.status(404).send({ error: 'Challenge not found' });
    }

    // Verify question belongs to this challenge for this user
    const existingAnswer = await db.query.challengeAnswers.findFirst({
      where: and(
        eq(challengeAnswers.challengeId, id),
        eq(challengeAnswers.userId, userId),
        eq(challengeAnswers.questionId, body.questionId),
      ),
    });

    if (!existingAnswer) {
      return reply.status(400).send({ error: 'Question does not belong to this challenge' });
    }

    // Look up correct answer
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, body.questionId),
      columns: { correctChoice: true },
    });

    if (!question) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    const isCorrect = question.correctChoice === body.selectedChoice;

    const [updated] = await db
      .update(challengeAnswers)
      .set({
        selectedChoice: body.selectedChoice,
        isCorrect,
        timeSpentMs: body.timeSpentMs,
      })
      .where(
        and(
          eq(challengeAnswers.challengeId, id),
          eq(challengeAnswers.userId, userId),
          eq(challengeAnswers.questionId, body.questionId),
        ),
      )
      .returning();

    // Update challenge status to active if still pending
    if (challenge.status === 'pending') {
      await db
        .update(challenges)
        .set({ status: 'active' })
        .where(eq(challenges.id, id));
    }

    return { data: { isCorrect, answerId: updated.id } };
  });

  app.post('/challenges/:id/finish', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = request.currentUser!.id;

    const challenge = await db.query.challenges.findFirst({
      where: and(
        eq(challenges.id, id),
        or(
          eq(challenges.challengerId, userId),
          eq(challenges.challengedId, userId),
        ),
      ),
    });

    if (!challenge) {
      return reply.status(404).send({ error: 'Challenge not found' });
    }

    // Calculate score for current user
    const myAnswers = await db.query.challengeAnswers.findMany({
      where: and(
        eq(challengeAnswers.challengeId, id),
        eq(challengeAnswers.userId, userId),
      ),
    });

    const correctCount = myAnswers.filter((a) => a.isCorrect === true).length;

    // Update the appropriate score field
    const isChallenger = challenge.challengerId === userId;
    const updateData = isChallenger
      ? { challengerScore: correctCount }
      : { challengedScore: correctCount };

    // If both scores are now set, mark as completed
    const otherScore = isChallenger ? challenge.challengedScore : challenge.challengerScore;
    if (otherScore !== null) {
      Object.assign(updateData, { status: 'completed' as const });
    }

    const [updated] = await db
      .update(challenges)
      .set(updateData)
      .where(eq(challenges.id, id))
      .returning();

    return {
      data: {
        challenge: updated,
        myScore: correctCount,
        totalQuestions: myAnswers.length,
      },
    };
  });

  // ═══════════════════════════════════════════════
  // COMMENTS
  // ═══════════════════════════════════════════════

  app.get('/comments', async (request, reply) => {
    const { questionId } = commentsQuerySchema.parse(request.query);

    const results = await db
      .select({
        id: comments.id,
        userId: comments.userId,
        questionId: comments.questionId,
        parentId: comments.parentId,
        body: comments.body,
        createdAt: comments.createdAt,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.questionId, questionId))
      .orderBy(comments.createdAt);

    // Build threaded structure
    type CommentWithReplies = (typeof results)[number] & { replies: CommentWithReplies[] };
    const commentMap = new Map<number, CommentWithReplies>();
    const topLevel: CommentWithReplies[] = [];

    for (const row of results) {
      const comment: CommentWithReplies = { ...row, replies: [] };
      commentMap.set(row.id, comment);
    }

    for (const comment of commentMap.values()) {
      if (comment.parentId && commentMap.has(comment.parentId)) {
        commentMap.get(comment.parentId)!.replies.push(comment);
      } else {
        topLevel.push(comment);
      }
    }

    return { data: topLevel };
  });

  app.post('/comments', async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = commentCreateSchema.parse(request.body);

    // Verify question exists
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, body.questionId),
      columns: { id: true },
    });

    if (!question) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    // If parentId is provided, verify it exists and belongs to same question
    if (body.parentId) {
      const parent = await db.query.comments.findFirst({
        where: and(
          eq(comments.id, body.parentId),
          eq(comments.questionId, body.questionId),
        ),
      });
      if (!parent) {
        return reply.status(400).send({ error: 'Parent comment not found for this question' });
      }
    }

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

  app.delete('/comments/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = request.currentUser!.id;

    const comment = await db.query.comments.findFirst({
      where: and(
        eq(comments.id, parseInt(id, 10)),
        eq(comments.userId, userId),
      ),
    });

    if (!comment) {
      return reply.status(404).send({ error: 'Comment not found or not yours' });
    }

    await db
      .delete(comments)
      .where(eq(comments.id, parseInt(id, 10)));

    return reply.status(204).send();
  });
}
