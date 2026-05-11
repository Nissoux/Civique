import { Avatar } from './Avatar';
import { ChallengeButton } from './ChallengeButton';

export interface FriendCardProps {
  /** Friendship row id (used for any future "remove friend" action). */
  friendshipId: number;
  /** The other user (not the current viewer). */
  friend: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <li
      className="
        card !rounded-2xl px-4 py-3 sm:px-5 sm:py-4
        flex items-center gap-4
      "
    >
      <Avatar
        displayName={friend.displayName}
        avatarUrl={friend.avatarUrl}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <p className="font-display text-base sm:text-lg font-medium text-aubergine truncate">
          {friend.displayName}
        </p>
        <p className="text-xs text-ink-mute font-mono truncate" title={friend.id}>
          {friend.id.slice(0, 8)}…
        </p>
      </div>
      <ChallengeButton friendId={friend.id} />
    </li>
  );
}
