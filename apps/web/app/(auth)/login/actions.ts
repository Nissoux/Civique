'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiError, fastifyFetch } from '@/lib/server/api';
import { setSessionCookies } from '@/lib/server/session';
import type { AuthResponse, FormState } from '@/lib/auth-types';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  next: z.string().optional(),
});

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides' };
  }

  // Sanitize redirect target — only internal paths.
  const candidate = parsed.data.next ?? '/app';
  const next =
    candidate.startsWith('/') && !candidate.startsWith('//')
      ? candidate
      : '/app';

  try {
    const res = await fastifyFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    });

    await setSessionCookies({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { error: 'Email ou mot de passe incorrect.' };
    }
    return {
      error:
        err instanceof ApiError
          ? err.userMessage
          : 'Une erreur est survenue. Réessayez.',
    };
  }

  redirect(next);
}
