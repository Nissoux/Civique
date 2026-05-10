import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server/me';
import { getFriends, type FriendshipWithUsers } from '@/lib/server/social';
import { ApiError } from '@/lib/server/api';
import { Avatar } from '@/components/social/Avatar';
import { AddFriendForm } from '@/components/social/AddFriendForm';
import { FriendCard } from '@/components/social/FriendCard';
import { FriendRequestCard } from '@/components/social/FriendRequestCard';

export const metadata = {
  title: 'Mes amis',
};

export default async function FriendsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  let friendships: FriendshipWithUsers[] = [];
  let loadError: string | null = null;
  try {
    friendships = await getFriends();
  } catch (err) {
    loadError =
      err instanceof ApiError
        ? err.userMessage
        : 'Impossible de charger vos amis pour le moment.';
  }

  const accepted = friendships.filter((f) => f.status === 'accepted');
  const pendingReceived = friendships.filter(
    (f) => f.status === 'pending' && f.addressee.id === user.id,
  );
  const pendingSent = friendships.filter(
    (f) => f.status === 'pending' && f.requester.id === user.id,
  );

  return (
    <div className="space-y-8">
      {/* Add a friend */}
      <section className="card !rounded-2xl p-6 sm:p-8">
        <header className="mb-5">
          <p className="eyebrow mb-2">— Ajouter un ami</p>
          <h2
            className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            Élargissez votre{' '}
            <span className="display-italic text-terracotta">cercle</span>
          </h2>
        </header>
        <AddFriendForm />
      </section>

      {loadError ? (
        <div
          role="alert"
          className="rounded-xl bg-error-bg border-[1.5px] border-fr-red/40 px-4 py-3 text-sm text-fr-red font-medium"
        >
          {loadError}
        </div>
      ) : null}

      {/* Pending received */}
      {pendingReceived.length > 0 ? (
        <section>
          <header className="mb-3 flex items-baseline justify-between">
            <h3 className="font-display text-xl font-medium text-aubergine" style={{ fontVariationSettings: "'opsz' 32" }}>
              Demandes reçues
            </h3>
            <span className="pill bg-saffron/20 text-aubergine">
              {pendingReceived.length}
            </span>
          </header>
          <ul className="space-y-3">
            {pendingReceived.map((f) => (
              <FriendRequestCard
                key={f.id}
                friendshipId={f.id}
                requester={f.requester}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {/* Pending sent */}
      {pendingSent.length > 0 ? (
        <section>
          <header className="mb-3 flex items-baseline justify-between">
            <h3 className="font-display text-xl font-medium text-aubergine" style={{ fontVariationSettings: "'opsz' 32" }}>
              Demandes envoyées
            </h3>
            <span className="pill bg-bone-deep text-ink-mute">
              {pendingSent.length}
            </span>
          </header>
          <ul className="space-y-3">
            {pendingSent.map((f) => (
              <li
                key={f.id}
                className="card !rounded-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-4"
              >
                <Avatar
                  displayName={f.addressee.displayName}
                  avatarUrl={f.addressee.avatarUrl}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base sm:text-lg font-medium text-aubergine truncate">
                    {f.addressee.displayName}
                  </p>
                  <p className="text-xs text-ink-mute font-display italic">
                    En attente de réponse
                  </p>
                </div>
                <span className="pill bg-saffron/30 text-aubergine">
                  En attente
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Accepted friends */}
      <section>
        <header className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-xl font-medium text-aubergine" style={{ fontVariationSettings: "'opsz' 32" }}>
            Mes amis
          </h3>
          <span className="pill bg-bone-deep text-ink-mute">
            {accepted.length}
          </span>
        </header>
        {accepted.length === 0 ? (
          <div className="card !rounded-2xl p-8 text-center">
            <p className="font-display text-lg text-ink-mute italic">
              Vous n'avez pas encore d'ami sur Civique.
            </p>
            <p className="text-sm text-ink-mute mt-2">
              Ajoutez un ami pour le défier et comparer vos progrès.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {accepted.map((f) => {
              const isViewerRequester = f.requester.id === user.id;
              const friend = isViewerRequester ? f.addressee : f.requester;
              return (
                <FriendCard
                  key={f.id}
                  friendshipId={f.id}
                  friend={friend}
                />
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
