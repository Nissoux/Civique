'use client';

import { useActionState, useEffect, useRef } from 'react';
import { PasswordField } from '@/components/auth/PasswordField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { changePasswordAction } from '@/lib/actions/profile';
import type { FormState } from '@/lib/auth-types';

export function ChangePasswordForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    changePasswordAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) formRef.current?.reset();
  }, [state.message]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <PasswordField
        label="Mot de passe actuel"
        name="currentPassword"
        autoComplete="current-password"
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <PasswordField
          label="Nouveau mot de passe"
          name="newPassword"
          autoComplete="new-password"
          minLength={8}
          required
          hint="Minimum 8 caractères."
        />
        <PasswordField
          label="Confirmer le mot de passe"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <FormMessage error={state.error} message={state.message} />

      <div className="flex justify-end">
        <SubmitButton full={false} pendingLabel="Mise à jour…">
          Mettre à jour
        </SubmitButton>
      </div>
    </form>
  );
}
