import Link from 'next/link';
import { ApiError } from '@/lib/server/api';
import { getExamResults } from '@/lib/server/exams';
import { ExamResults } from '@/components/exam/ExamResults';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamResultsPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const results = await getExamResults(id);
    return <ExamResults results={results} />;
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 404) return <NotFoundView />;
      if (err.status === 400) {
        // "Exam not yet finished" — send back to session.
        return <UnfinishedView sessionId={id} />;
      }
    }
    return <ErrorView />;
  }
}

function NotFoundView() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-3">— Introuvable</p>
        <h1
          className="font-display text-3xl sm:text-4xl font-medium mb-4 leading-tight"
          style={{ fontVariationSettings: "'opsz' 60" }}
        >
          Résultats{' '}
          <span className="display-italic text-terracotta">indisponibles</span>.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-7">
          Cet examen n'existe pas ou n'appartient pas à votre compte.
        </p>
        <Link href="/app/exams" className="btn-primary">
          Retour aux examens
        </Link>
      </div>
    </div>
  );
}

function UnfinishedView({ sessionId }: { sessionId: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-3">— En cours</p>
        <h1
          className="font-display text-3xl sm:text-4xl font-medium mb-4 leading-tight"
          style={{ fontVariationSettings: "'opsz' 60" }}
        >
          Cet examen n'est pas{' '}
          <span className="display-italic text-terracotta">terminé</span>.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-7">
          Reprenez votre session pour voir vos résultats.
        </p>
        <Link
          href={`/app/exams/session/${sessionId}`}
          className="btn-primary"
        >
          Reprendre l'examen
        </Link>
      </div>
    </div>
  );
}

function ErrorView() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-3">— Erreur</p>
        <h1
          className="font-display text-3xl sm:text-4xl font-medium mb-4 leading-tight"
          style={{ fontVariationSettings: "'opsz' 60" }}
        >
          Impossible de charger les{' '}
          <span className="display-italic text-terracotta">résultats</span>.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-7">
          Réessayez dans un instant.
        </p>
        <Link href="/app/exams" className="btn-primary">
          Retour aux examens
        </Link>
      </div>
    </div>
  );
}
