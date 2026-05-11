import { redirect } from 'next/navigation';
import { THEMES } from '@civique/shared';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentExamType } from '@/lib/server/examType';
import { getThemeQuestionCount } from '@/lib/server/questions';
import { computeLevelsForTheme } from '@/lib/shuffleChoices';
import {
  getStatsOverview,
  getStatsByTheme,
  getWeakAreas,
  getStatsHistory,
} from '@/lib/server/stats';
import { StatsClient } from './StatsClient';

export default async function StatsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const examType = await getCurrentExamType();
  if (!examType) redirect('/onboarding/exam-type');

  const [overview, themeStats, weakAreas, initialHistory, themeQuestionCounts] =
    await Promise.all([
      getStatsOverview(examType).catch(() => null),
      getStatsByTheme(examType).catch(() => []),
      getWeakAreas().catch(() => []),
      getStatsHistory('week').catch(() => []),
      Promise.all(
        THEMES.map(async (t) => ({
          themeId: t.id,
          total: await getThemeQuestionCount(t.id, examType),
        })),
      ),
    ]);

  // Compute level counts from real question totals (10 questions/level), the
  // same convention the dashboard uses — replaces the previous hardcoded 5.
  const levelCountByTheme: Record<number, number> = {};
  for (const { themeId, total } of themeQuestionCounts) {
    levelCountByTheme[themeId] = computeLevelsForTheme(total);
  }

  return (
    <StatsClient
      overview={overview}
      themeStats={themeStats}
      weakAreas={weakAreas}
      initialHistory={initialHistory}
      levelCountByTheme={levelCountByTheme}
    />
  );
}
