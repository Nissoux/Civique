'use server';

import { fastifyFetch } from '@/lib/server/api';

/**
 * Adaptive-learning server actions.
 *
 * Wraps GET /api/learning/recommendations and exposes a typed shape
 * the dashboard widget consumes. Fails open: returns null on any
 * error so the widget renders nothing rather than blowing up the
 * entire dashboard.
 */

export interface ThemeWeakness {
  theme_id: number;
  theme_name: string;
  attempts: number;
  correct: number;
  accuracy: number; // 0-100
  severity: number; // 0-1
}

export interface SubtopicWeakness {
  theme_id: number;
  subtopic: string;
  attempts: number;
  correct: number;
  accuracy: number;
  severity: number;
}

export interface LearningRecommendations {
  theme_weaknesses: ThemeWeakness[];
  subtopic_weaknesses: SubtopicWeakness[];
  min_attempts: number;
  as_of: string;
}

export async function fetchRecommendations(): Promise<LearningRecommendations | null> {
  try {
    const res = await fastifyFetch<{ data: LearningRecommendations }>(
      '/learning/recommendations',
      { method: 'GET' },
      { auth: true },
    );
    return res.data;
  } catch {
    return null;
  }
}

// subtopicLabel lives in apps/web/lib/subtopics.ts — extracted because
// Next.js requires every export of a 'use server' module to be an
// async function, and a pure label lookup doesn't need to be one.
