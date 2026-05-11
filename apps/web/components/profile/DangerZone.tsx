'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FormMessage } from '@/components/auth/FormMessage';
import { deleteAccountAction } from '@/lib/actions/profile';
import type { FormState } from '@/lib/auth-types';

const CONFIRM_PHRASE = 'SUPPRIMER';

export function DangerZone() {
  const [armed, setArmed] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [state, formAction] = useActionState<FormState, FormData>(
    deleteAccountAction,
    {},
  );

  if (!armed) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-mute leading-relaxed">
          La suppression est <strong className="text-fr-red">définitive</strong>. Toutes
          vos données (progression, examens blancs, abonnement, défis) seront
          supprimées.
        </p>
        <button
          type="button"
          onClick={() => setArmed(true)}
          className="
            inline-flex items-center gap-2 rounded-full
            border-[1.5px] border-fr-red text-fr-red font-semibold
            px-5 py-2.5 text-sm transition-all
            hover:bg-fr-red hover:text-bone
          "
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
          </svg>
          Supprimer mon compte
        </button>
      </div>
    );
  }

  const canSubmit = confirmText.trim() === CONFIRM_PHRASE;

  return (
    <form action={formAction} className="space-y-4">
      <div className="rounded-xl bg-error-bg border-[1.5px] border-fr-red/40 p-4">
        <p className="text-sm font-semibold text-fr-red mb-1">
          Cette action est irréversible.
        </p>
        <p className="text-xs text-fr-red/85">
          Pour confirmer, saisissez{' '}
          <code className="px-1.5 py-0.5 rounded bg-fr-red/10 font-mono">
            {CONFIRM_PHRASE}
          </code>{' '}
          ci-dessous.
        </p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="confirm" className="field-label">
          Saisissez « {CONFIRM_PHRASE} »
        </label>
        <input
          id="confirm"
          name="confirm"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="field-input"
          required
          aria-invalid={Boolean(state.error) || undefined}
          aria-describedby={state.error ? 'danger-zone-error' : undefined}
        />
      </div>

      <FormMessage error={state.error} id="danger-zone-error" />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setArmed(false);
            setConfirmText('');
          }}
          className="btn-secondary"
        >
          Annuler
        </button>

        <DangerSubmit disabled={!canSubmit} />
      </div>
    </form>
  );
}

function DangerSubmit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="
        inline-flex items-center justify-center gap-2.5 rounded-full
        bg-fr-red text-bone font-semibold px-6 py-3
        transition-all
        hover:-translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
        focus:outline-none focus:ring-2 focus:ring-fr-red focus:ring-offset-2 focus:ring-offset-bone
      "
      style={{
        boxShadow:
          '0 4px 0 rgba(160, 26, 26, 0.85), 0 8px 24px -8px rgba(237, 41, 57, 0.4)',
      }}
    >
      {pending ? (
        <>
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>Suppression…</span>
        </>
      ) : (
        <span>Supprimer définitivement</span>
      )}
    </button>
  );
}
