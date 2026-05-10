import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentExamType } from '@/lib/server/examType';
import { WelcomeCarousel } from './WelcomeCarousel';

const WELCOME_COOKIE = 'civique_welcome_done';

export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  // If they already chose an exam type, the welcome carousel is moot.
  const examType = await getCurrentExamType();
  if (examType) redirect('/app');

  // If welcome was already marked done, skip straight to exam-type picker.
  const c = await cookies();
  if (c.get(WELCOME_COOKIE)?.value === '1') {
    redirect('/onboarding/exam-type');
  }

  return (
    <main className="bg-aubergine">
      <WelcomeCarousel />
    </main>
  );
}
