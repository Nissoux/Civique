import api from './api';
import type { ExamSession, Question } from '@civique/shared';

export interface StartExamResponse {
  session: ExamSession;
  questionIds: number[];
}

export interface SubmitAnswerPayload {
  questionId: number;
  selectedChoice: 'a' | 'b' | 'c' | 'd';
  timeSpentMs?: number;
}

export interface ExamResultsResponse {
  session: ExamSession;
  themeBreakdown: Array<{
    themeId: number;
    themeName: string;
    correct: number;
    total: number;
  }>;
  wrongAnswers: Array<{
    questionId: number;
    questionText: string;
    selectedChoice: string;
    correctChoice: string;
    correctChoiceText: string;
  }>;
}

export interface ExamHistoryResponse {
  data: ExamSession[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export async function startExam(): Promise<StartExamResponse> {
  const { data } = await api.post<{ data: StartExamResponse }>('/exams/start');
  return data.data;
}

export async function getExam(sessionId: string): Promise<{
  session: ExamSession;
  questions: Question[];
}> {
  const { data } = await api.get<{
    data: { session: ExamSession; questions: Question[] };
  }>(`/exams/${sessionId}`);
  return data.data;
}

export async function submitAnswer(
  sessionId: string,
  payload: SubmitAnswerPayload,
): Promise<{ isCorrect: boolean }> {
  const { data } = await api.post<{ data: { isCorrect: boolean } }>(
    `/exams/${sessionId}/answer`,
    payload,
  );
  return data.data;
}

export async function finishExam(sessionId: string): Promise<ExamSession> {
  const { data } = await api.post<{ data: ExamSession }>(`/exams/${sessionId}/finish`);
  return data.data;
}

export async function getExamHistory(
  limit = 10,
  offset = 0,
): Promise<ExamHistoryResponse> {
  const { data } = await api.get<ExamHistoryResponse>('/exams/history', {
    params: { limit, offset },
  });
  return data;
}

export async function getExamResults(sessionId: string): Promise<ExamResultsResponse> {
  const { data } = await api.get<{ data: ExamResultsResponse }>(
    `/exams/${sessionId}/results`,
  );
  return data.data;
}
