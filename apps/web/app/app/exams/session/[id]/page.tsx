import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/server/api';
import { getExamSession } from '@/lib/server/exams';
import { ExamSession } from '@/components/exam/ExamSession';

interface PageProps {
  params: Promise<{ id: string }>;
}

const FALLBACK_TIME_LIMIT_SEC = 45 * 60;

export default async function ExamSessionPage({ params }: PageProps) {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getExamSession>>;
  try {
    data = await getExamSession(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return <NotFoundView />;
    }
    return <ErrorView message="Impossible de charger l'examen." />;
  }

  const { session, questions, existingAnswers } = data;

  // If the session is already finished, send the user to results.
  if (session.finishedAt) {
    redirect(`/app/exams/results/${id}`);
  }

  if (!questions || questions.length === 0) {
    return <ErrorView message="Cet examen ne contient aucune question." />;
  }

  const startedAtMs = session.startedAt
    ? new Date(session.startedAt).getTime()
    : Date.now();
  const timeLimitSec = session.timeLimitSec || FALLBACK_TIME_LIMIT_SEC;

  return (
    <ExamSession
      sessionId={session.id}
      questions={questions}
      timeLimitSec={timeLimitSec}
      startedAtMs={startedAtMs}
      initialAnswers={existingAnswers}
    />
  );
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
          Cet examen n'existe{' '}
          <span className="display-italic text-terracotta">plus</span>.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-7">
          La session a peut-être été supprimée ou n'appartient pas à votre
          compte.
        </p>
        <Link href="/app/exams" className="btn-primary">
          Retour aux examens
        </Link>
      </div>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-3">— Erreur</p>
        <h1
          className="font-display text-3xl sm:text-4xl font-medium mb-4 leading-tight"
          style={{ fontVariationSettings: "'opsz' 60" }}
        >
          Quelque chose s'est{' '}
          <span className="display-italic text-terracotta">mal passé</span>.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-7">{message}</p>
        <Link href="/app/exams" className="btn-primary">
          Retour aux examens
        </Link>
      </div>
    </div>
  );
}
