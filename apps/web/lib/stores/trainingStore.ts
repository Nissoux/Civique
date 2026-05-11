'use client';

import { create } from 'zustand';
import type { Question } from '@civique/shared';

const STORAGE_KEY = 'civique_training_session';

export interface TrainingSessionState {
  themeId?: number;
  levelNum?: number;
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string>; // questionId -> selected choice (post-shuffle: 'a'|'b'|'c'|'d')
  correctCount: number;
  isActive: boolean;
}

interface TrainingStore {
  session: TrainingSessionState | null;
  saveSession: (state: TrainingSessionState) => void;
  loadSession: () => TrainingSessionState | null;
  clearSession: () => void;
}

export const useTrainingStore = create<TrainingStore>((set) => ({
  session: null,

  saveSession: (state) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      set({ session: state });
    } catch {
      // silent
    }
  },

  loadSession: () => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const session = JSON.parse(raw) as TrainingSessionState;
        set({ session });
        return session;
      }
    } catch {
      // silent
    }
    return null;
  },

  clearSession: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ session: null });
  },
}));
