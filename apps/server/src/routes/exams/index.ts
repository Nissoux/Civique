import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { examSessions, examAnswers, questions } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const startExamSchema = z.object({
  totalQuestions: z.number().min(5).max(40).default(20),
  timeLimitSec: z.number().min(300).max(7200).default(2700),
});

const submitAnswerSchema = z.object({
  questionId: z.number(),
  selectedChoice: z.enum(['a', 'b', 'c', 'd']),
  timeSpentMs: z.number().optional(),
});

export default async function examRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  app.post('/start', async (request, reply) => {
    const body = startExamSchema.parse(request.body);
    const userId = request.currentUser!.id;

    const examQuestions = await db.query.questions.findMany({
      limit: body.totalQuestions,
      orderBy: sql`RANDOM()`,
      columns: { id: true },
    });

    const [session] = await db
      .insert(examSessions)
      .values({
        userId,
        totalQuestions: body.totalQuestions,
        timeLimitSec: body.timeLimitSec,
      })
      .returning();

    const answersToInsert = examQuestions.map((q) => ({
      sessionId: session.id,
      questionId: q.id,
    }));

    if (answersToInsert.length > 0) {
      await db.insert(examAnswers).values(answersToInsert);
    }

    return reply.status(201).send({ data: session });
  });

  app.get('/:sessionId', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const session = await db.query.examSessions.findFirst({
      where: eq(examSessions.id, sessionId),
      with: { answers: { with: { question: true } } },
    });

    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }

    return { data: session };
  });

  app.post('/:sessionId/answer', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const body = submitAnswerSchema.parse(request.body);

    const question = await db.query.questions.findFirst({
      where: eq(questions.id, body.questionId),
      columns: { correctChoice: true },
    });

    if (!question) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    const isCorrect = question.correctChoice === body.selectedChoice;

    await db
      .update(examAnswers)
      .set({
        selectedChoice: body.selectedChoice,
        isCorrect,
        timeSpentMs: body.timeSpentMs,
      })
      .where(
        eq(examAnswers.sessionId, sessionId),
      );

    return { data: { isCorrect } };
  });

  app.post('/:sessionId/finish', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };

    const answers = await db.query.examAnswers.findMany({
      where: eq(examAnswers.sessionId, sessionId),
    });

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / answers.length) * 100);
    const passed = score >= 75;

    const [updated] = await db
      .update(examSessions)
      .set({
        finishedAt: new Date(),
        score,
        passed,
      })
      .where(eq(examSessions.id, sessionId))
      .returning();

    return { data: updated };
  });
}
