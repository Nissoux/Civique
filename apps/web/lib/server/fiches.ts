import 'server-only';
import type { Fiche, Language } from '@civique/shared';
import { fastifyFetch, ApiError } from './api';

export interface GetFichesParams {
  themeId?: number;
  isPremium?: boolean;
  lang?: Language;
  limit?: number;
  offset?: number;
  [key: string]: unknown;
}

interface FichesListResponse {
  data: Fiche[];
  total: number;
}

interface FicheItemResponse {
  data: Fiche;
}

function buildQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Fetch fiches list with optional filters.
 * Mirrors mobile contract: GET /fiches?themeId&isPremium&lang&limit&offset
 */
export async function getFiches(
  params: GetFichesParams = {},
): Promise<Fiche[]> {
  const res = await fastifyFetch<FichesListResponse>(
    `/fiches${buildQuery(params)}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

/**
 * Fetch a single fiche by id, optionally translated.
 * Returns null on 404 so callers can render a not-found view.
 */
export async function getFiche(
  id: number,
  lang?: Language,
): Promise<Fiche | null> {
  try {
    const res = await fastifyFetch<FicheItemResponse>(
      `/fiches/${id}${buildQuery({ lang })}`,
      { method: 'GET' },
      { auth: true },
    );
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

/**
 * Fetch all fiches for a given user language and group them by theme.
 * Result keys are themeId, values are fiches in displayOrder.
 */
export async function getFichesByTheme(
  lang?: Language,
): Promise<Record<number, Fiche[]>> {
  const all = await getFiches({ lang, limit: 100 });
  const grouped: Record<number, Fiche[]> = {};
  for (const f of all) {
    if (!grouped[f.themeId]) grouped[f.themeId] = [];
    grouped[f.themeId].push(f);
  }
  return grouped;
}
