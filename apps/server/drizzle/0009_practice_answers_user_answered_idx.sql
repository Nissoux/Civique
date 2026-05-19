-- Adds a composite index that backs the daily-quota lookup hot path.
--
-- Why
-- ---
-- middleware/quota.ts runs this on EVERY authenticated request that
-- triggers a question:
--
--   SELECT count(*) FROM practice_answers
--   WHERE user_id = $1 AND answered_at >= $2
--
-- Today the table has `practice_answers_user_question_idx (user_id,
-- question_id)` and `practice_answers_question_idx (question_id)`.
-- Neither helps the time-filtered count — PostgreSQL falls back to
-- an index scan on user_id then in-memory filter on answered_at.
-- Cheap on 100 rows per user, but the cost compounds as the SRS
-- accumulates history (1k+ rows per active user is normal).
--
-- The DESC ordering matches the typical filter direction (recent
-- first) and lets the planner use the index-only-scan path when
-- combined with `WHERE answered_at >= today`.

CREATE INDEX IF NOT EXISTS "practice_answers_user_answered_idx"
  ON "practice_answers" ("user_id", "answered_at" DESC);
