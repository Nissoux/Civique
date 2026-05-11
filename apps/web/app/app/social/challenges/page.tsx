import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ChallengeStatus } from '@civique/shared';
import { getCurrentUser } from '@/lib/server/me';
import {
  getChallenges,
  type ChallengeWithUsers,
} from '@/lib/server/social';
import { ApiError } from '@/lib/server/api';
import { ChallengeCard } from '@/components/social/ChallengeCard';

export const metadata = {
  title: 'Mes défis',
};

const SECTION_ORDER: { key: ChallengeStatus; title: string; subtitle: string }[] = [
  {
    key: 'active',
    title: 'En cours',
    subtitle: 'Continuez là où vous vous êtes arrêté(e).',
  },
  {
    key: 'pending',
    title: 'En attente',
    subtitle: 'Défis envoyés ou reçus, pas encore commencés.',
  },
  {
    key: 'completed',
    title: 'Terminés',
    subtitle: 'Comparez vos scores avec vos amis.',
  },
  {
    key: 'declined',
    title: 'Refusés',
    subtitle: 'Défis annulés.',
  },
];

export default async function ChallengesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  let challenges: ChallengeWithUsers[] = [];
  let loadError: string | null = null;
  try {
    challenges = await getChallenges();
  } catch (err) {
    loadError =
      err instanceof ApiError
        ? err.userMessage
        : 'Impossible de charger vos défis.';
  }

  const grouped: Record<ChallengeStatus, ChallengeWithUsers[]> = {
    pending: [],
    active: [],
    completed: [],
    declined: [],
  };
  for (const c of challenges) {
    grouped[c.status].push(c);
  }

  const totalCount = challenges.length;

  return (
    <div className="space-y-8">
      {/* CTA bar */}
      <section className="card !rounded-2xl p-6 sm:p-7 flex flex-wrap items-center gap-4 justify-between">
        <div className="min-w-0">
          <p className="eyebrow mb-1.5">— Lancer un défi</p>
          <p
            className="font-display text-xl sm:text-2xl font-medium text-aubergine"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            Choisissez un{' '}
            <span className="display-italic text-terracotta">ami</span> à défier.
          </p>
          <p className="text-sm text-ink-mute mt-1">
            10 questions, score révélé une fois que vous avez joué tous les deux.
          </p>
        </div>
        <Link href="/app/social/friends" className="btn-primary">
          Voir mes amis
        </Link>
      </section>

      {loadError ? (
        <div
          role="alert"
          className="rounded-xl bg-error-bg border-[1.5px] border-fr-red/40 px-4 py-3 text-sm text-fr-red font-medium"
        >
          {loadError}
        </div>
      ) : null}

      {totalCount === 0 ? (
        <div className="card !rounded-2xl p-10 text-center">
          <p
            className="font-display text-2xl text-aubergine mb-2"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            Aucun défi pour le moment.
          </p>
          <p className="text-sm text-ink-mute max-w-md mx-auto">
            Une fois qu'un de vos amis vous défiera ou que vous lancerez un
            défi, il apparaîtra ici.
          </p>
        </div>
      ) : (
        SECTION_ORDER.map(({ key, title, subtitle }) => {
          const items = grouped[key];
          if (items.length === 0) return null;
          return (
            <section key={key}>
              <header className="mb-3 flex items-baseline justify-between">
                <div>
                  <h3
                    className="font-display text-xl font-medium text-aubergine"
                    style={{ fontVariationSettings: "'opsz' 32" }}
                  >
                    {title}
                  </h3>
                  <p className="text-xs text-ink-mute font-display italic">
                    {subtitle}
                  </p>
                </div>
                <span className="pill bg-bone-deep text-ink-mute">
                  {items.length}
                </span>
              </header>
              <ul className="space-y-3">
                {items.map((c) => (
                  <li key={c.id}>
                    <ChallengeCard challenge={c} viewerId={user.id} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
