-- SRS (Spaced Repetition System) progress table.
--
-- Why
-- ---
-- The 2026 audit flagged our flashcards as "Leitner 1-box" — i.e. the
-- "Je sais / À revoir" buttons did nothing more than mark a card in
-- localStorage. That's not really spaced repetition; it's just a binary
-- filter. To compete on pedagogy (and back the methodology page's
-- "Active Recall + répétition espacée" claim with real behaviour), we
-- implement SM-2 (the algorithm behind Anki, SuperMemo, Mochi…).
--
-- Design
-- ------
-- One table, polymorphic on item_type ('question' | 'flashcard'). This
-- avoids two parallel schemas and lets the API treat them uniformly
-- ("give me everything due now for user X"). The trade-off is no FK on
-- item_id, but flashcards live in a static TS file (not in DB) so this
-- was always going to be id-without-FK on that side; aligning question
-- progress with the same shape is the smaller-bug-surface choice.
--
-- SM-2 state per row:
--   ease_factor          float, 1.3..3.0 (init 2.5)
--   interval_days        int, days until next due (init 0)
--   consecutive_correct  int, streak of correct recalls (init 0)
--   next_review_at       timestamptz, NULL ⇒ never reviewed
--   last_reviewed_at     timestamptz, NULL ⇒ never reviewed
--   total_reviews        int, lifetime counter (init 0)
--
-- One row per (user, item) pair. ON CONFLICT DO UPDATE is the natural
-- upsert path; the API never INSERTs without the unique constraint
-- holding.

CREATE TABLE IF NOT EXISTS "srs_progress" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "item_type" varchar(20) NOT NULL CHECK ("item_type" IN ('question', 'flashcard')),
  "item_id" integer NOT NULL,
  "ease_factor" real NOT NULL DEFAULT 2.5,
  "interval_days" integer NOT NULL DEFAULT 0,
  "consecutive_correct" integer NOT NULL DEFAULT 0,
  "next_review_at" timestamp with time zone,
  "last_reviewed_at" timestamp with time zone,
  "total_reviews" integer NOT NULL DEFAULT 0,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "item_type", "item_id")
);

-- Hot path: "what's due for user X right now?"
CREATE INDEX IF NOT EXISTS "srs_progress_due_idx"
  ON "srs_progress" ("user_id", "item_type", "next_review_at")
  WHERE "next_review_at" IS NOT NULL;
