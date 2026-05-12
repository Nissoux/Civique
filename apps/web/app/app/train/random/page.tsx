import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentExamType } from '@/lib/server/examType';
import { getCurrentLang } from '@/lib/server/lang';
import { getRandomQuestions } from '@/lib/server/questions';
import { TrainingSession } from '@/components/train/TrainingSession';

const RANDOM_COUNT = 10;

export default async function RandomTrainingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const examType = await getCurrentExamType();
  if (!examType) redirect('/onboarding/exam-type');

  const lang = await getCurrentLang(user.preferredLang);
  const questions = await getRandomQuestions({
    count: RANDOM_COUNT,
    examType,
    lang,
  });

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="eyebrow mb-3">— Entraînement rapide</p>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-5 font-medium">
          Aucune question <span className="display-italic text-terracotta">disponible</span>.
        </h1>
        <Link href="/app" className="btn-primary">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  // Random training doesn't belong to a single theme/level — pass placeholder
  // values that the SessionResults won't trigger progression for since
  // completeLevel is theme-specific. We use themeId=0 + levelNum=0 as sentinel.
  return (
    <TrainingSession
      themeId={0}
      levelNum={0}
      totalLevels={0}
      questions={questions}
      currentLang={lang}
    />
  );
}
