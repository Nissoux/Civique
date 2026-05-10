import 'server-only';
import { fastifyFetch } from './api';

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

export interface QuotaStatus {
  isPremium: boolean;
  daily: { limit: number; used: number; resetsAt?: string };
  weekly: { limit: number; used: number; resetsAt?: string };
}

export interface HistoryEntry {
  date: string;
  totalAnswered: number;
  correctAnswers: number;
}

export type StatsPeriod = 'week' | 'month' | 'all';

export interface RecordPracticePayload {
  questionId: number;
  selectedChoice: 'a' | 'b' | 'c' | 'd';
  timeSpentMs?: number;
}

function qs(params?: Record<string, unknown>): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    search.set(k, String(v));
  }
  const s = search.toString();
  return s ? `?${s}` : '';
}

export async function recordPractice(
  payload: RecordPracticePayload,
): Promise<{ isCorrect: boolean }> {
  const res = await fastifyFetch<{ data: { isCorrect: boolean } }>(
    '/stats/practice',
    { method: 'POST', body: JSON.stringify(payload) },
    { auth: true },
  );
  return res.data;
}

export async function getStatsOverview(examType?: string): Promise<StatsOverview> {
  const res = await fastifyFetch<{ data: StatsOverview }>(
    `/stats/overview${qs({ examType })}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export async function getStatsByTheme(examType?: string): Promise<ThemeStat[]> {
  const res = await fastifyFetch<{ data: ThemeStat[] }>(
    `/stats/by-theme${qs({ examType })}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export async function getWeakAreas(): Promise<WeakArea[]> {
  const res = await fastifyFetch<{ data: WeakArea[] }>(
    '/stats/weak-areas',
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export async function getQuota(): Promise<QuotaStatus> {
  const res = await fastifyFetch<{ data: QuotaStatus }>(
    '/stats/quota',
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

export async function getStatsHistory(
  period: StatsPeriod = 'week',
): Promise<HistoryEntry[]> {
  const res = await fastifyFetch<{ data: HistoryEntry[] }>(
    `/stats/history${qs({ period })}`,
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}
