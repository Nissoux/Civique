import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentExamType } from '@/lib/server/examType';
import { DossierChecklist } from '@/components/dossier/DossierChecklist';
import type { ExamTypeCode } from '@/lib/data/dossier';

export const metadata = {
  title: 'Vérifier mon dossier',
  description:
    "Checklist personnalisée des justificatifs à préparer pour votre demande de carte de séjour pluriannuelle, carte de résident ou naturalisation française. Cochez vos pièces au fur et à mesure.",
};

/**
 * /app/dossier — interactive document-checklist tool.
 *
 * Competitive context (2026-05-15 audit): ExamenCiviqueNaturalisation
 * ships an interactive checklist that we lacked. This page closes that
 * gap with a deterministic, fully-typed alternative — no IA, no
 * server round-trips, just a well-curated dataset per (exam type ×
 * situation) and a localStorage-backed tick state.
 *
 * The page pre-selects the user's preferred exam type from
 * /lib/server/examType so candidates who already chose their target
 * during onboarding land on the relevant checklist immediately.
 */
export default async function DossierPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  // Best-effort exam type pre-fill — the checklist works without it.
  const initialExamType = (await getCurrentExamType().catch(() => null)) as
    | ExamTypeCode
    | null;

  return (
    <div className="min-h-screen">
      <div className="border-b border-aubergine/15 bg-bone-deep">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between gap-3 flex-wrap">
          <Link
            href="/app"
            className="text-sm font-medium text-aubergine hover:text-terracotta transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au tableau de bord
          </Link>
          <span className="text-xs text-ink-mute italic">
            Liste mise à jour 2026 — non officielle, à confirmer en préfecture
          </span>
        </div>
      </div>

      <DossierChecklist initialExamType={initialExamType} />
    </div>
  );
}
