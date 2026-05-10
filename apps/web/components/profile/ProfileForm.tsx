'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { LANGUAGES, type Language } from '@civique/shared';
import { TextField } from '@/components/auth/TextField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { FormMessage } from '@/components/auth/FormMessage';
import { updateProfileAction } from '@/lib/actions/profile';
import type { FormState } from '@/lib/auth-types';

interface ProfileFormProps {
  initialDisplayName: string;
  initialLang: Language;
  email: string;
  /** Defaults to `true` so accounts without the flag don't show the banner. */
  emailVerified?: boolean;
}

export function ProfileForm({
  initialDisplayName,
  initialLang,
  email,
  emailVerified = true,
}: ProfileFormProps) {
  const [state, formAction] = useActionState<FormState, FormData>(
    updateProfileAction,
    {},
  );
  const feedbackId =
    state.error || state.message ? 'profile-feedback' : undefined;
  const invalid = Boolean(state.error);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {!emailVerified ? (
        <div
          role="status"
          className="
            rounded-xl bg-saffron/15 border-[1.5px] border-saffron/50
            px-4 py-3 text-sm text-aubergine
            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2
          "
        >
          <span>
            Votre email n&apos;est pas encore vérifié.
          </span>
          <Link
            href="/verify-email"
            className="font-semibold underline underline-offset-4 hover:text-terracotta"
          >
            Saisir le code →
          </Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          label="Nom d'affichage"
          name="displayName"
          type="text"
          autoComplete="name"
          defaultValue={initialDisplayName}
          maxLength={100}
          required
          aria-invalid={invalid || undefined}
          aria-describedby={feedbackId}
        />
        <div className="flex flex-col">
          <TextField
            label="Adresse e-mail"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={email}
            inputMode="email"
            maxLength={254}
            required
            aria-invalid={invalid || undefined}
            aria-describedby={feedbackId}
          />
          <p className="text-xs text-ink-mute italic font-display mt-2">
            En modifiant votre email, vous recevrez un code de vérification à 6 chiffres. Votre compte restera actif.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="preferredLang" className="field-label">
          Langue de traduction
        </label>
        <select
          id="preferredLang"
          name="preferredLang"
          defaultValue={initialLang}
          className="field-input appearance-none bg-no-repeat pr-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2374665a' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25rem',
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
        <p className="text-xs text-ink-mute mt-2 font-display italic">
          Les questions seront traduites dans cette langue lorsque disponible.
        </p>
      </div>

      <FormMessage error={state.error} message={state.message} id={feedbackId} />

      {state.emailChanged ? (
        <div className="flex justify-start">
          <Link href="/verify-email" className="btn-primary">
            Saisir le code de vérification →
          </Link>
        </div>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton full={false} pendingLabel="Enregistrement…">
          Enregistrer
        </SubmitButton>
      </div>
    </form>
  );
}
