'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createChallengeAction } from '@/lib/actions/social';

interface ChallengeButtonProps {
  friendId: string;
}

/**
 * Compact "Défier" button that triggers a challenge creation and
 * navigates to the new challenge's detail page on success.
 */
export function ChallengeButton({ friendId }: ChallengeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await createChallengeAction(friendId);
            if (!result.ok) {
              setError(result.error ?? 'Erreur');
              return;
            }
            if (result.challengeId) {
              router.push(`/app/social/challenges/${result.challengeId}`);
            } else {
              router.push('/app/social/challenges');
            }
            router.refresh();
          });
        }}
        className="
          inline-flex items-center gap-1.5
          rounded-full bg-terracotta text-bone
          px-3.5 py-1.5 text-sm font-semibold
          shadow-[0_2px_0_rgb(45_27_46)]
          hover:-translate-y-0.5 hover:shadow-[0_3px_0_rgb(45_27_46)]
          transition-all
          disabled:opacity-60 disabled:cursor-wait
        "
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        {isPending ? 'Envoi…' : 'Défier'}
      </button>
      {error ? (
        <span className="text-[0.7rem] text-fr-red">{error}</span>
      ) : null}
    </div>
  );
}
