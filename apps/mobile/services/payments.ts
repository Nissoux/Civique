import api from './api';

export interface SubscriptionInfo {
  isPremium: boolean;
  premiumExpires?: string;
}

export async function getSubscription(): Promise<SubscriptionInfo> {
  const { data } = await api.get('/payments/subscription');
  return data.data;
}

export async function createCheckout(plan: 'monthly' | 'yearly'): Promise<{ url: string }> {
  const { data } = await api.post('/payments/create-checkout', { plan });
  return data.data;
}
