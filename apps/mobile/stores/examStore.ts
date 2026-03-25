import { create } from 'zustand';
import type { ExamSession, Question } from '@civique/shared';

interface ExamState {
  currentSession: ExamSession | null;
  questions: Question[];
  currentIndex: number;
  answers: Record<number, 'a' | 'b' | 'c' | 'd'>;
  startTime: number | null;

  setSession: (session: ExamSession) => void;
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: number, choice: 'a' | 'b' | 'c' | 'd') => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  reset: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  currentSession: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  startTime: null,

  setSession: (session: ExamSession) => {
    set({ currentSession: session, startTime: Date.now() });
  },

  setQuestions: (questions: Question[]) => {
    set({ questions });
  },

  setAnswer: (questionId: number, choice: 'a' | 'b' | 'c' | 'd') => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: choice },
    }));
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  goToQuestion: (index: number) => {
    set({ currentIndex: index });
  },

  reset: () => {
    set({
      currentSession: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      startTime: null,
    });
  },
}));
