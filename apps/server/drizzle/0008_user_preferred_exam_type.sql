-- Adds the user's preferred exam type to the users table.
--
-- Why
-- ---
-- Today the chosen exam type (CSP / CR / NAT) lives in the cookie
-- `civique_exam_type`. That's browser-scoped: in a shared device, the
-- second person to log in inherits the first person's choice, and the
-- onboarding picker doesn't even run for them because the cookie
-- short-circuits it. Classic bug surfaced in the 2026 audit.
--
-- Persisting the preference on the user row fixes the device-sharing
-- case (each user gets their own), survives logout/login, and lets
-- the mobile app share the choice with the web via the auth/me
-- payload.
--
-- The cookie is kept as a fallback for the *not-yet-authenticated*
-- onboarding step (when the user picks an exam type before being able
-- to persist it). The post-login flow syncs the cookie into the row.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "preferred_exam_type" varchar(10);

-- Defensive CHECK — pgEnum would be nicer but we keep this column
-- flexible (e.g. a future "tcf" mention) without an enum migration.
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_preferred_exam_type_check";
ALTER TABLE "users" ADD CONSTRAINT "users_preferred_exam_type_check"
  CHECK ("preferred_exam_type" IS NULL
         OR "preferred_exam_type" IN ('csp', 'cr', 'nat'));
