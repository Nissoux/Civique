import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/nav/Sidebar';
import { MobileNav } from '@/components/nav/MobileNav';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentExamType, getExamTypeDefinition } from '@/lib/server/examType';
import { getCurrentLang } from '@/lib/server/lang';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/api/auth/expire');
  }

  const examTypeCode = await getCurrentExamType();
  if (!examTypeCode) {
    redirect('/onboarding/exam-type');
  }
  const examType = getExamTypeDefinition(examTypeCode);
  const currentLang = await getCurrentLang(user.preferredLang);

  return (
    <div className="min-h-screen bg-bone flex">
      <Sidebar
        user={{ displayName: user.displayName, email: user.email }}
        examLabel={examType?.shortLabel}
        currentLang={currentLang}
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 min-w-0 pb-20 lg:pb-0 focus:outline-none"
      >
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
