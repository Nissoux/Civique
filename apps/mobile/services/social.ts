import api from './api';
import type { Friendship, Challenge, Comment, FriendshipStatus } from '@civique/shared';

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  avatarUrl?: string;
  bestScore: number;
  examCount: number;
  userId?: string;
}

export async function getLeaderboard(period: 'week' | 'month' | 'all' = 'all'): Promise<LeaderboardEntry[]> {
  const { data } = await api.get('/social/leaderboard', { params: { period } });
  return data.data;
}

export async function getFriends(): Promise<Friendship[]> {
  const { data } = await api.get('/social/friends');
  return data.data;
}

export async function requestFriend(addresseeId: string): Promise<Friendship> {
  const { data } = await api.post('/social/friends/request', { addresseeId });
  return data.data;
}

export async function respondFriend(id: number, status: FriendshipStatus): Promise<Friendship> {
  const { data } = await api.patch(`/social/friends/${id}`, { status });
  return data.data;
}

export async function getChallenges(): Promise<Challenge[]> {
  const { data } = await api.get('/social/challenges');
  return data.data;
}

export async function createChallenge(params: {
  challengedId: string;
  themeId?: number;
  questionCount?: number;
}): Promise<Challenge> {
  const { data } = await api.post('/social/challenges', params);
  return data.data;
}

export async function getComments(questionId: number): Promise<Comment[]> {
  const { data } = await api.get('/social/comments', { params: { questionId } });
  return data.data;
}

export async function postComment(params: {
  questionId: number;
  body: string;
  parentId?: number;
}): Promise<Comment> {
  const { data } = await api.post('/social/comments', params);
  return data.data;
}
