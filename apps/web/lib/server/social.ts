import 'server-only';
import type {
  Friendship,
  Challenge,
  Comment,
  FriendshipStatus,
} from '@civique/shared';
import { fastifyFetch } from './api';

// ── Types ─────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  avatarUrl?: string;
  bestScore: number;
  examCount: number;
  userId?: string;
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
