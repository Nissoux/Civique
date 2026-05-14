import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Logo } from '@/components/brand/Logo';
import { getCurrentExamType } from '@/lib/server/examType';
import { getCurrentUser } from '@/lib/server/me';
import { ExamTypeForm } from './ExamTypeForm';

const WELCOME_COOKIE = 'civique_welcome_done';

interface PageProps {
  // Next 15 promises searchParams to async-render correctly.
  searchParams: Promise<{ change?: string }>;
}

export default async function ExamTypePage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const params = await searchParams;
  // `?change=1` arrives when the user wants to switch their target exam
  // post-onboarding (e.g. from the dashboard pill). Without this query the
  // page is part of the *first-run* funnel and re-redirecting users with
  // an existing choice is correct — otherwise refreshing /onboarding/exam-type
  // would yank them out of their dashboard after every login.
  const isChangeMode = params.change === '1';
  const existing = await getCurrentExamType();
  if (existing && !isChangeMode) redirect('/app');

  // Show the 3-slide welcome carousel before the exam-type picker on first
  // visit. Once the user advances past it, a cookie marks it done so we
  // don't loop them back into it on refresh. Change-mode users have already
  // seen it, so we don't bounce them into it again.
  if (!isChangeMode) {
    const c = await cookies();
    if (c.get(WELCOME_COOKIE)?.value !== '1') {
      redirect('/onboarding/welcome');
    }
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
          {isChangeMode ? (
            <>
              <p className="eyebrow mb-4">— Modifier votre objectif</p>
              <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] mb-5 font-medium tracking-tight">
                Changer votre <span className="display-italic text-terracotta">objectif</span>.
              </h1>
              <p className="text-ink-mute text-[1.05rem] leading-[1.6]">
                Les questions et fiches s'adapteront à votre nouvelle cible. Votre
                progression existante est conservée.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow mb-4">— Bienvenue {firstName}</p>
              <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] mb-5 font-medium tracking-tight">
                Quel examen<br />
                <span className="display-italic text-terracotta">préparez-vous</span> ?
              </h1>
              <p className="text-ink-mute text-[1.05rem] leading-[1.6]">
                Les questions et fiches s'adapteront à votre objectif. Vous pourrez
                changer ce choix à tout moment.
              </p>
            </>
          )}
        </div>

        <ExamTypeForm currentExamType={existing ?? null} />
      </section>
    </main>
  );
}
