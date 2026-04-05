import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ExamTypeCode = 'csp' | 'cr' | 'nat';

export interface ExamTypeDefinition {
  code: ExamTypeCode;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  icon: string;
  emoji: string;
}

export const EXAM_TYPES: ExamTypeDefinition[] = [
  {
    code: 'csp',
    label: 'Carte de séjour pluriannuelle',
    shortLabel: 'Carte de séjour pluriannuelle',
    description: 'Titre de séjour de longue durée (CSP)',
    color: '#4D7CFF',
    icon: 'card-outline',
    emoji: '🪪',
  },
  {
    code: 'cr',
    label: 'Carte de résident',
    shortLabel: 'Carte de résident',
    description: 'Carte de résident de 10 ans (CR)',
    color: '#FF6B6B',
    icon: 'home-outline',
    emoji: '🏠',
  },
  {
    code: 'nat',
    label: 'Nationalité française',
    shortLabel: 'Nationalité',
    description: 'Acquisition de la nationalité française',
    color: '#FFD700',
    icon: 'flag-outline',
    emoji: '🇫🇷',
  },
];

export function getExamType(code: ExamTypeCode | null): ExamTypeDefinition | undefined {
  return EXAM_TYPES.find((e) => e.code === code);
}

const EXAM_TYPE_KEY = 'civique_exam_type';

interface ExamTypeState {
  selectedExamType: ExamTypeCode | null;
  setExamType: (type: ExamTypeCode) => Promise<void>;
  loadStoredExamType: () => Promise<void>;
}

export const useExamTypeStore = create<ExamTypeState>((set) => ({
  selectedExamType: null,

  setExamType: async (type: ExamTypeCode) => {
    await AsyncStorage.setItem(EXAM_TYPE_KEY, type);
    set({ selectedExamType: type });
  },

  loadStoredExamType: async () => {
    const stored = await AsyncStorage.getItem(EXAM_TYPE_KEY);
    if (stored) {
      set({ selectedExamType: stored as ExamTypeCode });
    }
  },
}));
