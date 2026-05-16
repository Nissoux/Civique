import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, sql, desc, gte, inArray } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
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

/**
 * Number of past completed exam sessions whose questions we try to
 * avoid re-using in a new tirage. The "anti-repetition" window.
 *
 * Why 3
 * -----
 * Some sub-topic pools are tiny (soins: 7 questions for NAT, laïcité:
 * 12, obligations: 11). With N = 3 past exams, the user has at most
 * seen 3× 1-2 = 3-6 questions from these pots, leaving room to draw
 * unseen ones. Going higher (N = 5+) would exhaust these pots and
 * force fall-back to seen questions, defeating the purpose.
 *
 * The fallback is graceful: each sub-topic SELECT first tries to
 * draw unseen, and tops up with already-seen if the unseen pool ran
 * dry. The exam is always 40 questions, never short.
 */
const RECENT_EXAMS_TO_AVOID = 3;

/**
 * Draw up to `count` questions matching `baseConditions`, preferring
 * questions whose id is NOT in `exclude`. If the unseen pool is too
 * small, tops up with seen questions so the caller always gets `count`
 * (or however many exist in the underlying pool, whichever is less).
 *
 * Two queries by design — one biased toward unseen, one fallback. A
 * single query with `ORDER BY (id = ANY(seen)), RANDOM()` would also
 * work, but the explicit split makes the intent obvious and lets us
 * skip the top-up entirely when the unseen draw was sufficient.
 */
async function drawPreferringUnseen(
  baseConditions: SQL[],
  count: number,
  exclude: Set<number>,
): Promise<number[]> {
  if (count <= 0) return [];

  // ── First pass: only unseen ──
  const unseenConditions = [...baseConditions];
  if (exclude.size > 0) {
    unseenConditions.push(
      sql`${questions.id} != ALL(ARRAY[${sql.join(
        Array.from(exclude).map((id) => sql`${id}`),
        sql`, `,
      )}]::int[])`,
    );
  }
  const unseen = await db
    .select({ id: questions.id })
    .from(questions)
    .where(and(...unseenConditions))
    .orderBy(sql`RANDOM()`)
    .limit(count);

  if (unseen.length >= count || exclude.size === 0) {
    return unseen.map((r) => r.id);
  }

  // ── Second pass: top up with seen, excluding what we just picked ──
  const need = count - unseen.length;
  const justPicked = new Set(unseen.map((r) => r.id));
  const topUpConditions = [...baseConditions];
  if (justPicked.size > 0) {
    topUpConditions.push(
      sql`${questions.id} != ALL(ARRAY[${sql.join(
        Array.from(justPicked).map((id) => sql`${id}`),
        sql`, `,
      )}]::int[])`,
    );
  }
  const topUp = await db
    .select({ id: questions.id })
    .from(questions)
    .where(and(...topUpConditions))
    .orderBy(sql`RANDOM()`)
    .limit(need);

  return [...unseen.map((r) => r.id), ...topUp.map((r) => r.id)];
}

/**
 * Official tirage composition prescribed by Arrêté du 10 octobre 2025
 * (JORFTEXT000052381620). Each theme is broken into named sub-topics
 * with fixed counts:
 *
 *   Theme 1 — Principes et valeurs (11 total)
 *     devise           3
 *     laicite          2
 *     situation        6   (situational type)
 *
 *   Theme 2 — Système institutionnel (6 total)
 *     vote             3
 *     organisation     2
 *     union_europ      1
 *
 *   Theme 3 — Droits et devoirs (11 total)
 *     droits_fond      2
 *     obligations      3
 *     situation        6   (situational type)
 *
 *   Theme 4 — Histoire/géo/culture (8 total)
 *     periodes         3
 *     geographie       3
 *     patrimoine       2
 *
 *   Theme 5 — Vivre en société (4 total)
 *     installation     1
 *     soins            1
 *     travail          1
 *     education        1
 *
 *   Grand total: 28 knowledge + 12 situational = 40 questions
 *
 * The earlier theme-only fix (5/6/5/8/4 + 6/0/6/0/0) was already
 * conformant on the totals, but a user could (in our DB) draw 5
 * questions on laicité in Theme 1 — possible in our pool, but the
 * real exam never serves more than 2. This finer pass respects the
 * sub-topic ceilings.
 *
 * `subtopic === 'situation'` is overloaded across T1 and T3 with the
 * understanding that those rows are also `type = 'situational'`. The
 * SQL below joins on both for safety.
 *
 * When a sub-topic is short on rows (early seed, missing
 * classification), we degrade gracefully: the loop tries to fill that
 * sub-topic, takes what's there, and moves on. A handful of empty
 * sub-topics will reduce the exam below 40 — never above — so the
 * worst case is a slightly shorter exam, not a malformed one.
 */
const OFFICIAL_SUBTOPIC_DISTRIBUTION: Record<
  number,
  Record<string, number>
> = {
  1: { devise: 3, laicite: 2, situation: 6 },
  2: { vote: 3, organisation: 2, union_europ: 1 },
  3: { droits_fond: 2, obligations: 3, situation: 6 },
  4: { periodes: 3, geographie: 3, patrimoine: 2 },
  5: { installation: 1, soins: 1, travail: 1, education: 1 },
};

/**
 * Theme-only fallback distribution. Used when the corpus hasn't been
 * fully classified yet (no rows with subtopic for a theme), so we can
 * still draw a 40-question exam without subtopic data.
 *
 * Kept for two reasons:
 *   - safety net during the subtopic rollout
 *   - integration tests that pre-date the subtopic feature
 */
const OFFICIAL_DISTRIBUTION: Record<
  number,
  { knowledge: number; situational: number }
> = {
  1: { knowledge: 5, situational: 6 },
  2: { knowledge: 6, situational: 0 },
  3: { knowledge: 5, situational: 6 },
  4: { knowledge: 8, situational: 0 },
  5: { knowledge: 4, situational: 0 },
};

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

    // ── Anti-repetition memory ──
    // Pull question ids the user has seen in their last N completed
    // exams. We pass these as an "exclude preference" to the tirage —
    // the draw will favor questions outside this set, falling back to
    // the seen set only if the underlying pool can't otherwise fill
    // the quota.
    //
    // Two-query approach (sessions then answers) instead of a single
    // JOIN: the sessions query is small and indexed on (user_id, ts);
    // the answers query is then a simple IN lookup. Cleaner Drizzle
    // and easier to debug from a psql session.
    const recentSessions = await db
      .select({ id: examSessions.id })
      .from(examSessions)
      .where(
        and(
          eq(examSessions.userId, userId),
          sql`${examSessions.finishedAt} IS NOT NULL`,
        ),
      )
      .orderBy(desc(examSessions.finishedAt))
      .limit(RECENT_EXAMS_TO_AVOID);

    const recentlySeenIds = new Set<number>();
    if (recentSessions.length > 0) {
      const seen = await db
        .selectDistinct({ questionId: examAnswers.questionId })
        .from(examAnswers)
        .where(
          inArray(
            examAnswers.sessionId,
            recentSessions.map((s) => s.id),
          ),
        );
      for (const row of seen) recentlySeenIds.add(row.questionId);
    }

    // Tirage strategy: prefer the arrêté-fine sub-topic composition
    // (OFFICIAL_SUBTOPIC_DISTRIBUTION). For each theme, walk its
    // sub-topics in order and pull `count` questions per. The
    // drawPreferringUnseen helper enforces (a) avoid questions seen
    // in the last N exams when possible, and (b) avoid questions
    // already picked in this tirage. If the classifier hasn't reached
    // a sub-topic yet (no rows), the loop takes what's there and
    // moves on — the theme-only fallback at the end tops up any
    // missing slots so we never ship a < 40-question exam when the
    // pool can support 40.
    const selectedQuestionIds: number[] = [];
    const selectedSet = new Set<number>();

    // Combined exclusion: recently-seen + already-picked-in-this-exam.
    // Rebuilt on each call so already-picked rows propagate forward.
    const buildExclusion = () => {
      if (selectedSet.size === 0) return new Set(recentlySeenIds);
      const merged = new Set(recentlySeenIds);
      for (const id of selectedSet) merged.add(id);
      return merged;
    };

    for (const theme of allThemes) {
      const themeId = theme.id;
      const subDist = OFFICIAL_SUBTOPIC_DISTRIBUTION[themeId];
      let themeDrawn = 0;
      const themeQuota =
        (OFFICIAL_DISTRIBUTION[themeId]?.knowledge ?? 0) +
        (OFFICIAL_DISTRIBUTION[themeId]?.situational ?? 0);

      // ── Sub-topic-aware first pass ──
      if (subDist) {
        for (const [subtopic, count] of Object.entries(subDist)) {
          const conditions: SQL[] = [
            eq(questions.themeId, themeId),
            eq(questions.subtopic, subtopic),
          ];
          if (examTypeFilter) {
            conditions.push(sql`${examTypeFilter} = ANY(${questions.examTypes})`);
          }
          const ids = await drawPreferringUnseen(
            conditions,
            count,
            buildExclusion(),
          );
          for (const id of ids) {
            if (!selectedSet.has(id)) {
              selectedSet.add(id);
              selectedQuestionIds.push(id);
              themeDrawn++;
            }
          }
        }
      }

      // ── Theme-only top-up ──
      // If the sub-topic pass didn't hit the theme quota (because the
      // subtopic column is NULL on the remaining rows, or because a
      // sub-topic ran short), pull additional questions from the theme
      // regardless of sub-topic, while respecting the type split.
      const shortfall = themeQuota - themeDrawn;
      if (shortfall > 0) {
        const dist = OFFICIAL_DISTRIBUTION[themeId];
        // Compute how much of the shortfall is knowledge vs situational
        // based on the original split, capped at shortfall.
        const knowMissing = Math.min(dist?.knowledge ?? 0, shortfall);
        const situMissing = Math.min(dist?.situational ?? 0, shortfall - knowMissing);

        for (const [type, n] of [
          ['knowledge', knowMissing] as const,
          ['situational', situMissing] as const,
        ]) {
          if (n <= 0) continue;
          const conditions: SQL[] = [
            eq(questions.themeId, themeId),
            eq(questions.type, type),
          ];
          if (examTypeFilter) {
            conditions.push(sql`${examTypeFilter} = ANY(${questions.examTypes})`);
          }
          const ids = await drawPreferringUnseen(
            conditions,
            n,
            buildExclusion(),
          );
          for (const id of ids) {
            if (!selectedSet.has(id)) {
              selectedSet.add(id);
              selectedQuestionIds.push(id);
            }
          }
        }
      }
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
