import { FastifyInstance } from 'fastify';
import { sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { questions } from '../../db/schema.js';

/**
 * Public, no-auth endpoints exposed for landing-page-level signals.
 *
 * Kept deliberately small. Anything that requires per-user context goes
 * elsewhere — these are read-only aggregates that are safe to serve to
 * crawlers / unauthenticated visitors.
 *
 * Currently:
 *   GET /api/public/coverage  — reports how many of our questions are
 *     traceable to the Ministry of the Interior's official pools (CSP,
 *     CR, NAT). The /methodologie page surfaces this to back the
 *     compliance claim with a live number rather than a frozen quote.
 */
export default async function publicRoutes(app: FastifyInstance) {
  app.get('/coverage', async () => {
    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        official: sql<number>`count(*) FILTER (WHERE ${questions.isOfficial})::int`,
        official_csp: sql<number>`count(*) FILTER (WHERE ${questions.officialCspOrder} IS NOT NULL)::int`,
        official_cr: sql<number>`count(*) FILTER (WHERE ${questions.officialCrOrder} IS NOT NULL)::int`,
        official_nat: sql<number>`count(*) FILTER (WHERE ${questions.officialNatOrder} IS NOT NULL)::int`,
      })
      .from(questions);

    const pct = stats.total > 0
      ? Math.round((stats.official * 100) / stats.total)
      : 0;

    return {
      data: {
        ...stats,
        official_pct: pct,
        legal_reference: 'Arrêté du 10 octobre 2025 (JORFTEXT000052381620)',
        applicable_from: '2026-01-01',
      },
    };
  });
}
