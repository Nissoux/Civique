'use client';

import { useActionState } from 'react';
import { LANGUAGES } from '@civique/shared';
import { TextField } from '@/components/auth/TextField';
import { PasswordField } from '@/components/auth/PasswordField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { registerAction } from './actions';

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, {});
  const errorId = state.error ? 'register-error' : undefined;
  const invalid = Boolean(state.error);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <TextField
        label="Nom complet"
        name="displayName"
        type="text"
        autoComplete="name"
        required
        placeholder="Marie Dupont"
        maxLength={100}
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@exemple.fr"
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
      />

      <PasswordField
        label="Mot de passe"
        name="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="8 caractères minimum"
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="preferredLang"
          className="text-sm font-medium text-text-primary"
        >
          Langue d'apprentissage
        </label>
        <select
          id="preferredLang"
          name="preferredLang"
          defaultValue="fr"
          className="rounded-md bg-input-bg border border-border px-4 py-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeName}
            </option>
          ))}
        </select>
      </div>

      <FormMessage error={state.error} id={errorId} />

      <SubmitButton pendingLabel="Création du compte…">
        Créer mon compte
      </SubmitButton>

      <p className="text-xs text-text-tertiary text-center">
        En créant un compte, vous acceptez nos{' '}
        <a href="/terms" className="underline hover:text-text-primary">
          conditions d'utilisation
        </a>{' '}
        et notre{' '}
        <a href="/privacy" className="underline hover:text-text-primary">
          politique de confidentialité
        </a>
        .
      </p>

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
