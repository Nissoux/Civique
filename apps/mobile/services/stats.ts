import api from './api';

export interface RecordPracticePayload {
  questionId: number;
  selectedChoice: 'a' | 'b' | 'c' | 'd';
  timeSpentMs?: number;
}

export async function recordPractice(
  payload: RecordPracticePayload,
): Promise<{ isCorrect: boolean }> {
  const { data } = await api.post<{ data: { isCorrect: boolean } }>(
    '/stats/practice',
    payload,
  );
  return data.data;
}

export interface StatsOverview {
  totalPracticed: number;
  totalCorrect: number;
  overallAccuracy: number;
  currentStreak: number;
  examsTaken: number;
  examsPassed: number;
  averageExamScore: number;
  lastPracticeAt: string | null;
}

export interface ThemeStat {
  themeId: number;
  themeName: string;
  totalAnswered: number;
  correctAnswers: number;
  accuracy: number;
}

export interface WeakArea {
  themeId: number;
  themeName: string;
  accuracy: number;
}

export interface HistoryEntry {
  date: string;
  totalAnswered: number;
  correctAnswers: number;
}

export async function getStatsOverview(examType?: string): Promise<StatsOverview> {
  const { data } = await api.get('/stats/overview', { params: examType ? { examType } : undefined });
  return data.data;
}

export async function getStatsByTheme(examType?: string): Promise<ThemeStat[]> {
  const { data } = await api.get('/stats/by-theme', { params: examType ? { examType } : undefined });
  return data.data;
}

export async function getWeakAreas(): Promise<WeakArea[]> {
  const { data } = await api.get('/stats/weak-areas');
  return data.data;
}

export interface QuotaStatus {
  isPremium: boolean;
  daily: { limit: number; used: number };
  weekly: { limit: number; used: number };
}

export async function getQuota(): Promise<QuotaStatus> {
  const { data } = await api.get('/stats/quota');
  return data.data;
}

export async function getStatsHistory(period: 'week' | 'month' | 'all' = 'week'): Promise<HistoryEntry[]> {
  const { data } = await api.get('/stats/history', { params: { period } });
  return data.data;
}
