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
    choices: Array<{ id: string; text: string }>;
    selectedChoice: string;
    correctChoice: string;
    correctChoiceText: string;
    explanation?: string;
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

export async function startExam(examType?: string): Promise<StartExamResponse> {
  const { data } = await api.post<{ data: ExamSession & { questionIds: number[] } }>('/exams/start', examType ? { examType } : {});
  const { questionIds, ...session } = data.data;
  return { session: session as ExamSession, questionIds };
}

export async function getExam(sessionId: string): Promise<{
  session: ExamSession;
  questions: Question[];
  existingAnswers: Record<number, string>;
}> {
  const { data } = await api.get<{
    data: ExamSession & { answers: Array<{ question: Question; questionId: number; selectedChoice: string | null }> };
  }>(`/exams/${sessionId}`);
  const raw = data.data;
  const { answers, ...session } = raw;
  const questions = (answers || []).map((a) => a.question).filter(Boolean);
  const existingAnswers: Record<number, string> = {};
  (answers || []).forEach((a) => {
    if (a.selectedChoice) {
      existingAnswers[a.questionId] = a.selectedChoice;
    }
  });
  return { session: session as ExamSession, questions, existingAnswers };
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
  const { data } = await api.post<{ data: ExamSession }>(`/exams/${sessionId}/finish`, {});
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
