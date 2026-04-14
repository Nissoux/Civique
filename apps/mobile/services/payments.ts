import api from './api';

export interface SubscriptionInfo {
  isPremium: boolean;
  premiumExpires?: string;
}

export async function getSubscription(): Promise<SubscriptionInfo> {
  const { data } = await api.get('/payments/subscription');
  return data.data;
}
