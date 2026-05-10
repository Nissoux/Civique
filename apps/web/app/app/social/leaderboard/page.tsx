import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server/me';
import {
  getLeaderboard,
  type LeaderboardEntry,
  type LeaderboardPeriod,
} from '@/lib/server/social';
import { ApiError } from '@/lib/server/api';
import { LeaderboardRow } from '@/components/social/LeaderboardRow';
import { PeriodTabs } from '@/components/social/PeriodTabs';

export const metadata = {
  title: 'Classement',
};

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

function parsePeriod(raw: string | undefined): LeaderboardPeriod {
  if (raw === 'week' || raw === 'month' || raw === 'all') return raw;
  return 'all';
}

export default async function LeaderboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const sp = await searchParams;
  const period = parsePeriod(sp.period);

  let entries: LeaderboardEntry[] = [];
  let loadError: string | null = null;
  try {
    entries = await getLeaderboard(period);
  } catch (err) {
    loadError =
      err instanceof ApiError
        ? err.userMessage
        : 'Impossible de charger le classement.';
  }

  const myEntry = entries.find((e) => e.userId === user.id);
  const myRank = myEntry?.rank;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PeriodTabs active={period} basePath="/app/social/leaderboard" />
        {myRank ? (
          <p className="text-sm text-ink-mute font-display italic">
            — Vous êtes <span className="text-terracotta font-semibold not-italic">#{myRank}</span> sur {entries.length}
          </p>
        ) : (
          <p className="text-sm text-ink-mute font-display italic">
            — Passez un examen pour apparaître au classement.
          </p>
        )}
      </div>

      {loadError ? (
        <div
          role="alert"
          className="rounded-xl bg-error-bg border-[1.5px] border-fr-red/40 px-4 py-3 text-sm text-fr-red font-medium"
        >
          {loadError}
        </div>
      ) : null}

      {entries.length === 0 && !loadError ? (
        <div className="card !rounded-2xl p-10 text-center">
          <p
            className="font-display text-2xl text-aubergine mb-2"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            Personne n'a encore passé d'examen.
          </p>
          <p className="text-sm text-ink-mute">
            Soyez le premier — passez un examen blanc pour entrer au classement.
          </p>
        </div>
      ) : (
        <ol className="space-y-2.5">
          {entries.map((entry) => (
            <LeaderboardRow
              key={entry.rank}
              entry={entry}
              isMe={entry.userId === user.id}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
