import { getCurrentUser } from '@/lib/server/me';
import { getCurrentLang } from '@/lib/server/lang';
import { EntretienBrowser } from '@/components/entretien/EntretienBrowser';
import entretienData from '@/lib/data/entretien.json';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Entretien d'assimilation",
  description:
    "240 questions types posées à l'entretien d'assimilation en préfecture pour la naturalisation française. Conseils de réponse en français, anglais et turc.",
};

interface EntretienQuestion {
  id: number;
  category: string;
  text_fr: string;
  answer_hint: string;
  translations: {
    en?: { text: string; answer_hint: string };
    tr?: { text: string; answer_hint: string };
  };
}

interface EntretienData {
  total: number;
  categories: Record<string, string>;
  questions: EntretienQuestion[];
}

/**
 * Page /app/entretien — preparation for the préfecture assimilation
 * interview (only required for naturalisation candidates, not CSP/CR).
 *
 * Why an authenticated module
 * ---------------------------
 * The 240-question corpus is a real differentiator versus competitors,
 * which either gate it behind paid PDFs or simply don't ship it. Putting
 * it inside /app keeps it part of the value the user paid (or will pay)
 * for, and lets us track engagement (later — useful for SRS on oral prep
 * too).
 *
 * The page is a server shell: it resolves the user + active translation
 * language, then hands a typed JSON corpus to a client browser
 * component that owns the search + category filter + bilingual display.
 */
export default async function EntretienPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const currentLang = await getCurrentLang(user.preferredLang);

  return (
    <EntretienBrowser
      data={entretienData as unknown as EntretienData}
      currentLang={currentLang}
    />
  );
}
