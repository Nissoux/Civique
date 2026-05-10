import 'server-only';
import type { ExamSession, Question } from '@civique/shared';
import { fastifyFetch } from './api';
import type { ExamTypeCode } from '../examType.types';

export interface StartExamResponse {
  session: ExamSession;
  questionIds: number[];
}

export interface SubmitAnswerPayload {
  questionId: number;
  selectedChoice: 'a' | 'b' | 'c' | 'd';
  timeSpentMs?: number;
}

export interface ExamWithQuestions {
  session: ExamSession;
  questions: Question[];
  /** Already-submitted answers from the server (questionId → selectedChoice). */
  existingAnswers: Record<number, 'a' | 'b' | 'c' | 'd'>;
}

export interface ThemeBreakdownItem {
  themeId: number;
  themeName: string;
  total: number;
  correct: number;
  accuracy?: number;
}

export interface WrongAnswerItem {
  questionId: number;
  questionText: string;
  selectedChoice: string;
  correctChoice: string;
  /** Some backends include the correct choice text. We tolerate either shape. */
  correctChoiceText?: string;
  choices?: { id: string; text: string }[];
  explanation?: string;
  themeId?: number;
  themeName?: string;
}

export interface ExamResultsResponse {
  session: ExamSession;
  themeBreakdown: ThemeBreakdownItem[];
  wrongAnswers: WrongAnswerItem[];
}

export interface ExamHistoryResponse {
  data: ExamSession[];
  pagination: { total: number; limit: number; offset: number };
}

interface RawExamSessionResponse {
  data: ExamSession & { questionIds: number[] };
}

interface RawGetExamResponse {
  data: ExamSession & {
    answers?: Array<{
      questionId: number;
      selectedChoice?: 'a' | 'b' | 'c' | 'd';
      isCorrect?: boolean;
      question?: Question;
    }>;
  };
}

/**
 * POST /exams/start. Creates a new exam session.
 * 409 → "exam already in progress" (caller should resume).
 * 403/429 → quota exceeded.
 */
export async function startExam(
  examType?: ExamTypeCode,
): Promise<StartExamResponse> {
  const res = await fastifyFetch<RawExamSessionResponse>(
    '/exams/start',
    {
      method: 'POST',
      body: JSON.stringify(examType ? { examType } : {}),
    },
    { auth: true },
  );
  const { questionIds, ...session } = res.data;
  return { session: session as ExamSession, questionIds };
}

/**
 * GET /exams/:sessionId. Returns the session + the full question objects
 * needed to render the session UI, plus any answers already submitted.
 */
export async function getExamSession(
  sessionId: string,
): Promise<ExamWithQuestions> {
  const res = await fastifyFetch<RawGetExamResponse>(
    `/exams/${sessionId}`,
    { method: 'GET' },
    { auth: true },
  );
  const { answers, ...session } = res.data;
  const questions: Question[] = (answers ?? [])
    .map((a) => a.question)
    .filter((q): q is Question => Boolean(q));

  const existingAnswers: Record<number, 'a' | 'b' | 'c' | 'd'> = {};
  for (const a of answers ?? []) {
    if (a.selectedChoice) {
      existingAnswers[a.questionId] = a.selectedChoice;
    }
  }

  return {
    session: session as ExamSession,
    questions,
    existingAnswers,
  };
}

/**
 * POST /exams/:sessionId/answer. Records one answer.
 * `selectedChoice` must be the ORIGINAL (unshuffled) choice id.
 */
export async function submitExamAnswer(
  sessionId: string,
  payload: SubmitAnswerPayload,
): Promise<{ isCorrect: boolean }> {
  const res = await fastifyFetch<{ data: { isCorrect: boolean } }>(
    `/exams/${sessionId}/answer`,
    { method: 'POST', body: JSON.stringify(payload) },
    { auth: true },
  );
  return res.data;
}

/** POST /exams/:sessionId/finish. Closes the session and computes the score. */
export async function finishExam(sessionId: string): Promise<ExamSession> {
  const res = await fastifyFetch<{ data: ExamSession }>(
    `/exams/${sessionId}/finish`,
    { method: 'POST', body: JSON.stringify({}) },
    { auth: true },
  );
  return res.data;
}

/** GET /exams/history. Paginated list of past sessions. */
export async function getExamHistory(
  limit = 10,
  offset = 0,
): Promise<ExamHistoryResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  return fastifyFetch<ExamHistoryResponse>(
    `/exams/history?${params.toString()}`,
    { method: 'GET' },
    { auth: true },
  );
}

/** GET /exams/:sessionId/results. Final breakdown — only after finishExam. */
export async function getExamResults(
  sessionId: string,
): Promise<ExamResultsResponse> {
  const res = await fastifyFetch<{ data: ExamResultsResponse }>(
    `/exams/${sessionId}/results`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

/**
 * Find the user's currently-active (unfinished) exam, if any.
 * Used by the start screen to offer a "Reprendre" CTA.
 */
export async function getActiveExam(): Promise<ExamSession | null> {
  try {
    const history = await getExamHistory(20);
    const active = (history.data ?? []).find((s) => !s.finishedAt);
    return active ?? null;
  } catch {
    return null;
  }
}
