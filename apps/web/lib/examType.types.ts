// Shared on client + server (no 'server-only' import).
export type ExamTypeCode = 'csp' | 'cr' | 'nat';

export interface ExamTypeDefinition {
  code: ExamTypeCode;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  emoji: string;
}

export const EXAM_TYPES: ExamTypeDefinition[] = [
  {
    code: 'csp',
    label: 'Carte de séjour pluriannuelle',
    shortLabel: 'Carte de séjour',
    description: 'Titre de séjour de longue durée (CSP)',
    color: '#4D7CFF',
    emoji: '🪪',
  },
  {
    code: 'cr',
    label: 'Carte de résident',
    shortLabel: 'Carte de résident',
    description: 'Carte de résident de 10 ans (CR)',
    color: '#ED2939',
    emoji: '🏠',
  },
  {
    code: 'nat',
    label: 'Nationalité française',
    shortLabel: 'Nationalité',
    description: 'Acquisition de la nationalité française',
    color: '#002395',
    emoji: '🇫🇷',
  },
];

export function getExamTypeDefinition(
  code: ExamTypeCode | null | undefined,
): ExamTypeDefinition | undefined {
  if (!code) return undefined;
  return EXAM_TYPES.find((e) => e.code === code);
}
