'use server';

import { revalidatePath } from 'next/cache';
import type { Language } from '@civique/shared';
import { setCurrentLang } from '@/lib/server/lang';
import { fastifyFetch, ApiError } from '@/lib/server/api';
import { getAccessToken } from '@/lib/server/session';

const VALID: readonly Language[] = ['fr', 'ar', 'fa', 'pt', 'es', 'hi', 'en', 'tr'];

export async function setLangAction(lang: Language): Promise<void> {
  if (!VALID.includes(lang)) throw new Error('Invalid language');
  await setCurrentLang(lang);

  // Mirror the choice to the DB so profile.preferred_lang stays in sync
  // with the sidebar picker. Best-effort: a failure here shouldn't strand
  // the user — the cookie is the runtime source of truth for the current
  // request, and the profile page can re-sync on next save.
  const token = await getAccessToken();
  if (token) {
    try {
      await fastifyFetch(
        '/auth/me',
        {
          method: 'PATCH',
          body: JSON.stringify({ preferredLang: lang }),
        },
        { auth: true },
      );
    } catch (err) {
      // Swallow — the user still gets the language switch via the cookie.
      // Avoid bubbling up so the picker doesn't appear to fail.
      if (!(err instanceof ApiError)) throw err;
    }
  }

  // Refresh every authed page that fetches translated content.
  revalidatePath('/app', 'layout');
}
