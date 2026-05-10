'use server';

import { ApiError } from '@/lib/server/api';
import {
  getStatsHistory,
  type HistoryEntry,
  type StatsPeriod,
} from '@/lib/server/stats';

export interface StatsHistoryResult {
  ok: boolean;
  entries?: HistoryEntry[];
  error?: string;
}

export async function fetchStatsHistoryAction(
  period: StatsPeriod,
): Promise<StatsHistoryResult> {
  try {
    const entries = await getStatsHistory(period);
    return { ok: true, entries };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.userMessage };
    }
    return { ok: false, error: 'Une erreur est survenue.' };
  }
}
