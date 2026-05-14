import { FastifyInstance } from 'fastify';
import { sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { authGuard } from '../../middleware/auth.js';

/**
 * Adaptive-learning recommendations.
 *
 *   GET /api/learning/recommendations
 *     Returns the per-(theme, subtopic) accuracy for the current user,
 *     sorted by weakness so the dashboard can surface "you're failing
 *     X — go review fiche Y" hints.
 *
 *     Considers both practice_answers (training mode) and exam_answers
 *     (examen blanc): both are valid evidence of where the user
 *     struggles. Same weight — we don't yet have signal that one
 *     surface predicts the real exam better than the other.
 *
 * Returned shape:
 *   {
 *     theme_weaknesses: [
 *       { theme_id, theme_name, attempts, correct, accuracy, severity }
 *     ],
 *     subtopic_weaknesses: [
 *       { theme_id, subtopic, attempts, correct, accuracy, severity }
 *     ],
 *     as_of: <iso>
 *   }
 *
 * `severity` is a 0-1 score: weakest sub-topics with the most evidence
 * rise to the top. The dashboard takes the first 1-3 and renders the
 * recommendation card.
 */

const MIN_ATTEMPTS = 3; // Don't recommend on flukes; need at least 3 attempts.

export default async function learningRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  app.get('/recommendations', async (request, reply) => {
    const userId = request.currentUser!.id;

    // Union the two answer tables. Each row contributes:
    //   - theme_id     (via questions join)
    //   - subtopic     (via questions join, may be null)
    //   - is_correct
    //
    // Aggregation is per (theme, subtopic) for sub-topic granularity,
    // and per theme for the higher-level rollup. Both are computed in
    // a single SQL pass to keep the API one round-trip.

    interface ThemeStatRow {
      theme_id: number;
      theme_name: string;
      attempts: number;
      correct: number;
    }
    const themeRes = await db.execute(sql`
      WITH all_answers AS (
        SELECT pa.is_correct, q.theme_id
        FROM practice_answers pa
        JOIN questions q ON q.id = pa.question_id
        WHERE pa.user_id = ${userId}
        UNION ALL
        SELECT ea.is_correct, q.theme_id
        FROM exam_answers ea
        JOIN questions q ON q.id = ea.question_id
        JOIN exam_sessions es ON es.id = ea.session_id
        WHERE es.user_id = ${userId} AND ea.is_correct IS NOT NULL
      )
      SELECT
        aa.theme_id,
        t.name_fr AS theme_name,
        COUNT(*)::int AS attempts,
        COUNT(*) FILTER (WHERE aa.is_correct)::int AS correct
      FROM all_answers aa
      JOIN themes t ON t.id = aa.theme_id
      GROUP BY aa.theme_id, t.name_fr
      HAVING COUNT(*) >= ${MIN_ATTEMPTS}
      ORDER BY (COUNT(*) FILTER (WHERE aa.is_correct))::float / NULLIF(COUNT(*), 0) ASC
    `);

    interface SubtopicStatRow {
      theme_id: number;
      subtopic: string;
      attempts: number;
      correct: number;
    }
    const subtopicRes = await db.execute(sql`
      WITH all_answers AS (
        SELECT pa.is_correct, q.theme_id, q.subtopic
        FROM practice_answers pa
        JOIN questions q ON q.id = pa.question_id
        WHERE pa.user_id = ${userId} AND q.subtopic IS NOT NULL
        UNION ALL
        SELECT ea.is_correct, q.theme_id, q.subtopic
        FROM exam_answers ea
        JOIN questions q ON q.id = ea.question_id
        JOIN exam_sessions es ON es.id = ea.session_id
        WHERE es.user_id = ${userId}
          AND ea.is_correct IS NOT NULL
          AND q.subtopic IS NOT NULL
      )
      SELECT
        aa.theme_id,
        aa.subtopic,
        COUNT(*)::int AS attempts,
        COUNT(*) FILTER (WHERE aa.is_correct)::int AS correct
      FROM all_answers aa
      GROUP BY aa.theme_id, aa.subtopic
      HAVING COUNT(*) >= ${MIN_ATTEMPTS}
      ORDER BY (COUNT(*) FILTER (WHERE aa.is_correct))::float / NULLIF(COUNT(*), 0) ASC
    `);

    // Severity score in [0, 1]: combine inverted accuracy with a
    // confidence bump from attempts (so a sub-topic with 30 attempts
    // at 40% beats one with 4 attempts at 30% — we trust the larger
    // sample more). The shape: severity = (1 - accuracy) * confidence.
    function scoreSeverity(attempts: number, correct: number): number {
      const accuracy = attempts > 0 ? correct / attempts : 0;
      // Confidence rises with attempts, asymptotic to 1.0 at ~30 reviews.
      const confidence = 1 - Math.exp(-attempts / 12);
      return (1 - accuracy) * confidence;
    }

    // drizzle's db.execute returns the raw pg QueryResult; the rows
    // we care about live on .rows. Casting through unknown so the
    // call sites stay shape-typed without fighting the lib's looser
    // generic.
    const themeRows = (themeRes as unknown as { rows: ThemeStatRow[] }).rows.map((r) => ({
      theme_id: r.theme_id,
      theme_name: r.theme_name,
      attempts: Number(r.attempts),
      correct: Number(r.correct),
      accuracy:
        Number(r.attempts) > 0
          ? Number(((Number(r.correct) / Number(r.attempts)) * 100).toFixed(1))
          : 0,
      severity: Number(scoreSeverity(Number(r.attempts), Number(r.correct)).toFixed(3)),
    }));

    const subtopicRows = (subtopicRes as unknown as { rows: SubtopicStatRow[] }).rows.map((r) => ({
      theme_id: r.theme_id,
      subtopic: r.subtopic,
      attempts: Number(r.attempts),
      correct: Number(r.correct),
      accuracy:
        Number(r.attempts) > 0
          ? Number(((Number(r.correct) / Number(r.attempts)) * 100).toFixed(1))
          : 0,
      severity: Number(scoreSeverity(Number(r.attempts), Number(r.correct)).toFixed(3)),
    }));

    return reply.send({
      data: {
        theme_weaknesses: themeRows.sort((a, b) => b.severity - a.severity),
        subtopic_weaknesses: subtopicRows.sort((a, b) => b.severity - a.severity),
        min_attempts: MIN_ATTEMPTS,
        as_of: new Date().toISOString(),
      },
    });
  });
}
