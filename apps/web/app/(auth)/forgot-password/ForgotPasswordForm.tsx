'use client';

import { useActionState } from 'react';
import { TextField } from '@/components/auth/TextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { forgotPasswordAction } from './actions';

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, {});
  const feedbackId = state.error || state.message ? 'forgot-feedback' : undefined;
  const invalid = Boolean(state.error);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@exemple.fr"
        aria-invalid={invalid || undefined}
        aria-describedby={feedbackId}
      />

      <FormMessage error={state.error} message={state.message} id={feedbackId} />

      <SubmitButton pendingLabel="Envoi…">
        Recevoir mon code
      </SubmitButton>
    </form>
  );
}
