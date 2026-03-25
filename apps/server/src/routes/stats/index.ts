import { FastifyInstance } from 'fastify';
import { eq, count, avg, sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { examSessions, practiceAnswers, questions } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

export default async function statsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  app.get('/overview', async (request) => {
    const userId = request.currentUser!.id;

    const [examStats] = await db
      .select({
        totalExams: count(),
        avgScore: avg(examSessions.score),
        passedCount: count(sql`CASE WHEN ${examSessions.passed} = true THEN 1 END`),
      })
      .from(examSessions)
      .where(eq(examSessions.userId, userId));

    const [practiceStats] = await db
      .select({
        totalAnswers: count(),
        correctAnswers: count(sql`CASE WHEN ${practiceAnswers.isCorrect} = true THEN 1 END`),
      })
      .from(practiceAnswers)
      .where(eq(practiceAnswers.userId, userId));

    return {
      data: {
        exams: {
          total: examStats.totalExams,
          averageScore: examStats.avgScore ? parseFloat(String(examStats.avgScore)) : 0,
          passed: examStats.passedCount,
        },
        practice: {
          totalAnswers: practiceStats.totalAnswers,
          correctAnswers: practiceStats.correctAnswers,
          accuracy:
            practiceStats.totalAnswers > 0
              ? Math.round((practiceStats.correctAnswers / practiceStats.totalAnswers) * 100)
              : 0,
        },
      },
    };
  });

  app.get('/by-theme', async (request) => {
    const userId = request.currentUser!.id;

    const themeStats = await db
      .select({
        themeId: questions.themeId,
        totalAnswers: count(),
        correctAnswers: count(sql`CASE WHEN ${practiceAnswers.isCorrect} = true THEN 1 END`),
      })
      .from(practiceAnswers)
      .innerJoin(questions, eq(practiceAnswers.questionId, questions.id))
      .where(eq(practiceAnswers.userId, userId))
      .groupBy(questions.themeId);

    return { data: themeStats };
  });
}
