'use client';

import { useActionState } from 'react';
import { PasswordField } from '@/components/auth/PasswordField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { resetPasswordAction } from './actions';

interface Props {
  /** Pre-filled code from email link (?token=...). */
  initialCode?: string;
}

export function ResetPasswordForm({ initialCode }: Props) {
  const [state, formAction] = useActionState(resetPasswordAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="token" className="field-label">
          Code reçu par email
        </label>
        <input
          id="token"
          name="token"
          type="text"
          inputMode="text"
          autoComplete="one-time-code"
          autoCapitalize="characters"
          required
          minLength={6}
          maxLength={64}
          defaultValue={initialCode}
          placeholder="A3F9B7E2"
          className="
            field-input !text-center !text-2xl !font-mono !tracking-[0.3em]
            uppercase
          "
          spellCheck={false}
        />
        <p className="text-xs text-ink-mute mt-2 font-display italic">
          Le code à 8 caractères que nous venons de vous envoyer (valable 1 h).
        </p>
      </div>

      <PasswordField
        label="Nouveau mot de passe"
        name="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="8 caractères minimum"
      />

      <PasswordField
        label="Confirmer le mot de passe"
        name="confirmPassword"
        autoComplete="new-password"
        required
        minLength={8}
      />

      <FormMessage error={state.error} />

      <SubmitButton pendingLabel="Mise à jour…">
        Réinitialiser le mot de passe
      </SubmitButton>
    </form>
  );
}
