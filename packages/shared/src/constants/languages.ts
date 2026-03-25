export type Language = 'fr' | 'ar' | 'fa' | 'pt' | 'es' | 'hi';

export interface LanguageDefinition {
  code: Language;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const LANGUAGES: LanguageDefinition[] = [
  { code: 'fr', name: 'French', nativeName: 'Fran\u00e7ais', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', rtl: true },
  { code: 'fa', name: 'Farsi', nativeName: '\u0641\u0627\u0631\u0633\u06cc', rtl: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugu\u00eas', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Espa\u00f1ol', rtl: false },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940', rtl: false },
];
