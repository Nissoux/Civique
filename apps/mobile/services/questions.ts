import api from './api';
import type { Question, Language } from '@civique/shared';

export interface GetQuestionsParams {
  themeId?: number;
  type?: string;
  lang?: Language;
  limit?: number;
  offset?: number;
}

export interface GetRandomQuestionsParams {
  count?: number;
  themeId?: number;
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

export async function getQuestion(id: number, lang?: Language): Promise<Question> {
  const { data } = await api.get<{ data: Question }>(`/questions/${id}`, {
    params: lang ? { lang } : undefined,
  });
  return data.data;
}
