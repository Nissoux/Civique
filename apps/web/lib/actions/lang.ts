'use server';

import { revalidatePath } from 'next/cache';
import type { Language } from '@civique/shared';
import { setCurrentLang } from '@/lib/server/lang';

const VALID: readonly Language[] = ['fr', 'ar', 'fa', 'pt', 'es', 'hi'];

export async function setLangAction(lang: Language): Promise<void> {
  if (!VALID.includes(lang)) throw new Error('Invalid language');
  await setCurrentLang(lang);
  // Refresh every authed page that fetches translated content.
  revalidatePath('/app', 'layout');
}
