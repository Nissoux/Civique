import { redirect } from 'next/navigation';
import type { Question } from '@civique/shared';
import { getRandomQuestions } from '@/lib/server/questions';
import { getCurrentExamType } from '@/lib/server/examType';
import { FlashcardQuizSession } from '@/components/flashcard/FlashcardQuizSession';

export const metadata = {
  title: 'Quiz révision — Civique',
};

export const dynamic = 'force-dynamic';

/**
 * Quiz révision = 10 questions mixtes (7 connaissances + 3 mises en situation),
 * tirées aléatoirement parmi tout le corpus de l'examen courant.
 */
export default async function FlashcardQuizPage() {
  const examType = await getCurrentExamType();
  if (!examType) {
    redirect('/onboarding/exam-type');
  }

  // Try to fetch each pool separately when the API supports a `type` filter via
  // getRandomQuestions; if not available, fall back to a single random call and
  // pad/truncate locally.
  const all = await safeGetRandom({ count: 30, examType });
  const knowledge = all.filter((q) => q.type !== 'situational');
  const situational = all.filter((q) => q.type === 'situational');

  let mixed: Question[] = [];
  if (knowledge.length >= 7 && situational.length >= 3) {
    mixed = [...knowledge.slice(0, 7), ...situational.slice(0, 3)];
  } else {
    // Best-effort: take what we can, complete with whatever's left.
    mixed = [
      ...knowledge.slice(0, 7),
      ...situational.slice(0, 3),
    ];
    if (mixed.length < 10) {
      const used = new Set(mixed.map((q) => q.id));
      for (const q of all) {
        if (mixed.length >= 10) break;
        if (!used.has(q.id)) {
          mixed.push(q);
          used.add(q.id);
        }
      }
    }
  }

  // Final shuffle for variety
  mixed = shuffleArray(mixed).slice(0, 10);

  if (mixed.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="eyebrow mb-3">— Quiz indisponible</p>
        <h1
          className="font-display text-3xl sm:text-4xl leading-[1.05] font-medium tracking-tight mb-4"
          style={{ fontVariationSettings: "'opsz' 96" }}
        >
          Aucune question disponible.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-6">
          Veuillez réessayer plus tard.
        </p>
        <a href="/app/flashcards" className="btn-primary">
          Retour aux révisions
        </a>
      </div>
    );
  }

  return <FlashcardQuizSession questions={mixed} />;
}

async function safeGetRandom(params: { count: number; examType: string }) {
  try {
    return await getRandomQuestions(params);
  } catch {
    return [];
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
