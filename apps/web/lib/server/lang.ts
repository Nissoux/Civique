import 'server-only';
import { cookies } from 'next/headers';
import type { Language } from '@civique/shared';

const COOKIE_KEY = 'civique_lang';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const VALID = new Set<Language>(['fr', 'ar', 'fa', 'pt', 'es', 'hi', 'en', 'tr']);

/**
 * Resolve the language for translation overlays.
 * Priority: explicit cookie → user.preferredLang → 'fr'.
 */
export async function getCurrentLang(
  fallback: Language | undefined = 'fr',
): Promise<Language> {
  const c = await cookies();
  const raw = c.get(COOKIE_KEY)?.value;
  if (raw && VALID.has(raw as Language)) return raw as Language;
  return fallback ?? 'fr';
}

export async function setCurrentLang(lang: Language): Promise<void> {
  if (!VALID.has(lang)) throw new Error('Invalid language');
  const c = await cookies();
  c.set(COOKIE_KEY, lang, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
}
