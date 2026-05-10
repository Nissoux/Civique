'use client';

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
}

export function ProfileForm({
  initialDisplayName,
  initialLang,
  email,
}: ProfileFormProps) {
  const [state, formAction] = useActionState<FormState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          label="Nom d'affichage"
          name="displayName"
          type="text"
          autoComplete="name"
          defaultValue={initialDisplayName}
          maxLength={100}
          required
        />
        <div className="flex flex-col">
          <label htmlFor="email" className="field-label">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
            className="field-input opacity-70 cursor-not-allowed"
            aria-readonly="true"
          />
          <p className="text-xs text-ink-mute mt-2 font-display italic">
            L'e-mail ne peut pas être modifié pour le moment.
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

      <FormMessage error={state.error} message={state.message} />

      <div className="flex justify-end">
        <SubmitButton full={false} pendingLabel="Enregistrement…">
          Enregistrer
        </SubmitButton>
      </div>
    </form>
  );
}
