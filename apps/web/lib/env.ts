// Single source of truth for runtime config.
// NEXT_PUBLIC_* vars are inlined at build time; others are server-only.

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.integrafle.fr/api';

export const env = {
  apiBaseUrl,
  isProd: process.env.NODE_ENV === 'production',
} as const;

export const COOKIE = {
  access: 'civique_access',
  refresh: 'civique_refresh',
} as const;

// Token lifetimes mirror the Fastify backend (15min access, 7d refresh).
export const COOKIE_MAX_AGE = {
  access: 60 * 15,
  refresh: 60 * 60 * 24 * 7,
} as const;
