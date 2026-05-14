-- Adds the official-pool flags to the questions table.
--
-- Why
-- ---
-- The 2026 audit revealed that we couldn't tell which of our 610 questions
-- are textually part of the Ministry of the Interior's official knowledge
-- pools (CSP / CR / NAT) vs which we wrote ourselves as practice variants.
-- That distinction matters for three reasons:
--
--   1. Compliance / marketing — we can credibly say "X% of our pool is
--      drawn from the arrêté du 10 octobre 2025 official list".
--   2. Exam blanc selection — we may want to bias the random draw toward
--      questions that have an official_csp_order set, so the simulation
--      stays close to what the real test pulls from.
--   3. Mention differentiation — a CSP candidate shouldn't get questions
--      that only exist in the NAT pool.
--
-- The exam_types column already exists and tags each question with the
-- mentions it can appear under. The new columns are *narrower*: they
-- record the *index* of the question inside the official Min Intérieur
-- list for each mention, so we can trace each row back to its source on
-- formation-civique.interieur.gouv.fr / immigration.interieur.gouv.fr.
--
-- is_official is a derived flag (true if any official_*_order is set)
-- but we keep it as a stored column for cheap filtering.

ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "is_official" boolean NOT NULL DEFAULT false;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "official_csp_order" integer;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "official_cr_order" integer;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "official_nat_order" integer;
CREATE INDEX IF NOT EXISTS "questions_is_official_idx" ON "questions" ("is_official");
