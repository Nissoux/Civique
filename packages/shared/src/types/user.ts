import type { Language } from '../constants/languages';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  preferredLang: Language;
  isPremium: boolean;
  premiumExpires?: string;
  createdAt: string;
}
