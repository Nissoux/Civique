import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Logo } from '@/components/brand/Logo';
import { getCurrentExamType } from '@/lib/server/examType';
import { getCurrentUser } from '@/lib/server/me';
import { ExamTypeForm } from './ExamTypeForm';

const WELCOME_COOKIE = 'civique_welcome_done';

export default async function ExamTypePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const existing = await getCurrentExamType();
  if (existing) redirect('/app');

  // Show the 3-slide welcome carousel before the exam-type picker on first
  // visit. Once the user advances past it, a cookie marks it done so we
  // don't loop them back into it on refresh.
  const c = await cookies();
  if (c.get(WELCOME_COOKIE)?.value !== '1') {
    redirect('/onboarding/welcome');
  }

  const firstName = user.displayName.split(' ')[0];

  return (
    <main className="min-h-screen bg-bone">
      <header className="border-b border-aubergine/15">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-5">
          <Logo />
        </div>
      </header>

      <section className="max-w-[1340px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-4">— Bienvenue {firstName}</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] mb-5 font-medium tracking-tight">
            Quel examen<br />
            <span className="display-italic text-terracotta">préparez-vous</span> ?
          </h1>
          <p className="text-ink-mute text-[1.05rem] leading-[1.6]">
            Les questions et fiches s'adapteront à votre objectif. Vous pourrez
            changer ce choix à tout moment.
          </p>
        </div>

        <ExamTypeForm />
      </section>
    </main>
  );
}
