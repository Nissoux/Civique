import api from './api';
import type { Question, Language } from '@civique/shared';

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

export async function getQuestions(params: GetQuestionsParams = {}): Promise<{
  data: Question[];
  total: number;
}> {
  const { data } = await api.get<{ data: Question[]; total: number }>('/questions', {
    params,
  });
  return data;
}

export async function getRandomQuestions(params: GetRandomQuestionsParams = {}): Promise<Question[]> {
  const { data } = await api.get<{ data: Question[] }>('/questions/random', {
    params,
  });
  return data.data;
}

export async function getQuestionsByIds(ids: number[], lang?: Language): Promise<Question[]> {
  const { data } = await api.get<{ data: Question[] }>('/questions', {
    params: { ids: ids.join(','), lang, limit: ids.length },
  });
  return data.data;
}

export async function getSeriesQuestions(
  themeId: number,
  series: number,
  examType?: string,
  lang?: Language,
): Promise<Question[]> {
  const offset = (series - 1) * 20;
  const { data } = await api.get<{ data: Question[]; total: number }>('/questions', {
    params: { themeId, examType, lang, limit: 20, offset },
  });
  return data.data;
}

export async function getQuestion(id: number, lang?: Language): Promise<Question> {
  const { data } = await api.get<{ data: Question }>(`/questions/${id}`, {
    params: lang ? { lang } : undefined,
  });
  return data.data;
}
