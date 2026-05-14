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

/**
 * Human-readable label for a sub-topic code. The codes are stable
 * (used in DB and SQL queries), the labels are presentation-only and
 * can evolve without a migration.
 *
 * Living next to fetchRecommendations because the dashboard widget
 * is the only consumer for now; if a second consumer shows up we
 * promote this to a shared module.
 */
export function subtopicLabel(code: string): string {
  const labels: Record<string, string> = {
    devise: 'Devise et symboles',
    laicite: 'Laïcité',
    situation: 'Mises en situation',
    vote: 'Démocratie et droit de vote',
    organisation: 'Organisation de la République',
    union_europ: 'Union européenne',
    droits_fond: 'Droits fondamentaux',
    obligations: 'Obligations et devoirs',
    periodes: 'Périodes et personnages',
    geographie: 'Géographie de la France',
    patrimoine: 'Patrimoine français',
    installation: 'S’installer en France',
    soins: 'Accès aux soins',
    travail: 'Travailler en France',
    education: 'Autorité parentale et école',
  };
  return labels[code] ?? code;
}
