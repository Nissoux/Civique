import { create } from 'zustand';
import { getSubscription } from '../services/payments';

interface SubscriptionState {
  isPremium: boolean;
  premiumExpires: string | null;
  isLoading: boolean;
  fetchSubscription: () => Promise<void>;
  setPremium: (isPremium: boolean, premiumExpires?: string) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isPremium: false,
  premiumExpires: null,
  isLoading: false,

  fetchSubscription: async () => {
    set({ isLoading: true });
    try {
      const info = await getSubscription();
      set({
        isPremium: info.isPremium,
        premiumExpires: info.premiumExpires ?? null,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  setPremium: (isPremium, premiumExpires) => {
    set({
      isPremium,
      premiumExpires: premiumExpires ?? null,
    });
  },
}));
