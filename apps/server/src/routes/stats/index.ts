import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, sql, gte, desc } from 'drizzle-orm';
import { db } from '../../config/database.js';
import {
  examSessions,
  examAnswers,
  practiceAnswers,
  questions,
  themes,
} from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const historyQuerySchema = z.object({
  period: z.enum(['week', 'month', 'all']).default('month'),
});

const practiceAnswerSchema = z.object({
  questionId: z.number(),
  selectedChoice: z.enum(['a', 'b', 'c', 'd']),
  timeSpentMs: z.number().optional(),
});

export default async function statsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  // ── GET /overview ───────────────────────────────────────
  app.get('/overview', async (request) => {
    const userId = request.currentUser!.id;

    // Exam stats
    const [examStats] = await db
      .select({
        examsTaken: sql<number>`count(*)::int`,
        examsPassed: sql<number>`count(CASE WHEN ${examSessions.passed} = true THEN 1 END)::int`,
        averageExamScore: sql<number>`coalesce(avg(${examSessions.score}), 0)`,
      })
      .from(examSessions)
      .where(eq(examSessions.userId, userId));

    // Practice stats
    const [practiceStats] = await db
      .select({
        totalPracticed: sql<number>`count(*)::int`,
        totalCorrect: sql<number>`count(CASE WHEN ${practiceAnswers.isCorrect} = true THEN 1 END)::int`,
      })
      .from(practiceAnswers)
      .where(eq(practiceAnswers.userId, userId));

    // Also count exam answers for total practiced/correct
    const [examAnswerStats] = await db
      .select({
        totalAnswered: sql<number>`count(CASE WHEN ${examAnswers.selectedChoice} IS NOT NULL THEN 1 END)::int`,
        totalCorrect: sql<number>`count(CASE WHEN ${examAnswers.isCorrect} = true THEN 1 END)::int`,
      })
      .from(examAnswers)
      .innerJoin(examSessions, eq(examAnswers.sessionId, examSessions.id))
      .where(eq(examSessions.userId, userId));

    const totalPracticed = practiceStats.totalPracticed + examAnswerStats.totalAnswered;
    const totalCorrect = practiceStats.totalCorrect + examAnswerStats.totalCorrect;
    const overallAccuracy = totalPracticed > 0
      ? Math.round((totalCorrect / totalPracticed) * 100)
      : 0;

    // Current streak: consecutive days with practice or exams
    const streakResult = await db.execute<{ streak: number }>(sql`
      WITH activity_days AS (
        SELECT DISTINCT date_trunc('day', ${practiceAnswers.answeredAt}) AS practice_date
        FROM ${practiceAnswers}
        WHERE ${practiceAnswers.userId} = ${userId}
        UNION
        SELECT DISTINCT date_trunc('day', ${examSessions.startedAt}) AS practice_date
        FROM ${examSessions}
        WHERE ${examSessions.userId} = ${userId}
        ORDER BY practice_date DESC
      ),
      numbered AS (
        SELECT practice_date,
               practice_date - (ROW_NUMBER() OVER (ORDER BY practice_date DESC))::int * INTERVAL '1 day' AS grp
        FROM activity_days
      )
      SELECT count(*)::int AS streak
      FROM numbered
      WHERE grp = (
        SELECT grp FROM numbered ORDER BY practice_date DESC LIMIT 1
      )
    `);

    const currentStreak = streakResult.rows.length > 0
      ? streakResult.rows[0].streak
      : 0;

    return {
      data: {
        totalPracticed,
        totalCorrect,
        overallAccuracy,
        currentStreak,
        examsTaken: examStats.examsTaken,
        examsPassed: examStats.examsPassed,
        averageExamScore: parseFloat(String(examStats.averageExamScore)) || 0,
      },
    };
  });

  // ── GET /by-theme ───────────────────────────────────────
  // Per-theme stats combining exam + practice answers
  app.get('/by-theme', async (request) => {
    const userId = request.currentUser!.id;

    // Practice answers by theme
    const practiceByTheme = await db
      .select({
        themeId: questions.themeId,
        totalAnswered: sql<number>`count(*)::int`,
        correctAnswers: sql<number>`count(CASE WHEN ${practiceAnswers.isCorrect} = true THEN 1 END)::int`,
      })
      .from(practiceAnswers)
      .innerJoin(questions, eq(practiceAnswers.questionId, questions.id))
      .where(eq(practiceAnswers.userId, userId))
      .groupBy(questions.themeId);

    // Exam answers by theme
    const examByTheme = await db
      .select({
        themeId: questions.themeId,
        totalAnswered: sql<number>`count(CASE WHEN ${examAnswers.selectedChoice} IS NOT NULL THEN 1 END)::int`,
        correctAnswers: sql<number>`count(CASE WHEN ${examAnswers.isCorrect} = true THEN 1 END)::int`,
      })
      .from(examAnswers)
      .innerJoin(questions, eq(examAnswers.questionId, questions.id))
      .innerJoin(examSessions, eq(examAnswers.sessionId, examSessions.id))
      .where(eq(examSessions.userId, userId))
      .groupBy(questions.themeId);

    // Merge both
    const allThemes = await db.query.themes.findMany({
      columns: { id: true, nameFr: true },
      orderBy: themes.displayOrder,
    });

    const practiceMap = new Map(practiceByTheme.map((r) => [r.themeId, r]));
    const examMap = new Map(examByTheme.map((r) => [r.themeId, r]));

    const themeStats = allThemes.map((theme) => {
      const practice = practiceMap.get(theme.id);
      const exam = examMap.get(theme.id);
      const totalAnswered = (practice?.totalAnswered ?? 0) + (exam?.totalAnswered ?? 0);
      const correctAnswers = (practice?.correctAnswers ?? 0) + (exam?.correctAnswers ?? 0);
      const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

      return {
        themeId: theme.id,
        themeName: theme.nameFr,
        totalAnswered,
        correctAnswers,
        accuracy,
      };
    });

    return { data: themeStats };
  });

  // ── GET /weak-areas ─────────────────────────────────────
  // Themes where accuracy < 60%, sorted by worst first
  app.get('/weak-areas', async (request) => {
    const userId = request.currentUser!.id;

    // Combined answers by theme (same logic as by-theme)
    const combined = await db
      .select({
        themeId: questions.themeId,
        totalAnswered: sql<number>`count(*)::int`,
        correctAnswers: sql<number>`count(CASE WHEN pa.is_correct = true THEN 1 END)::int`,
      })
      .from(
        sql`(
          SELECT ${practiceAnswers.questionId} AS question_id, ${practiceAnswers.isCorrect} AS is_correct
          FROM ${practiceAnswers}
          WHERE ${practiceAnswers.userId} = ${userId}
          UNION ALL
          SELECT ${examAnswers.questionId} AS question_id, ${examAnswers.isCorrect} AS is_correct
          FROM ${examAnswers}
          INNER JOIN ${examSessions} ON ${examAnswers.sessionId} = ${examSessions.id}
          WHERE ${examSessions.userId} = ${userId}
            AND ${examAnswers.selectedChoice} IS NOT NULL
        ) AS pa`,
      )
      .innerJoin(questions, sql`pa.question_id = ${questions.id}`)
      .groupBy(questions.themeId);

    const allThemes = await db.query.themes.findMany({
      columns: { id: true, nameFr: true },
    });
    const themeMap = new Map(allThemes.map((t) => [t.id, t.nameFr]));

    const weakAreas = combined
      .map((row) => {
        const accuracy = row.totalAnswered > 0
          ? Math.round((row.correctAnswers / row.totalAnswered) * 100)
          : 0;
        return {
          themeId: row.themeId,
          themeName: themeMap.get(row.themeId) ?? 'Unknown',
          totalAnswered: row.totalAnswered,
          correctAnswers: row.correctAnswers,
          accuracy,
        };
      })
      .filter((r) => r.accuracy < 60 && r.totalAnswered > 0)
      .sort((a, b) => a.accuracy - b.accuracy);

    return { data: weakAreas };
  });

  // ── GET /history ────────────────────────────────────────
  // Time-series: { date, totalAnswered, correctAnswers } grouped by day
  app.get('/history', async (request) => {
    const userId = request.currentUser!.id;
    const { period } = historyQuerySchema.parse(request.query);

    let dateFilter = sql`true`;
    if (period === 'week') {
      dateFilter = sql`pa.answered_at >= now() - interval '7 days'`;
    } else if (period === 'month') {
      dateFilter = sql`pa.answered_at >= now() - interval '30 days'`;
    }

    const history = await db.execute<{
      date: string;
      total_answered: number;
      correct_answers: number;
    }>(sql`
      SELECT
        date_trunc('day', pa.answered_at)::date AS date,
        count(*)::int AS total_answered,
        count(CASE WHEN pa.is_correct = true THEN 1 END)::int AS correct_answers
      FROM (
        SELECT ${practiceAnswers.answeredAt} AS answered_at, ${practiceAnswers.isCorrect} AS is_correct
        FROM ${practiceAnswers}
        WHERE ${practiceAnswers.userId} = ${userId}
        UNION ALL
        SELECT ${examSessions.startedAt} AS answered_at, ${examAnswers.isCorrect} AS is_correct
        FROM ${examAnswers}
        INNER JOIN ${examSessions} ON ${examAnswers.sessionId} = ${examSessions.id}
        WHERE ${examSessions.userId} = ${userId}
          AND ${examAnswers.selectedChoice} IS NOT NULL
      ) AS pa
      WHERE ${dateFilter}
      GROUP BY date
      ORDER BY date ASC
    `);

    return {
      data: history.rows.map((row) => ({
        date: row.date,
        totalAnswered: row.total_answered,
        correctAnswers: row.correct_answers,
      })),
    };
  });

  // ── POST /practice ──────────────────────────────────────
  // Record a practice answer
  app.post('/practice', async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = practiceAnswerSchema.parse(request.body);

    // Look up correct answer
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, body.questionId),
      columns: { correctChoice: true },
    });

    if (!question) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    const isCorrect = question.correctChoice === body.selectedChoice;

    const [answer] = await db
      .insert(practiceAnswers)
      .values({
        userId,
        questionId: body.questionId,
        selectedChoice: body.selectedChoice,
        isCorrect,
        timeSpentMs: body.timeSpentMs,
      })
      .returning();

    return reply.status(201).send({ data: { ...answer, isCorrect } });
  });
}
