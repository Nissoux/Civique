'use client';

import { useActionState } from 'react';
import { TextField } from '@/components/auth/TextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { requestFriendFormAction } from '@/lib/actions/social';
import type { FormState } from '@/lib/auth-types';

export function AddFriendForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    requestFriendFormAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <TextField
        label="Identifiant de l'ami"
        name="addresseeId"
        type="text"
        autoComplete="off"
        placeholder="Collez l'UUID de l'utilisateur…"
        hint="Le serveur n'expose pas encore de recherche par e-mail. En attendant, demandez l'UUID à votre ami (visible dans son profil) ou laissez-le vous l'envoyer."
        required
      />
      <FormMessage error={state.error} message={state.message} />
      <div className="flex justify-end">
        <SubmitButton full={false} pendingLabel="Envoi…">
          Envoyer la demande
        </SubmitButton>
      </div>
    </form>
  );
}
