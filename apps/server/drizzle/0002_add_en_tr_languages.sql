-- Extend the `language` PgEnum with English and Turkish.
--
-- NOTE: `ALTER TYPE ... ADD VALUE` cannot run inside a transaction block. The
-- Drizzle migrator (via node-postgres) issues each `--> statement-breakpoint`
-- chunk in its own simple query, which Postgres accepts at the top level for
-- ENUM mutations. If you ever apply this manually inside `psql`, run each line
-- on its own (or `\set AUTOCOMMIT on`).
ALTER TYPE "public"."language" ADD VALUE IF NOT EXISTS 'en';--> statement-breakpoint
ALTER TYPE "public"."language" ADD VALUE IF NOT EXISTS 'tr';
