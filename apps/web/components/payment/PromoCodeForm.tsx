'use client';

import { useActionState } from 'react';
import { TextField } from '@/components/auth/TextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { redeemPromoCodeAction } from '@/lib/actions/payments';
import type { FormState } from '@/lib/auth-types';

export function PromoCodeForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    redeemPromoCodeAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <TextField
        label="Code promo"
        name="code"
        type="text"
        autoComplete="off"
        placeholder="ABCD1234"
        required
        maxLength={50}
      />
      <FormMessage error={state.error} message={state.message} />
      <div className="flex justify-end">
        <SubmitButton full={false} pendingLabel="Activation…">
          Activer le code
        </SubmitButton>
      </div>
    </form>
  );
}
