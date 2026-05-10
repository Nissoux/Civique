import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentExamType } from '@/lib/server/examType';
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

  const [overview, themeStats, weakAreas, initialHistory] = await Promise.all([
    getStatsOverview(examType).catch(() => null),
    getStatsByTheme(examType).catch(() => []),
    getWeakAreas().catch(() => []),
    getStatsHistory('week').catch(() => []),
  ]);

  return (
    <StatsClient
      overview={overview}
      themeStats={themeStats}
      weakAreas={weakAreas}
      initialHistory={initialHistory}
    />
  );
}
