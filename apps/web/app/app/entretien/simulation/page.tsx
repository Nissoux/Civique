import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/server/me';
import { SimulationChat } from '@/components/entretien/SimulationChat';
import entretienData from '@/lib/data/entretien.json';

export const metadata = {
  title: "Simulation d'entretien d'assimilation",
  description:
    "Entraînez-vous à l'entretien d'assimilation comme à la préfecture. 240 questions types, scoring local de votre réponse, modèle complet révélé après chaque tour. Sans aucun envoi vers un serveur.",
};

interface EntretienQuestion {
  id: number;
  category: string;
  text_fr: string;
  answer_hint: string;
}

interface EntretienData {
  total: number;
  categories: Record<string, string>;
  questions: EntretienQuestion[];
}

/**
 * /app/entretien/simulation — chat-style dry run of the naturalisation
 * assimilation interview.
 *
 * Why a separate route from /app/entretien (the browser)
 * ------------------------------------------------------
 * The browser at /app/entretien is a passive reference — read the
 * question, read the answer hint. The simulation is an active mode
 * — the user must compose their own answer before seeing the hint.
 * Same data, different cognitive contract. Splitting routes lets us
 * track engagement separately (later) and keeps the browser fast
 * and JS-light by default.
 *
 * The competitive audit (2026-05-15) flagged this exact feature as
 * P0 — LeTestCivique and ExamenCiviqueNaturalisation both ship an
 * IA-grading equivalent, we previously had nothing. This is the
 * deterministic, privacy-preserving alternative.
 */
export default async function SimulationPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const data = entretienData as unknown as EntretienData;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb / context bar */}
      <div className="border-b border-aubergine/15 bg-bone-deep">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between gap-3 flex-wrap">
          <Link
            href="/app/entretien"
            className="text-sm font-medium text-aubergine hover:text-terracotta transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la base de questions
          </Link>
          <span className="text-xs text-ink-mute italic">
            Mode simulation — vos réponses ne quittent pas votre appareil
          </span>
        </div>
      </div>

      <SimulationChat
        questions={data.questions}
        categories={data.categories}
      />
    </div>
  );
}
