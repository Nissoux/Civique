'use server';

import { revalidatePath } from 'next/cache';
import type { FriendshipStatus } from '@civique/shared';
import { ApiError } from '@/lib/server/api';
import { getCurrentUser } from '@/lib/server/me';
import {
  requestFriend,
  respondFriend,
  searchUsers,
  createChallenge,
  postComment,
  getComments,
  submitChallengeAnswer,
  finishChallenge,
  type CommentWithUser,
  type UserSearchResult,
  type FinishChallengeResult,
} from '@/lib/server/social';
import type { FormState } from '@/lib/auth-types';

// ── Friend requests ──────────────────────────────────────

export interface FriendActionResult {
  ok: boolean;
  error?: string;
  message?: string;
}

/**
 * Send a friend request by user UUID. Returns ok:false with userMessage
 * for known errors (already friends, user not found, …).
 */
export async function requestFriendAction(
  addresseeId: string,
): Promise<FriendActionResult> {
  if (!addresseeId || typeof addresseeId !== 'string') {
    return { ok: false, error: 'Identifiant manquant.' };
  }
  try {
    await requestFriend(addresseeId.trim());
  } catch (err) {
    if (err instanceof ApiError) {
      // Common shaped errors:
      //   404 → user not found
      //   409 → already friends / pending
      //   400 → cannot friend self
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: "Impossible d'envoyer la demande." };
  }

  revalidatePath('/app/social/friends');
  return { ok: true, message: 'Demande envoyée.' };
}

/**
 * Form-action variant for use in `<form action={...}>` rows
 * with an `addresseeId` hidden input.
 */
export async function requestFriendFormAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = formData.get('addresseeId');
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return { error: 'Identifiant requis.' };
  }
  const result = await requestFriendAction(raw.trim());
  if (!result.ok) return { error: result.error };
  return { message: result.message ?? 'Demande envoyée.' };
}

/**
 * Accept or decline a friend request by row id.
 */
export async function respondFriendAction(
  id: number,
  status: FriendshipStatus,
): Promise<FriendActionResult> {
  if (!Number.isFinite(id) || id <= 0) {
    return { ok: false, error: 'Demande invalide.' };
  }
  if (status !== 'accepted' && status !== 'declined') {
    return { ok: false, error: 'Statut invalide.' };
  }
  try {
    await respondFriend(id, status);
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Impossible de répondre à la demande.' };
  }
  revalidatePath('/app/social/friends');
  return { ok: true };
}

/**
 * Form-action wrappers for accept/decline buttons inside <form>.
 * They expect hidden inputs `id` and `status`.
 */
export async function respondFriendFormAction(formData: FormData): Promise<void> {
  const idRaw = formData.get('id');
  const statusRaw = formData.get('status');
  const id = typeof idRaw === 'string' ? parseInt(idRaw, 10) : NaN;
  const status =
    statusRaw === 'accepted' || statusRaw === 'declined' ? statusRaw : null;
  if (!status || !Number.isFinite(id)) return;
  await respondFriendAction(id, status);
}

// ── User search ───────────────────────────────────────────

export type SearchUsersResult =
  | { ok: true; results: UserSearchResult[] }
  | { ok: false; error: string };

/**
 * Search users by name or email for the "add friend" UI.
 *
 * - Returns an empty list when `q` is too short (< 2 chars) — the UI
 *   uses this as the "idle" state.
 * - Filters out the current user defensively (the backend already does).
 * - Returns `{ ok: false, error }` for auth or unexpected failures.
 *   Rate-limited responses (429) are converted to an empty list by
 *   `searchUsers` itself, so the UI just shows "no results".
 */
export async function searchUsersAction(q: string): Promise<SearchUsersResult> {
  const trimmed = (q ?? '').trim();
  if (trimmed.length < 2) {
    return { ok: true, results: [] };
  }

  const me = await getCurrentUser();
  if (!me) {
    return { ok: false, error: 'Vous devez être connecté pour rechercher.' };
  }

  try {
    const results = await searchUsers(trimmed);
    const filtered = results.filter((r) => r.id !== me.id);
    return { ok: true, results: filtered };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Recherche indisponible pour le moment.' };
  }
}

// ── Challenges ────────────────────────────────────────────

export interface CreateChallengeResult {
  ok: boolean;
  error?: string;
  challengeId?: string;
}

export async function createChallengeAction(
  friendId: string,
  options: { themeId?: number; questionCount?: number } = {},
): Promise<CreateChallengeResult> {
  if (!friendId || typeof friendId !== 'string') {
    return { ok: false, error: 'Ami non sélectionné.' };
  }
  try {
    const challenge = await createChallenge({
      challengedId: friendId.trim(),
      themeId: options.themeId,
      questionCount: options.questionCount,
    });
    revalidatePath('/app/social/challenges');
    return { ok: true, challengeId: challenge.id };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Impossible de créer le défi.' };
  }
}

/**
 * Form-action variant: reads `friendId` from the FormData.
 */
export async function createChallengeFormAction(formData: FormData): Promise<void> {
  const raw = formData.get('friendId');
  if (typeof raw !== 'string' || raw.trim().length === 0) return;
  await createChallengeAction(raw.trim());
}

/**
 * Stub for the "accept challenge" flow — currently the backend has no
 * dedicated endpoint to accept (it auto-activates on first answer). Kept
 * for API symmetry with the spec.
 */
export async function acceptChallengeAction(
  _id: string,
): Promise<CreateChallengeResult> {
  return {
    ok: true,
    error:
      'Les défis deviennent actifs dès que vous répondez à la première question.',
  };
}

// ── Challenge play (answer + finish) ──────────────────────

export interface SubmitChallengeAnswerActionParams {
  challengeId: string;
  questionId: number;
  selectedChoice: 'a' | 'b' | 'c' | 'd';
  timeSpentMs?: number;
}

export interface SubmitChallengeAnswerActionResult {
  ok: boolean;
  error?: string;
  isCorrect?: boolean;
  currentScore?: number;
  totalAnswered?: number;
}

export async function submitChallengeAnswerAction(
  params: SubmitChallengeAnswerActionParams,
): Promise<SubmitChallengeAnswerActionResult> {
  if (!params.challengeId || typeof params.challengeId !== 'string') {
    return { ok: false, error: 'Défi introuvable.' };
  }
  if (!Number.isFinite(params.questionId) || params.questionId <= 0) {
    return { ok: false, error: 'Question invalide.' };
  }
  if (!['a', 'b', 'c', 'd'].includes(params.selectedChoice)) {
    return { ok: false, error: 'Choix invalide.' };
  }
  try {
    const res = await submitChallengeAnswer(params.challengeId, {
      questionId: params.questionId,
      selectedChoice: params.selectedChoice,
      timeSpentMs: params.timeSpentMs,
    });
    return {
      ok: true,
      isCorrect: res.isCorrect,
      currentScore: res.currentScore,
      totalAnswered: res.totalAnswered,
    };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Impossible d’enregistrer la réponse.' };
  }
}

export interface FinishChallengeActionResult {
  ok: boolean;
  error?: string;
  challenge?: FinishChallengeResult;
}

export async function finishChallengeAction(
  challengeId: string,
): Promise<FinishChallengeActionResult> {
  if (!challengeId || typeof challengeId !== 'string') {
    return { ok: false, error: 'Défi introuvable.' };
  }
  try {
    const challenge = await finishChallenge(challengeId);
    revalidatePath(`/app/social/challenges/${challengeId}`);
    revalidatePath('/app/social/challenges');
    return { ok: true, challenge };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Impossible de terminer le défi.' };
  }
}

// ── Comments ──────────────────────────────────────────────

export interface PostCommentResult {
  ok: boolean;
  error?: string;
}

export async function postCommentAction(
  questionId: number,
  text: string,
  parentId?: number,
): Promise<PostCommentResult> {
  if (!Number.isFinite(questionId) || questionId <= 0) {
    return { ok: false, error: 'Question inconnue.' };
  }
  const trimmed = (text ?? '').trim();
  if (trimmed.length === 0) {
    return { ok: false, error: 'Le commentaire ne peut pas être vide.' };
  }
  if (trimmed.length > 2000) {
    return { ok: false, error: 'Le commentaire est trop long (max 2000).' };
  }
  try {
    await postComment({ questionId, body: trimmed, parentId });
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Impossible de publier le commentaire.' };
  }
  return { ok: true };
}

export interface FetchCommentsResult {
  ok: boolean;
  error?: string;
  comments?: CommentWithUser[];
}

/**
 * Fetch the threaded comment list for a question. Used by the in-session
 * feedback panel after the user answers.
 */
export async function fetchQuestionCommentsAction(
  questionId: number,
): Promise<FetchCommentsResult> {
  if (!Number.isFinite(questionId) || questionId <= 0) {
    return { ok: false, error: 'Question inconnue.' };
  }
  try {
    const comments = await getComments(questionId);
    return { ok: true, comments };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Impossible de charger les commentaires.' };
  }
}
