import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server/me';
import {
  getChallenge,
  type ChallengeDetail,
} from '@/lib/server/social';
import { ApiError } from '@/lib/server/api';
import { Avatar } from '@/components/social/Avatar';
import { ChallengePlay } from '@/components/social/ChallengePlay';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  let detail: ChallengeDetail | null = null;
  try {
    detail = await getChallenge(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  if (!detail) notFound();

  const { challenge, questions } = detail;
  const isChallenger = challenge.challengerId === user.id;
  const opponent = isChallenger ? challenge.challenged : challenge.challenger;
  const myScore = isChallenger
    ? challenge.challengerScore
    : challenge.challengedScore;
  const theirScore = isChallenger
    ? challenge.challengedScore
    : challenge.challengerScore;

  const answeredCount = questions.filter((q) => q.selectedChoice !== null).length;
  const myProgress = `${answeredCount}/${challenge.questionCount}`;

  const isCompleted = challenge.status === 'completed';
  const bothPlayed =
    myScore !== null && myScore !== undefined && theirScore !== null && theirScore !== undefined;

  let winner: 'me' | 'them' | 'draw' | null = null;
  if (isCompleted && bothPlayed) {
    if ((myScore ?? 0) > (theirScore ?? 0)) winner = 'me';
    else if ((myScore ?? 0) < (theirScore ?? 0)) winner = 'them';
    else winner = 'draw';
  }

  // ─── Branch 1: user still has questions to answer → play view ──
  // We render only the ChallengePlay component (it has its own header /
  // progress bar). The user can return to this page after finishing.
  const hasUnanswered = answeredCount < challenge.questionCount;
  if (hasUnanswered) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/app/social/challenges"
            className="
              inline-flex items-center gap-1.5 text-sm font-semibold
              text-aubergine hover:text-terracotta transition-colors
            "
          >
            <span aria-hidden>←</span> Tous les défis
          </Link>
        </div>
        <ChallengePlay
          challengeId={challenge.id}
          questions={questions}
          currentUserId={user.id}
          opponent={{
            displayName: opponent.displayName,
            avatarUrl: opponent.avatarUrl,
          }}
          themeId={challenge.theme?.id}
          themeNameFr={challenge.theme?.nameFr}
        />
      </div>
    );
  }

  // ─── Branch 2 + 3: user is done. Show versus header + summary list.
  // If the opponent hasn't played yet, surface a "waiting" notice; otherwise
  // we render the standard recap (winner banner is computed above).
  const waitingForOpponent =
    !isCompleted && (theirScore === null || theirScore === undefined);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/app/social/challenges"
          className="
            inline-flex items-center gap-1.5 text-sm font-semibold
            text-aubergine hover:text-terracotta transition-colors
          "
        >
          <span aria-hidden>←</span> Tous les défis
        </Link>
      </div>

      {/* Versus header */}
      <section className="card !rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* You */}
          <div className="flex-1 flex flex-col items-center gap-3 text-center min-w-0">
            <Avatar
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              size="lg"
            />
            <p className="font-display text-base sm:text-lg font-medium text-aubergine truncate w-full">
              {user.displayName.split(' ')[0]}{' '}
              <span className="text-ink-mute font-display italic text-sm">(vous)</span>
            </p>
            <p
              className="font-display text-3xl sm:text-4xl font-medium text-terracotta"
              style={{ fontVariationSettings: "'opsz' 96" }}
            >
              {myScore !== null && myScore !== undefined
                ? `${myScore}/${challenge.questionCount}`
                : myProgress}
            </p>
            <p className="text-[0.7rem] uppercase tracking-wider text-ink-mute">
              {myScore !== null && myScore !== undefined
                ? 'Score final'
                : 'Progression'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <span
              className="font-display italic text-2xl sm:text-3xl text-ink-faded"
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              vs
            </span>
            {challenge.theme?.nameFr ? (
              <span className="pill bg-bone-deep text-ink-mute text-[0.7rem]">
                {challenge.theme.nameFr}
              </span>
            ) : null}
          </div>

          {/* Opponent */}
          <div className="flex-1 flex flex-col items-center gap-3 text-center min-w-0">
            <Avatar
              displayName={opponent.displayName}
              avatarUrl={opponent.avatarUrl}
              size="lg"
            />
            <p className="font-display text-base sm:text-lg font-medium text-aubergine truncate w-full">
              {opponent.displayName}
            </p>
            <p
              className="font-display text-3xl sm:text-4xl font-medium text-fr-blue"
              style={{ fontVariationSettings: "'opsz' 96" }}
            >
              {theirScore !== null && theirScore !== undefined
                ? `${theirScore}/${challenge.questionCount}`
                : '—'}
            </p>
            <p className="text-[0.7rem] uppercase tracking-wider text-ink-mute">
              {theirScore !== null && theirScore !== undefined
                ? 'Score final'
                : 'Pas encore joué'}
            </p>
          </div>
        </div>

        {winner ? (
          <div className="mt-6 pt-6 border-t border-aubergine/10 text-center">
            {winner === 'me' ? (
              <p
                className="font-display text-2xl sm:text-3xl text-terracotta font-medium"
                style={{ fontVariationSettings: "'opsz' 96" }}
              >
                <span className="display-italic">Bravo</span>, vous l'emportez !
              </p>
            ) : winner === 'them' ? (
              <p
                className="font-display text-2xl sm:text-3xl text-aubergine font-medium"
                style={{ fontVariationSettings: "'opsz' 96" }}
              >
                {opponent.displayName.split(' ')[0]} l'emporte cette fois.
              </p>
            ) : (
              <p
                className="font-display text-2xl sm:text-3xl text-aubergine font-medium"
                style={{ fontVariationSettings: "'opsz' 96" }}
              >
                <span className="display-italic">Match nul</span> — bien joué !
              </p>
            )}
          </div>
        ) : null}
      </section>

      {/* Questions list */}
      <section>
        <header className="mb-4">
          <p className="eyebrow mb-2">— Vos questions</p>
          <h2
            className="font-display text-2xl font-medium text-aubergine"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            {challenge.questionCount} questions de ce défi
          </h2>
          <p className="text-sm text-ink-mute mt-1">
            {answeredCount === 0
              ? 'Vous n\'avez pas encore commencé.'
              : answeredCount < challenge.questionCount
                ? `Il vous reste ${challenge.questionCount - answeredCount} question${challenge.questionCount - answeredCount > 1 ? 's' : ''} à répondre.`
                : 'Vous avez répondu à toutes les questions.'}
          </p>
        </header>

        <ol className="space-y-3">
          {questions.map((q, index) => {
            const answered = q.selectedChoice !== null;
            const correct = q.isCorrect === true;
            return (
              <li
                key={q.answerId}
                className="card !rounded-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-start gap-4"
              >
                <span
                  aria-hidden
                  className={`
                    inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                    font-display font-medium text-sm
                    ${
                      !answered
                        ? 'bg-bone-deep text-ink-mute'
                        : correct
                          ? 'bg-success/20 text-success'
                          : 'bg-fr-red/15 text-fr-red'
                    }
                  `}
                >
                  {index + 1}
                </span>
                <p className="flex-1 text-sm sm:text-base text-aubergine leading-relaxed line-clamp-3">
                  {q.questionText}
                </p>
                <span
                  className={`pill text-[0.7rem] ${
                    !answered
                      ? 'bg-bone-deep text-ink-mute'
                      : correct
                        ? 'bg-success/15 text-success'
                        : 'bg-fr-red/10 text-fr-red'
                  }`}
                >
                  {!answered ? 'À jouer' : correct ? 'Correct' : 'Faux'}
                </span>
              </li>
            );
          })}
        </ol>

        {waitingForOpponent ? (
          <div className="mt-6 card !rounded-2xl p-6 bg-bone-deep border-dashed">
            <p className="eyebrow mb-2">— En attente</p>
            <p
              className="font-display text-lg text-aubergine font-medium mb-1"
              style={{ fontVariationSettings: "'opsz' 32" }}
            >
              On attend que{' '}
              <span className="display-italic">
                {opponent.displayName.split(' ')[0]}
              </span>{' '}
              joue.
            </p>
            <p className="text-sm text-ink-mute leading-relaxed">
              Votre score est verrouillé ({myScore}/{challenge.questionCount}).
              Le résultat final s’affichera ici dès que votre adversaire aura
              terminé.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
