import 'server-only';
import type { Question, Language } from '@civique/shared';
import { fastifyFetch } from './api';

export interface GetQuestionsParams {
  themeId?: number;
  type?: string;
  examType?: string;
  lang?: Language;
  limit?: number;
  offset?: number;
}

export interface GetRandomQuestionsParams {
  count?: number;
  themeId?: number;
  examType?: string;
  lang?: Language;
}

interface QuestionsResponse {
  data: Question[];
  total: number;
}

function buildQuery(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function getQuestions(
  params: GetQuestionsParams = {},
): Promise<QuestionsResponse> {
  return fastifyFetch<QuestionsResponse>(
    `/questions${buildQuery(params)}`,
    { method: 'GET' },
    { auth: true },
  );
}

export async function getRandomQuestions(
  params: GetRandomQuestionsParams = {},
): Promise<Question[]> {
  const res = await fastifyFetch<{ data: Question[] }>(
    `/questions/random${buildQuery(params)}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export async function getQuestionsByIds(
  ids: number[],
  lang?: Language,
): Promise<Question[]> {
  const res = await fastifyFetch<{ data: Question[] }>(
    `/questions${buildQuery({ ids: ids.join(','), lang, limit: ids.length })}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

/** Cheap helper: returns total questions for a theme without fetching them. */
export async function getThemeQuestionCount(
  themeId: number,
  examType?: string,
): Promise<number> {
  try {
    const res = await getQuestions({ themeId, examType, limit: 1 });
    return res.total;
  } catch {
    return 0;
  }
}
