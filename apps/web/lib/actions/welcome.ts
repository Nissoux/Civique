'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const WELCOME_COOKIE = 'civique_welcome_done';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Mark the welcome carousel as seen. Sets the gating cookie used by
 * /onboarding/exam-type to skip re-showing the carousel. Redirects the
 * caller to the exam-type picker.
 */
export async function completeWelcomeAction(): Promise<void> {
  const c = await cookies();
  c.set(WELCOME_COOKIE, '1', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
  redirect('/onboarding/exam-type');
}
