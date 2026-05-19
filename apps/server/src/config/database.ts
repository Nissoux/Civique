import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from './env.js';
import * as schema from '../db/schema.js';

/**
 * PostgreSQL connection pool config.
 *
 * - `max: 20` — Fastify is single-process here; 20 keepalive conns
 *   covers our typical concurrency (~50 req/s sustained) without
 *   overloading the local PG (default max_connections = 100).
 * - `idleTimeoutMillis: 30s` — drop idle conns rather than keeping a
 *   pool of 20 always-warm during low-traffic windows.
 * - `connectionTimeoutMillis: 5s` — refuse to wait forever if PG is
 *   saturated; surfaces as a 500 to the user but doesn't hang the
 *   request thread.
 * - `statement_timeout: 10s` (PG-side via options) — kills a runaway
 *   query rather than holding a conn indefinitely. Tied tightly to
 *   our checkout 10s timeout so they fail in the same window.
 * - `query_timeout: 10s` (node-pg-side) — same idea but cancels
 *   client-side without waiting on PG.
 */
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  query_timeout: 10_000,
  statement_timeout: 10_000,
});

export const db = drizzle(pool, { schema });

export async function closeDatabase() {
  await pool.end();
}
