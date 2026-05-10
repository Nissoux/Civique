'use client';

import { useActionState, useState } from 'react';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { verifyEmailAction, resendVerificationAction } from './actions';

export function VerifyEmailForm() {
  const [state, formAction] = useActionState(verifyEmailAction, {});
  const [resendState, setResendState] = useState<{
    error?: string;
    message?: string;
  }>({});
  const [resendPending, setResendPending] = useState(false);

  async function handleResend() {
    setResendPending(true);
    setResendState({});
    const res = await resendVerificationAction();
    setResendState(res);
    setResendPending(false);
  }

  const errorId = state.error ? 'verify-error' : undefined;
  const invalid = Boolean(state.error);

  return (
    <div className="flex flex-col gap-5">
      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="code"
            className="text-sm font-medium text-text-primary"
          >
            Code de vérification
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            pattern="\d{6}"
            placeholder="123456"
            aria-describedby={`code-hint${errorId ? ` ${errorId}` : ''}`}
            aria-invalid={invalid || undefined}
            className="rounded-md bg-input-bg border border-border px-4 py-3 text-2xl text-center font-mono tracking-[0.5em] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          <p id="code-hint" className="text-xs text-text-tertiary">
            Code à 6 chiffres reçu par email
          </p>
        </div>

        <FormMessage error={state.error} id={errorId} />

        <SubmitButton pendingLabel="Vérification…">
          Vérifier mon email
        </SubmitButton>
      </form>

      <div className="border-t border-divider pt-4 text-center">
        <p className="text-sm text-text-secondary mb-2">
          Pas reçu de code ?
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendPending}
          aria-busy={resendPending || undefined}
          className="text-sm text-primary font-medium hover:underline disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone rounded"
        >
          {resendPending ? 'Envoi…' : 'Renvoyer un code'}
        </button>
        {resendState.message ? (
          <p role="status" aria-live="polite" className="mt-2 text-xs text-success">
            {resendState.message}
          </p>
        ) : null}
        {resendState.error ? (
          <p role="alert" className="mt-2 text-xs text-error">
            {resendState.error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
