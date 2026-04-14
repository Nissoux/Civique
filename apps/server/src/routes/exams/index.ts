import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, sql, desc, gte } from 'drizzle-orm';
import { db } from '../../config/database.js';
import {
  examSessions,
  examAnswers,
  questions,
  themes,
  users,
} from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';
import { checkExamQuota } from '../../middleware/quota.js';

const startExamSchema = z.object({
  examType: z.enum(['csp', 'cr', 'nat']).optional(),
});

const submitAnswerSchema = z.object({
  questionId: z.number(),
  selectedChoice: z.enum(['a', 'b', 'c', 'd']),
  timeSpentMs: z.number().optional(),
});

const historyQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
  offset: z.coerce.number().min(0).default(0),
});

const TOTAL_QUESTIONS = 40;
const KNOWLEDGE_COUNT = 28;
const SITUATIONAL_COUNT = 12;
const PASS_THRESHOLD = 32;
const TIME_LIMIT_SEC = 2700;

export default async function examRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  // ── POST /start ─────────────────────────────────────────
  // Generate exam: 28 knowledge + 12 situational across all 5 themes
  app.post('/start', { preHandler: checkExamQuota }, async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = startExamSchema.parse(request.body || {});
    const examTypeFilter = body.examType;

    // Limit concurrent active exams (max 1 unfinished at a time)
    const [activeExam] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(examSessions)
      .where(and(eq(examSessions.userId, userId), sql`${examSessions.finishedAt} IS NULL`));

    if (activeExam.count > 0) {
      return reply.status(409).send({
        error: 'Vous avez déjà un examen en cours. Terminez-le avant d\'en commencer un nouveau.',
      });
    }

    // Get all 5 themes
    const allThemes = await db.query.themes.findMany({
      columns: { id: true },
      orderBy: themes.displayOrder,
    });

    if (allThemes.length === 0) {
      return reply.status(500).send({ error: 'No themes configured' });
    }

    // Distribution: ~6 knowledge + ~2-3 situational per theme
    // Total: 28 knowledge + 12 situational = 40
    const themeCount = allThemes.length; // expected 5
    const knowledgePerTheme = Math.floor(KNOWLEDGE_COUNT / themeCount); // 5
    const situationalPerTheme = Math.floor(SITUATIONAL_COUNT / themeCount); // 2
    const knowledgeRemainder = KNOWLEDGE_COUNT % themeCount; // 3
    const situationalRemainder = SITUATIONAL_COUNT % themeCount; // 2

    const selectedQuestionIds: number[] = [];

    // Pull each question type once across all themes in a single SQL round-trip
    // (was N+1: 2 queries per theme). Random order is applied at the SQL layer
    // and survives the JS filter below, so every theme still samples uniformly.
    const knowledgeConditions = [eq(questions.type, 'knowledge')];
    if (examTypeFilter) knowledgeConditions.push(sql`${examTypeFilter} = ANY(${questions.examTypes})`);
    const knowledgePool = await db
      .select({ id: questions.id, themeId: questions.themeId })
      .from(questions)
      .where(and(...knowledgeConditions))
      .orderBy(sql`RANDOM()`);

    const situationalConditions = [eq(questions.type, 'situational')];
    if (examTypeFilter) situationalConditions.push(sql`${examTypeFilter} = ANY(${questions.examTypes})`);
    const situationalPool = await db
      .select({ id: questions.id, themeId: questions.themeId })
      .from(questions)
      .where(and(...situationalConditions))
      .orderBy(sql`RANDOM()`);

    for (let i = 0; i < allThemes.length; i++) {
      const themeId = allThemes[i].id;
      const knowledgeNeeded = knowledgePerTheme + (i < knowledgeRemainder ? 1 : 0);
      const situationalNeeded = situationalPerTheme + (i < situationalRemainder ? 1 : 0);

      const knowledgeQs = knowledgePool.filter((q) => q.themeId === themeId).slice(0, knowledgeNeeded);
      const situationalQs = situationalPool.filter((q) => q.themeId === themeId).slice(0, situationalNeeded);

      for (const q of knowledgeQs) selectedQuestionIds.push(q.id);
      for (const q of situationalQs) selectedQuestionIds.push(q.id);
    }

    // Create session (use actual question count, may be fewer than 40 if DB lacks questions)
    const [session] = await db
      .insert(examSessions)
      .values({
        userId,
        examType: examTypeFilter || 'nat',
        totalQuestions: selectedQuestionIds.length,
        timeLimitSec: TIME_LIMIT_SEC,
      })
      .returning();

    // Create exam answer rows (unanswered)
    if (selectedQuestionIds.length > 0) {
      const answersToInsert = selectedQuestionIds.map((questionId) => ({
        sessionId: session.id,
        questionId,
      }));
      await db.insert(examAnswers).values(answersToInsert);
    }

    return reply.status(201).send({
      data: {
        ...session,
        questionIds: selectedQuestionIds,
      },
    });
  });

  // ── GET /:sessionId ─────────────────────────────────────
  // Get session with all questions (text, choices). Verify ownership.
  app.get('/:sessionId', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const userId = request.currentUser!.id;

    const session = await db.query.examSessions.findFirst({
      where: and(
        eq(examSessions.id, sessionId),
        eq(examSessions.userId, userId),
      ),
      with: {
        answers: {
          with: {
            question: {
              columns: {
                id: true,
                themeId: true,
                type: true,
                textFr: true,
                choicesFr: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }

    return { data: session };
  });

  // ── POST /:sessionId/answer ─────────────────────────────
  // Submit answer for a specific question in the session
  app.post('/:sessionId/answer', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const userId = request.currentUser!.id;
    const body = submitAnswerSchema.parse(request.body);

    // Verify session belongs to user
    const session = await db.query.examSessions.findFirst({
      where: and(
        eq(examSessions.id, sessionId),
        eq(examSessions.userId, userId),
      ),
      columns: { id: true, finishedAt: true },
    });

    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }

    if (session.finishedAt) {
      return reply.status(400).send({ error: 'Exam already finished' });
    }

    // Verify this question belongs to this session
    const existingAnswer = await db.query.examAnswers.findFirst({
      where: and(
        eq(examAnswers.sessionId, sessionId),
        eq(examAnswers.questionId, body.questionId),
      ),
    });

    if (!existingAnswer) {
      return reply.status(400).send({ error: 'Question does not belong to this exam session' });
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

    // Update the SPECIFIC exam answer row
    const [updated] = await db
      .update(examAnswers)
      .set({
        selectedChoice: body.selectedChoice,
        isCorrect,
        timeSpentMs: body.timeSpentMs,
      })
      .where(
        and(
          eq(examAnswers.sessionId, sessionId),
          eq(examAnswers.questionId, body.questionId),
        ),
      )
      .returning();

    return { data: { isCorrect, answerId: updated.id } };
  });

  // ── POST /:sessionId/finish ─────────────────────────────
  // Calculate score as correct_count, pass threshold = 32/40
  app.post('/:sessionId/finish', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const userId = request.currentUser!.id;

    // Verify ownership
    const session = await db.query.examSessions.findFirst({
      where: and(
        eq(examSessions.id, sessionId),
        eq(examSessions.userId, userId),
      ),
      columns: { id: true, finishedAt: true },
    });

    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }

    if (session.finishedAt) {
      return reply.status(400).send({ error: 'Exam already finished' });
    }

    const answers = await db.query.examAnswers.findMany({
      where: eq(examAnswers.sessionId, sessionId),
    });

    const correctCount = answers.filter((a) => a.isCorrect === true).length;
    const passed = correctCount >= PASS_THRESHOLD;

    const [updated] = await db
      .update(examSessions)
      .set({
        finishedAt: new Date(),
        score: correctCount,
        passed,
      })
      .where(eq(examSessions.id, sessionId))
      .returning();

    return { data: updated };
  });

  // ── GET /history ────────────────────────────────────────
  // List user's past exam sessions with pagination
  app.get('/history', async (request, reply) => {
    const userId = request.currentUser!.id;
    const { limit, offset } = historyQuerySchema.parse(request.query);

    const sessions = await db
      .select()
      .from(examSessions)
      .where(eq(examSessions.userId, userId))
      .orderBy(desc(examSessions.startedAt))
      .limit(limit)
      .offset(offset);

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(examSessions)
      .where(eq(examSessions.userId, userId));

    return {
      data: sessions,
      pagination: {
        total: totalResult.count,
        limit,
        offset,
      },
    };
  });

  // ── GET /:sessionId/results ─────────────────────────────
  // Detailed results: score, per-theme breakdown, wrong answers
  app.get('/:sessionId/results', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const userId = request.currentUser!.id;

    const session = await db.query.examSessions.findFirst({
      where: and(
        eq(examSessions.id, sessionId),
        eq(examSessions.userId, userId),
      ),
    });

    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }

    if (!session.finishedAt) {
      return reply.status(400).send({ error: 'Exam not yet finished' });
    }

    // Get all answers with question + theme info
    const answers = await db
      .select({
        answerId: examAnswers.id,
        questionId: examAnswers.questionId,
        selectedChoice: examAnswers.selectedChoice,
        isCorrect: examAnswers.isCorrect,
        timeSpentMs: examAnswers.timeSpentMs,
        questionText: questions.textFr,
        choicesFr: questions.choicesFr,
        correctChoice: questions.correctChoice,
        explanationFr: questions.explanationFr,
        themeId: questions.themeId,
        questionType: questions.type,
      })
      .from(examAnswers)
      .innerJoin(questions, eq(examAnswers.questionId, questions.id))
      .where(eq(examAnswers.sessionId, sessionId));

    // Get theme names
    const allThemes = await db.query.themes.findMany({
      columns: { id: true, nameFr: true },
    });
    const themeMap = new Map(allThemes.map((t) => [t.id, t.nameFr]));

    // Per-theme breakdown
    const themeBreakdown: Record<
      number,
      { themeId: number; themeName: string; total: number; correct: number; accuracy: number }
    > = {};

    for (const answer of answers) {
      if (!themeBreakdown[answer.themeId]) {
        themeBreakdown[answer.themeId] = {
          themeId: answer.themeId,
          themeName: themeMap.get(answer.themeId) ?? 'Unknown',
          total: 0,
          correct: 0,
          accuracy: 0,
        };
      }
      themeBreakdown[answer.themeId].total++;
      if (answer.isCorrect) {
        themeBreakdown[answer.themeId].correct++;
      }
    }

    for (const tb of Object.values(themeBreakdown)) {
      tb.accuracy = tb.total > 0 ? Math.round((tb.correct / tb.total) * 100) : 0;
    }

    // Wrong answers with correct answer shown
    const wrongAnswers = answers
      .filter((a) => a.isCorrect === false)
      .map((a) => ({
        questionId: a.questionId,
        questionText: a.questionText,
        choices: a.choicesFr,
        selectedChoice: a.selectedChoice,
        correctChoice: a.correctChoice,
        explanation: a.explanationFr,
        themeId: a.themeId,
        themeName: themeMap.get(a.themeId) ?? 'Unknown',
      }));

    return {
      data: {
        session: {
          id: session.id,
          score: session.score,
          totalQuestions: session.totalQuestions,
          passed: session.passed,
          startedAt: session.startedAt,
          finishedAt: session.finishedAt,
        },
        themeBreakdown: Object.values(themeBreakdown),
        wrongAnswers,
      },
    };
  });
}
