'use server';

import { revalidatePath } from 'next/cache';
import type { FriendshipStatus } from '@civique/shared';
import { ApiError } from '@/lib/server/api';
import {
  requestFriend,
  respondFriend,
  createChallenge,
  postComment,
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
