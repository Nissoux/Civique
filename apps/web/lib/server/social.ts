import 'server-only';
import type {
  Friendship,
  Challenge,
  Comment,
  FriendshipStatus,
} from '@civique/shared';
import { ApiError, fastifyFetch } from './api';

// ── Types ─────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  avatarUrl?: string;
  bestScore: number;
  examCount: number;
  userId?: string;
}

/**
 * One row in the user search results returned by POST /users/search.
 * The backend excludes the current user automatically.
 */
export interface UserSearchResult {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
  email: string;
}

export type LeaderboardPeriod = 'week' | 'month' | 'all';

/**
 * Friendship enriched with user info, as returned by the Fastify API.
 * The route includes `requester` and `addressee` relations with
 * `id`, `displayName`, `avatarUrl`.
 */
export interface FriendshipWithUsers extends Friendship {
  requester: { id: string; displayName: string; avatarUrl?: string | null };
  addressee: { id: string; displayName: string; avatarUrl?: string | null };
}

/**
 * Challenge enriched with both participants + theme.
 */
export interface ChallengeWithUsers extends Challenge {
  challenger: { id: string; displayName: string; avatarUrl?: string | null };
  challenged: { id: string; displayName: string; avatarUrl?: string | null };
  theme?: { id: number; nameFr: string } | null;
}

export interface ChallengeQuestionRow {
  answerId: number;
  questionId: number;
  selectedChoice: 'a' | 'b' | 'c' | 'd' | null;
  isCorrect: boolean | null;
  questionText: string;
  choicesFr: { id: 'a' | 'b' | 'c' | 'd'; text: string }[];
  themeId: number;
}

export interface ChallengeDetail {
  challenge: ChallengeWithUsers;
  questions: ChallengeQuestionRow[];
}

export interface CommentWithUser extends Comment {
  displayName: string;
  avatarUrl?: string | null;
  replies: CommentWithUser[];
}

// ── Helpers ───────────────────────────────────────────────

function qs(params?: Record<string, unknown>): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    search.set(k, String(v));
  }
  const s = search.toString();
  return s ? `?${s}` : '';
}

// ── Leaderboard ───────────────────────────────────────────

export async function getLeaderboard(
  period: LeaderboardPeriod = 'all',
): Promise<LeaderboardEntry[]> {
  const res = await fastifyFetch<{ data: LeaderboardEntry[] }>(
    `/social/leaderboard${qs({ period })}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

// ── Friends ───────────────────────────────────────────────

export async function getFriends(): Promise<FriendshipWithUsers[]> {
  const res = await fastifyFetch<{ data: FriendshipWithUsers[] }>(
    '/social/friends',
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export async function requestFriend(addresseeId: string): Promise<Friendship> {
  const res = await fastifyFetch<{ data: Friendship }>(
    '/social/friends/request',
    { method: 'POST', body: JSON.stringify({ addresseeId }) },
    { auth: true },
  );
  return res.data;
}

export async function respondFriend(
  id: number,
  status: FriendshipStatus,
): Promise<Friendship> {
  const res = await fastifyFetch<{ data: Friendship }>(
    `/social/friends/${id}`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
    { auth: true },
  );
  return res.data;
}

// ── User search ───────────────────────────────────────────

/**
 * Search the user directory by display name or email.
 * Backend route: POST /users/search with `{ q, limit? }`.
 *
 * - Requires at least 2 characters in `q` (the backend enforces this too).
 * - Excludes the current user from results server-side.
 * - 429 responses (per-user rate limit, 10/min) are swallowed:
 *   we return an empty array and log a warning so the UI degrades gracefully.
 */
export async function searchUsers(
  q: string,
  limit?: number,
): Promise<UserSearchResult[]> {
  const trimmed = q.trim();
  if (trimmed.length < 2) return [];

  const body: { q: string; limit?: number } = { q: trimmed };
  if (typeof limit === 'number' && Number.isFinite(limit)) {
    body.limit = Math.max(1, Math.min(20, Math.floor(limit)));
  }

  try {
    const res = await fastifyFetch<{ data: UserSearchResult[] }>(
      '/users/search',
      { method: 'POST', body: JSON.stringify(body) },
      { auth: true },
    );
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 429) {
      console.warn(
        '[searchUsers] rate-limited by API (429); returning empty results',
      );
      return [];
    }
    throw err;
  }
}

// ── Challenges ────────────────────────────────────────────

export async function getChallenges(): Promise<ChallengeWithUsers[]> {
  const res = await fastifyFetch<{ data: ChallengeWithUsers[] }>(
    '/social/challenges',
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export interface CreateChallengeParams {
  challengedId: string;
  themeId?: number;
  questionCount?: number;
}

export async function createChallenge(
  params: CreateChallengeParams,
): Promise<Challenge> {
  const res = await fastifyFetch<{ data: Challenge }>(
    '/social/challenges',
    { method: 'POST', body: JSON.stringify(params) },
    { auth: true },
  );
  return res.data;
}

export async function getChallenge(id: string): Promise<ChallengeDetail> {
  const res = await fastifyFetch<{ data: ChallengeDetail }>(
    `/social/challenges/${id}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export interface SubmitChallengeAnswerParams {
  questionId: number;
  selectedChoice: 'a' | 'b' | 'c' | 'd';
  timeSpentMs?: number;
}

export interface SubmitChallengeAnswerResult {
  isCorrect: boolean;
  currentScore: number;
  totalAnswered: number;
  answerId: number;
}

export async function submitChallengeAnswer(
  challengeId: string,
  params: SubmitChallengeAnswerParams,
): Promise<SubmitChallengeAnswerResult> {
  const res = await fastifyFetch<{ data: SubmitChallengeAnswerResult }>(
    `/social/challenges/${challengeId}/answer`,
    { method: 'POST', body: JSON.stringify(params) },
    { auth: true },
  );
  return res.data;
}

/**
 * The /finish endpoint returns the full Challenge object enriched with
 * both participants, theme, plus `winnerId` and `isDraw` markers.
 */
export interface FinishChallengeResult extends ChallengeWithUsers {
  winnerId: string | null;
  isDraw: boolean;
  myScore?: number;
  totalQuestions?: number;
}

export async function finishChallenge(
  challengeId: string,
): Promise<FinishChallengeResult> {
  const res = await fastifyFetch<{ data: FinishChallengeResult }>(
    `/social/challenges/${challengeId}/finish`,
    { method: 'POST' },
    { auth: true },
  );
  return res.data;
}

// ── Comments ──────────────────────────────────────────────

export async function getComments(
  questionId: number,
): Promise<CommentWithUser[]> {
  const res = await fastifyFetch<{ data: CommentWithUser[] }>(
    `/social/comments${qs({ questionId })}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export interface PostCommentParams {
  questionId: number;
  body: string;
  parentId?: number;
}

export async function postComment(
  params: PostCommentParams,
): Promise<Comment> {
  const res = await fastifyFetch<{ data: Comment }>(
    '/social/comments',
    { method: 'POST', body: JSON.stringify(params) },
    { auth: true },
  );
  return res.data;
}
