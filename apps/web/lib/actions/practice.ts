'use server';

import { ApiError } from '@/lib/server/api';
import { recordPractice, type RecordPracticePayload } from '@/lib/server/stats';

export interface PracticeAnswerResult {
  ok: boolean;
  isCorrect?: boolean;
  error?: string;
  quotaExceeded?: boolean;
}

export async function recordPracticeAnswerAction(
  payload: RecordPracticePayload,
): Promise<PracticeAnswerResult> {
  try {
    const { isCorrect } = await recordPractice(payload);
    return { ok: true, isCorrect };
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 429) {
        return { ok: false, error: 'Quota dépassé', quotaExceeded: true };
      }
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Une erreur est survenue.' };
  }
}
