'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiError, fastifyFetch } from '@/lib/server/api';
import type { FormState } from '@/lib/auth-types';

const schema = z.object({
  token: z.string().min(1, 'Token manquant'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export async function resetPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = schema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides' };
  }

  try {
    await fastifyFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: parsed.data.token,
        password: parsed.data.password,
      }),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 400) {
      return {
        error:
          'Code invalide ou expiré. Demandez un nouveau code.',
      };
    }
    return {
      error:
        err instanceof ApiError
          ? err.userMessage
          : 'Une erreur est survenue. Réessayez.',
    };
  }

  redirect('/login?reset=1');
}
