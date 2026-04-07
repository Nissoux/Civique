import { create } from 'zustand';
import { checkPremiumStatus } from '../services/revenuecat';
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
      // Check RevenueCat first (IAP purchases)
      const rcPremium = await checkPremiumStatus();

      // Also check server (promo codes, manual grants)
      const serverInfo = await getSubscription();

      const isPremium = rcPremium || serverInfo.isPremium;

      set({
        isPremium,
        premiumExpires: serverInfo.premiumExpires ?? null,
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
