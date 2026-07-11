'use server';

import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/server/api';
import { getCurrentExamType } from '@/lib/server/examType';
import { getQuota } from '@/lib/server/stats';
import {
  startExam,
  finishExam,
  submitExamAnswer,
  getActiveExam,
  type SubmitAnswerPayload,
} from '@/lib/server/exams';

export interface StartExamResult {
  ok: boolean;
  /** When ok=true, the page redirects to /app/exams/session/[id]; this
   *  field is informational only. */
  sessionId?: string;
  error?: string;
  /** True when 403/429 — caller should surface a paywall. */
  quotaExceeded?: boolean;
  /** True when 409 — there's already an exam in progress (id provided). */
  conflictSessionId?: string;
}

/**
 * Start a new exam OR resume the user's currently-active session.
 * Redirects to the session page on success — never returns a normal value
 * in that case. Returns an error object if start failed.
 */
export async function startExamAction(): Promise<StartExamResult> {
  const examType = await getCurrentExamType();

  // First check for an active session and resume it instead of creating new.
  const active = await getActiveExam();
  if (active) {
    redirect(`/app/exams/session/${active.id}`);
  }

  try {
    const { session } = await startExam(examType ?? undefined);
    redirect(`/app/exams/session/${session.id}`);
  } catch (err) {
    // redirect() throws a special internal error — let it propagate.
    if (
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof (err as { digest?: unknown }).digest === 'string' &&
      (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw err;
    }

    if (err instanceof ApiError) {
      if (err.status === 409) {
        // Server says exam already running — try to resolve it.
        const refetched = await getActiveExam();
        if (refetched) {
          redirect(`/app/exams/session/${refetched.id}`);
        }
        return {
          ok: false,
          error: 'Vous avez déjà un examen en cours.',
        };
      }
      if (err.status === 403 || err.status === 429) {
        return {
          ok: false,
          error:
            'Limite atteinte. Passez à Civique Plein pour des examens illimités.',
          quotaExceeded: true,
        };
      }
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: "Impossible de démarrer l'examen." };
  }
}

/**
 * Form-action variant of startExamAction. Suitable for `<form action={...}>`,
 * which requires a function returning void / Promise<void>.
 *
 * On success, the underlying action redirects (throws NEXT_REDIRECT). On
 * non-redirect failure, we redirect to /app/exams with an error param so the
 * page can surface a message.
 */
export async function startExamFormAction(): Promise<void> {
  const result = await startExamAction();
  // If we get here, no redirect happened — must be an error case.
  if (!result.ok) {
    if (result.quotaExceeded) {
      redirect('/app/settings/subscription?from=exam-quota');
    }
    redirect('/app/exams?error=start');
  }
}

export interface SubmitAnswerResult {
  ok: boolean;
  isCorrect?: boolean;
  error?: string;
}

/**
 * Record a single answer for the current exam session.
 * `selectedChoice` MUST be the original (unshuffled) choice id.
 */
export async function submitExamAnswerAction(
  sessionId: string,
  payload: SubmitAnswerPayload,
): Promise<SubmitAnswerResult> {
  try {
    const { isCorrect } = await submitExamAnswer(sessionId, payload);
    return { ok: true, isCorrect };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Erreur réseau' };
  }
}

export interface FinishExamResult {
  ok: boolean;
  error?: string;
}

/** Finalize the exam. Redirects to results. */
export async function finishExamAction(
  sessionId: string,
): Promise<FinishExamResult> {
  try {
    await finishExam(sessionId);
  } catch (err) {
    // If the server says "already finished" (400), still go to results.
    if (err instanceof ApiError && err.status === 400) {
      redirect(`/app/exams/results/${sessionId}`);
    }
    if (
      err &&
      typeof err === 'object' &&
      'digest' in err &&
      typeof (err as { digest?: unknown }).digest === 'string' &&
      (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw err;
    }
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: "Impossible de terminer l'examen." };
  }

  redirect(`/app/exams/results/${sessionId}`);
}

/**
 * Abandon an in-progress exam (server-side: just call /finish so it counts).
 * Used by the start screen "Abandonner" button.
 */
export async function abandonExamAction(
  sessionId: string,
): Promise<FinishExamResult> {
  try {
    await finishExam(sessionId);
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError) {
      // "Already finished" is fine — treat as success.
      if (err.status === 400) return { ok: true };
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: "Impossible d'abandonner l'examen." };
  }
}

/**
 * Abandon the active session (if any), then start a fresh exam.
 *
 * Wired to the « Lancer un nouveau » button of the hub's ResumeBlock.
 * Without the abandon step, startExamAction's resume-first check — and the
 * server's 409 guard on POST /exams/start — both bounce the user back to
 * the very session they are trying to leave, so "restart" silently served
 * the old exam with its old questions and answers.
 *
 * The abandoned session is finished with whatever answers it has: it counts
 * as an attempt in the history, and its questions feed the anti-repetition
 * memory so the fresh draw prefers unseen questions.
 */
export async function restartExamFormAction(): Promise<void> {
  const active = await getActiveExam();
  if (active) {
    // Quota pre-check BEFORE abandoning. The weekly free quota counts
    // sessions *started*, so a free user out of quota would otherwise
    // lose their resumable session AND get the paywall — double
    // penalty. Out of quota → paywall with the session intact.
    // Fails open: if the quota fetch errors, proceed — worst case the
    // start hits 429 after abandon (degraded, but the button did what
    // it promised).
    const quota = await getQuota().catch(() => null);
    if (
      quota &&
      !quota.isPremium &&
      quota.weekly.limit !== -1 &&
      quota.weekly.used >= quota.weekly.limit
    ) {
      redirect('/app/settings/subscription?from=exam-quota');
    }

    // Tolerates "already finished" (400). On a genuine server error the
    // follow-up start hits the 409 path and resumes — degraded but safe.
    await abandonExamAction(active.id);
  }
  await startExamFormAction();
}
