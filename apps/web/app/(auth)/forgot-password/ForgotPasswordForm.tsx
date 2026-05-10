'use client';

import { useActionState } from 'react';
import { TextField } from '@/components/auth/TextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { forgotPasswordAction } from './actions';

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@exemple.fr"
      />

      <FormMessage error={state.error} message={state.message} />

      <SubmitButton pendingLabel="Envoi…">
        Recevoir mon code
      </SubmitButton>
    </form>
  );
}
