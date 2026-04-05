import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Question } from '@civique/shared';

const TRAINING_KEY = 'civique_training_session';

interface TrainingSessionState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string>; // questionId -> choiceId
  correctCount: number;
  isActive: boolean;
}

interface TrainingStore {
  session: TrainingSessionState | null;

  saveSession: (state: TrainingSessionState) => Promise<void>;
  loadSession: () => Promise<TrainingSessionState | null>;
  clearSession: () => Promise<void>;
}

export const useTrainingStore = create<TrainingStore>((set) => ({
  session: null,

  saveSession: async (state: TrainingSessionState) => {
    try {
      await AsyncStorage.setItem(TRAINING_KEY, JSON.stringify(state));
      set({ session: state });
    } catch {
      // silent
    }
  },

  loadSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(TRAINING_KEY);
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

  clearSession: async () => {
    await AsyncStorage.removeItem(TRAINING_KEY);
    set({ session: null });
  },
}));
