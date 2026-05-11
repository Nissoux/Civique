'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiError, fastifyFetch } from '@/lib/server/api';
import type { FormState } from '@/lib/auth-types';

const schema = z.object({
  email: z.string().email('Email invalide'),
});

export async function forgotPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = schema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Email invalide' };
  }

  try {
    await fastifyFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });
  } catch (err) {
    // The backend already returns 200 to prevent enumeration; but in case of a
    // real network/server error, surface a friendly message.
    return {
      error:
        err instanceof ApiError
          ? err.userMessage
          : 'Une erreur est survenue. Réessayez.',
    };
  }

  // Send the user straight to the code-entry page (with their email
  // displayed for confirmation) — no friction guessing where to enter the code.
  redirect(`/reset-password?sent=${encodeURIComponent(parsed.data.email)}`);
}
