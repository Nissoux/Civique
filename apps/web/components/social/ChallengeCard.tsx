import Link from 'next/link';
import type { ChallengeStatus } from '@civique/shared';
import { Avatar } from './Avatar';
import type { ChallengeWithUsers } from '@/lib/server/social';

const STATUS_CONFIG: Record<
  ChallengeStatus,
  { label: string; pillCls: string }
> = {
  pending: {
    label: 'En attente',
    pillCls: 'bg-saffron/30 text-aubergine',
  },
  active: {
    label: 'En cours',
    pillCls: 'bg-fr-blue/15 text-fr-blue',
  },
  completed: {
    label: 'Terminé',
    pillCls: 'bg-success/15 text-success',
  },
  declined: {
    label: 'Refusé',
    pillCls: 'bg-bone-deep text-ink-mute',
  },
};

interface ChallengeCardProps {
  challenge: ChallengeWithUsers;
  /** Current user id, so we can identify the opponent + viewer score. */
  viewerId: string;
}

export function ChallengeCard({ challenge, viewerId }: ChallengeCardProps) {
  const isChallenger = challenge.challengerId === viewerId;
  const opponent = isChallenger ? challenge.challenged : challenge.challenger;
  const myScore = isChallenger
    ? challenge.challengerScore
    : challenge.challengedScore;
  const theirScore = isChallenger
    ? challenge.challengedScore
    : challenge.challengerScore;

  const statusCfg = STATUS_CONFIG[challenge.status];
  const isCompleted = challenge.status === 'completed';

  let cta = 'Voir';
  if (challenge.status === 'pending' || challenge.status === 'active') {
    cta = 'Jouer';
  } else if (isCompleted) {
    cta = 'Voir les résultats';
  }

  return (
    <Link
      href={`/app/social/challenges/${challenge.id}`}
      className="
        card !rounded-2xl p-5
        block
        transition-all hover:-translate-y-0.5 hover:shadow-clay-lg
      "
    >
      <div className="flex items-start gap-4">
        <Avatar
          displayName={opponent.displayName}
          avatarUrl={opponent.avatarUrl}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="font-display italic text-sm text-ink-mute mb-0.5">
            — {isChallenger ? 'Vous défiez' : 'Vous défie'}
          </p>
          <p className="font-display text-lg font-medium text-aubergine truncate" style={{ fontVariationSettings: "'opsz' 32" }}>
            {opponent.displayName}
          </p>
          <p className="text-xs text-ink-mute mt-0.5">
            {challenge.questionCount} question
            {challenge.questionCount > 1 ? 's' : ''}
            {challenge.theme?.nameFr ? ` · ${challenge.theme.nameFr}` : ''}
          </p>
        </div>
        <span className={`pill ${statusCfg.pillCls}`}>{statusCfg.label}</span>
      </div>

      {isCompleted ? (
        <div
          className="
            mt-4 pt-4 border-t border-aubergine/10
            grid grid-cols-3 items-center text-center
          "
        >
          <ScoreCol label="Vous" value={myScore} total={challenge.questionCount} />
          <span aria-hidden className="font-display text-lg text-ink-faded">
            vs
          </span>
          <ScoreCol
            label={opponent.displayName.split(' ')[0]}
            value={theirScore}
            total={challenge.questionCount}
          />
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-aubergine/10 flex items-center justify-between text-sm">
          <span className="text-ink-mute font-display italic">
            {myScore !== null && myScore !== undefined
              ? `Votre score : ${myScore}/${challenge.questionCount}`
              : 'Pas encore joué'}
          </span>
          <span className="font-semibold text-terracotta">
            {cta}
            <span className="ml-1" aria-hidden>
              →
            </span>
          </span>
        </div>
      )}
    </Link>
  );
}

function ScoreCol({
  label,
  value,
  total,
}: {
  label: string;
  value: number | null | undefined;
  total: number;
}) {
  const display = value === null || value === undefined ? '—' : `${value}/${total}`;
  return (
    <div>
      <p
        className="font-display text-2xl sm:text-3xl font-medium text-aubergine"
        style={{ fontVariationSettings: "'opsz' 60" }}
      >
        {display}
      </p>
      <p className="text-[0.7rem] text-ink-mute uppercase tracking-wider mt-0.5 truncate">
        {label}
      </p>
    </div>
  );
}
