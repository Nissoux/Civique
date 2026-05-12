'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiError, fastifyFetch } from '@/lib/server/api';
import { setSessionCookies } from '@/lib/server/session';
import type { AuthResponse, FormState } from '@/lib/auth-types';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  displayName: z
    .string()
    .min(1, 'Nom requis')
    .max(100, 'Nom trop long (max. 100 caractères)'),
  preferredLang: z.enum(['fr', 'ar', 'fa', 'pt', 'es', 'hi', 'en', 'tr']).optional(),
});

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    displayName: formData.get('displayName'),
    preferredLang: formData.get('preferredLang') || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides' };
  }

  try {
    const res = await fastifyFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });

    await setSessionCookies({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return { error: 'Cet email est déjà utilisé.' };
    }
    return {
      error:
        err instanceof ApiError
          ? err.userMessage
          : 'Une erreur est survenue. Réessayez.',
    };
  }

  // New users always need to verify email — push them to the code form.
  redirect('/verify-email');
}
