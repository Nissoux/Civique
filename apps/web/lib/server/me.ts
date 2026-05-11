import 'server-only';
import { cache } from 'react';
import type { User } from '@civique/shared';
import { fastifyFetch } from './api';
import { getAccessToken } from './session';

interface MeResponse {
  data: User & { emailVerified?: boolean };
}

/**
 * Resolve the current user from the access cookie.
 * Returns null if no usable session — caller decides whether to redirect.
 *
 * Token refresh happens in middleware (which can write cookies); by the time
 * a Server Component calls this helper, the access cookie is either fresh or
 * legitimately absent.
 *
 * `cache()` dedupes calls within a single render.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const access = await getAccessToken();
  if (!access) return null;

  try {
    const res = await fastifyFetch<MeResponse>(
      '/auth/me',
      { method: 'GET' },
      { auth: true },
    );
    return res.data;
  } catch {
    return null;
  }
});
