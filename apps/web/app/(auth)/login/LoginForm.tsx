'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { TextField } from '@/components/auth/TextField';
import { PasswordField } from '@/components/auth/PasswordField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { loginAction } from './actions';

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@exemple.fr"
      />

      <div>
        <PasswordField
          label="Mot de passe"
          name="password"
          autoComplete="current-password"
          required
        />
        <Link
          href="/forgot-password"
          className="block text-right text-xs text-primary hover:underline mt-2"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <FormMessage error={state.error} />

      <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>

      <Divider />
      <SocialButtons />
    </form>
  );
}

function Divider() {
  return (
    <div className="relative my-3">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-aubergine/15" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-bone px-3 font-display italic text-sm text-ink-mute">
          ou
        </span>
      </div>
    </div>
  );
}
