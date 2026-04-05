import { create } from 'zustand';

interface OnboardingState {
  done: boolean;
  setDone: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  done: false,
  setDone: (value: boolean) => set({ done: value }),
}));
