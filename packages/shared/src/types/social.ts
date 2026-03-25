export type FriendshipStatus = 'pending' | 'accepted' | 'declined';
export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'declined';

export interface Friendship {
  id: number;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengedId: string;
  themeId?: number;
  questionCount: number;
  status: ChallengeStatus;
  challengerScore?: number;
  challengedScore?: number;
  createdAt: string;
  expiresAt?: string;
}

export interface Comment {
  id: number;
  userId: string;
  questionId: number;
  parentId?: number;
  body: string;
  createdAt: string;
}
