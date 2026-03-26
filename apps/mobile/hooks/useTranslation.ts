import { useLanguageStore } from '../stores/languageStore';
import { LANGUAGES, type Language } from '@civique/shared';

export function useTranslation() {
  const { currentLang, setLanguage } = useLanguageStore();

  const langDef = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];
  const isRTL = langDef.rtl;

  const cycleLang = async () => {
    const idx = LANGUAGES.findIndex((l) => l.code === currentLang);
    const nextIdx = (idx + 1) % LANGUAGES.length;
    await setLanguage(LANGUAGES[nextIdx].code);
  };

  return {
    currentLang,
    setLanguage,
    isRTL,
    langDef,
    cycleLang,
  };
}
