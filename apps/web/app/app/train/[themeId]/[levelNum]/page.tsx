import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { THEMES } from '@civique/shared';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentExamType } from '@/lib/server/examType';
import { getCurrentLang } from '@/lib/server/lang';
import { getQuestions, getThemeQuestionCount } from '@/lib/server/questions';
import { computeLevelsForTheme } from '@/lib/shuffleChoices';
import { TrainingSession } from '@/components/train/TrainingSession';

interface PageProps {
  params: Promise<{ themeId: string; levelNum: string }>;
}

const QUESTIONS_PER_LEVEL = 10;

export default async function TrainingLevelPage({ params }: PageProps) {
  const { themeId: themeIdRaw, levelNum: levelNumRaw } = await params;
  const themeId = Number(themeIdRaw);
  const levelNum = Number(levelNumRaw);

  if (!Number.isFinite(themeId) || !Number.isFinite(levelNum) || levelNum < 1) {
    notFound();
  }

  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) notFound();

  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const examType = await getCurrentExamType();
  if (!examType) redirect('/onboarding/exam-type');

  const lang = await getCurrentLang(user.preferredLang);

  // Fetch in parallel: total count for level math + just this level's slice
  // (backend caps `limit` at 100, so we paginate via offset rather than dump).
  const [total, page] = await Promise.all([
    getThemeQuestionCount(themeId, examType),
    getQuestions({
      themeId,
      examType,
      lang,
      limit: QUESTIONS_PER_LEVEL,
      offset: (levelNum - 1) * QUESTIONS_PER_LEVEL,
    }),
  ]);

  if (total === 0) {
    return <NoQuestions themeId={themeId} themeName={theme.nameFr} />;
  }

  const totalLevels = computeLevelsForTheme(total, QUESTIONS_PER_LEVEL);
  if (levelNum > totalLevels) notFound();

  const questions = page.data;
  if (questions.length === 0) {
    return <NoQuestions themeId={themeId} themeName={theme.nameFr} />;
  }

  return (
    <TrainingSession
      themeId={themeId}
      levelNum={levelNum}
      totalLevels={totalLevels}
      questions={questions}
    />
  );
}

function NoQuestions({ themeId, themeName }: { themeId: number; themeName: string }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <p className="eyebrow mb-3">— Thème {themeId}</p>
      <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-5 font-medium">
        Pas de questions <span className="display-italic text-terracotta">disponibles</span>.
      </h1>
      <p className="text-ink-mute leading-relaxed mb-8">
        Le thème <em className="display-italic">{themeName}</em> n'a pas
        encore de questions pour votre type d'examen.
      </p>
      <Link href="/app" className="btn-primary">
        Retour au tableau de bord
      </Link>
    </div>
  );
}
