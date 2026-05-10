import { Avatar } from './Avatar';
import type { LeaderboardEntry } from '@/lib/server/social';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isMe: boolean;
}

const MEDAL_COLORS: Record<number, string> = {
  1: 'text-saffron',
  2: 'text-ink-mute',
  3: 'text-sienna',
};

export function LeaderboardRow({ entry, isMe }: LeaderboardRowProps) {
  const medal = MEDAL_COLORS[entry.rank];

  return (
    <li
      className={`
        flex items-center gap-3 sm:gap-4
        rounded-2xl px-4 py-3 sm:px-5 sm:py-4
        border-[1.5px] transition-colors
        ${
          isMe
            ? 'bg-terracotta/10 border-terracotta'
            : 'bg-bone border-aubergine/15'
        }
      `}
    >
      <span
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-full
          font-display font-medium
          ${
            medal
              ? `${medal} bg-bone-deep border border-aubergine/15`
              : 'bg-bone-deep text-ink-mute'
          }
        `}
        style={{ fontVariationSettings: "'opsz' 32" }}
        aria-label={`Rang ${entry.rank}`}
      >
        {entry.rank <= 3 ? <Medal /> : entry.rank}
      </span>

      <Avatar
        displayName={entry.displayName}
        avatarUrl={entry.avatarUrl}
        size="md"
        highlight={isMe}
      />

      <div className="flex-1 min-w-0">
        <p
          className={`
            font-display text-base sm:text-lg font-medium truncate
            ${isMe ? 'text-terracotta' : 'text-aubergine'}
          `}
          style={{ fontVariationSettings: "'opsz' 32" }}
        >
          {entry.displayName}
          {isMe ? (
            <span className="font-display italic text-sm text-ink-mute ml-1">
              (vous)
            </span>
          ) : null}
        </p>
        <p className="text-xs text-ink-mute">
          {entry.examCount} examen{entry.examCount !== 1 ? 's' : ''} passé
          {entry.examCount !== 1 ? 's' : ''}
        </p>
      </div>

      <p
        className={`
          font-display text-2xl font-medium
          ${isMe ? 'text-terracotta' : 'text-aubergine'}
        `}
        style={{ fontVariationSettings: "'opsz' 60" }}
      >
        {entry.bestScore}
        <span className="text-sm font-medium">%</span>
      </p>
    </li>
  );
}

function Medal() {
  return (
    <svg
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M12 2l2.39 4.84L20 7.74l-3.84 3.74.91 5.29L12 14.27l-5.07 2.5.91-5.29L4 7.74l5.61-.9L12 2z" />
    </svg>
  );
}
