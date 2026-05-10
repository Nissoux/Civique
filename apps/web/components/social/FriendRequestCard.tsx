import { Avatar } from './Avatar';
import { respondFriendFormAction } from '@/lib/actions/social';

export interface FriendRequestCardProps {
  friendshipId: number;
  /** The user who sent the request. */
  requester: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
}

export function FriendRequestCard({
  friendshipId,
  requester,
}: FriendRequestCardProps) {
  return (
    <li
      className="
        card !rounded-2xl px-4 py-3 sm:px-5 sm:py-4
        flex items-center gap-4
      "
    >
      <Avatar
        displayName={requester.displayName}
        avatarUrl={requester.avatarUrl}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <p className="font-display text-base sm:text-lg font-medium text-aubergine truncate">
          {requester.displayName}
        </p>
        <p className="text-xs text-ink-mute font-display italic">
          Souhaite vous ajouter
        </p>
      </div>
      <div className="flex items-center gap-2">
        <form action={respondFriendFormAction}>
          <input type="hidden" name="id" value={friendshipId} />
          <input type="hidden" name="status" value="accepted" />
          <button
            type="submit"
            aria-label="Accepter la demande"
            className="
              inline-flex h-9 w-9 items-center justify-center rounded-full
              bg-success text-bone
              shadow-[0_2px_0_rgb(45_27_46)]
              hover:-translate-y-0.5 transition-transform
            "
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </form>
        <form action={respondFriendFormAction}>
          <input type="hidden" name="id" value={friendshipId} />
          <input type="hidden" name="status" value="declined" />
          <button
            type="submit"
            aria-label="Refuser la demande"
            className="
              inline-flex h-9 w-9 items-center justify-center rounded-full
              bg-fr-red text-bone
              shadow-[0_2px_0_rgb(45_27_46)]
              hover:-translate-y-0.5 transition-transform
            "
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      </div>
    </li>
  );
}
