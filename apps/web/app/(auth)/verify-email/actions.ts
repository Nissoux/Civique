'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiError, fastifyFetch } from '@/lib/server/api';
import type { FormState } from '@/lib/auth-types';

const verifySchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, 'Le code doit contenir 6 chiffres'),
});

export async function verifyEmailAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = verifySchema.safeParse({ code: formData.get('code') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Code invalide' };
  }

  try {
    await fastifyFetch(
      '/auth/verify-email',
      {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      },
      { auth: true },
    );
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        return { error: 'Code incorrect.' };
      }
      if (err.status === 410) {
        return { error: 'Le code a expiré. Demandez un nouveau code.' };
      }
      return { error: err.userMessage };
    }
    return { error: 'Une erreur est survenue. Réessayez.' };
  }

  redirect('/app');
}

export async function resendVerificationAction(): Promise<FormState> {
  try {
    await fastifyFetch(
      '/auth/resend-verification',
      { method: 'POST' },
      { auth: true },
    );
  } catch (err) {
    return {
      error:
        err instanceof ApiError
          ? err.userMessage
          : 'Impossible d\'envoyer un nouveau code. Réessayez.',
    };
  }

  return { message: 'Un nouveau code a été envoyé à votre email.' };
}
