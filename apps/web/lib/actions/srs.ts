'use server';

import { ApiError, fastifyFetch } from '@/lib/server/api';

/**
 * Server actions for the SM-2 SRS backend.
 *
 * Why server actions instead of a client fetch?
 * ---------------------------------------------
 * The Fastify API expects a JWT cookie that's httpOnly — the client
 * can't attach it itself. Going through a server action keeps the
 * cookie on the server side, lets us swallow non-fatal errors silently
 * (a failed review shouldn't break the user's flashcard flow), and
 * gives us one place to add retry/observability if we want it later.
 */

export type SrsFeedback = 'lapse' | 'hard' | 'good' | 'easy';
export type SrsItemType = 'question' | 'flashcard';

interface SrsState {
  easeFactor: number;
  intervalDays: number;
  consecutiveCorrect: number;
  totalReviews: number;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
}

/**
 * Record a review of a card or question. Returns the new SRS state on
 * success, or `null` on any failure — the caller should fall back to
 * the local-only behaviour so the UX stays smooth.
 */
export async function submitSrsReview(
  itemType: SrsItemType,
  itemId: number,
  feedback: SrsFeedback,
): Promise<SrsState | null> {
  try {
    const res = await fastifyFetch<{ data: SrsState }>(
      '/srs/review',
      {
        method: 'POST',
        body: JSON.stringify({ itemType, itemId, feedback }),
      },
      { auth: true },
    );
    return res.data;
  } catch (err) {
    // Best-effort: SRS state is a nice-to-have, the user's local
    // progress is the source of truth for the in-session experience.
    // We log on the server in case it's an outage, but never throw.
    if (err instanceof ApiError) {
      console.warn(
        `[srs] review failed (${err.status}) for ${itemType}#${itemId}`,
      );
    } else {
      console.warn(`[srs] review threw for ${itemType}#${itemId}`, err);
    }
    return null;
  }
}

interface SrsStats {
  flashcards: { total: number; due: number; mature: number };
  questions: { total: number; due: number; mature: number };
  as_of: string;
}

/**
 * Fetch the user's aggregate SRS counters — used by the dashboard
 * "X cartes à réviser" widget. Returns null on failure, the caller
 * hides the widget.
 */
export async function fetchSrsStats(): Promise<SrsStats | null> {
  try {
    const res = await fastifyFetch<{ data: SrsStats }>(
      '/srs/stats',
      { method: 'GET' },
      { auth: true },
    );
    return res.data;
  } catch {
    return null;
  }
}

/**
 * Fetch the ids of items whose next_review_at is in the past. Used by
 * /app/flashcards's "Révisions du jour" mode to filter the deck down
 * to what's actually due.
 */
export async function fetchDueIds(
  itemType: SrsItemType,
  limit = 50,
): Promise<number[]> {
  try {
    const res = await fastifyFetch<{ data: { dueIds: number[] } }>(
      `/srs/due?itemType=${itemType}&limit=${limit}`,
      { method: 'GET' },
      { auth: true },
    );
    return res.data.dueIds;
  } catch {
    return [];
  }
}
