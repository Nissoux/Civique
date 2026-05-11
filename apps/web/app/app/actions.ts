'use server';

import { redirect } from 'next/navigation';
import { clearSessionCookies } from '@/lib/server/session';

export async function logoutAction() {
  await clearSessionCookies();
  redirect('/');
}
