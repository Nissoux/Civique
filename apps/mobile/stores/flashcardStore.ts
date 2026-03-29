import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = 'flashcard_progress';

export interface Flashcard {
  id: number;
  themeId: number;
  front: string;
  back: string;
  translations: {
    ar?: { front: string; back: string };
    es?: { front: string; back: string };
  };
}

type CardStatus = 'known' | 'unknown' | 'unseen';

interface FlashcardStore {
  progress: Record<number, CardStatus>;
  loadProgress: () => Promise<void>;
  markCard: (cardId: number, status: 'known' | 'unknown') => Promise<void>;
  resetProgress: () => Promise<void>;
  getThemeProgress: (themeId: number, cards: Flashcard[]) => { known: number; total: number };
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  progress: {},

  loadProgress: async () => {
    try {
      const raw = await AsyncStorage.getItem(PROGRESS_KEY);
      if (raw) {
        set({ progress: JSON.parse(raw) });
      }
    } catch {
      // silent
    }
  },

  markCard: async (cardId: number, status: 'known' | 'unknown') => {
    const updated = { ...get().progress, [cardId]: status };
    set({ progress: updated });
    try {
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    } catch {
      // silent
    }
  },

  resetProgress: async () => {
    set({ progress: {} });
    try {
      await AsyncStorage.removeItem(PROGRESS_KEY);
    } catch {
      // silent
    }
  },

  getThemeProgress: (themeId: number, cards: Flashcard[]) => {
    const themeCards = cards.filter((c) => c.themeId === themeId);
    const { progress } = get();
    const known = themeCards.filter((c) => progress[c.id] === 'known').length;
    return { known, total: themeCards.length };
  },
}));
