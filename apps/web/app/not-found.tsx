import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bone flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-10">
          <Logo size="md" href="/" />
        </div>
        <p className="eyebrow mb-4">— Erreur 404</p>
        <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[1.05] mb-6 font-medium tracking-tight">
          Page<br />
          <span className="display-italic text-terracotta">introuvable</span>.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-8">
          Ce que vous cherchez a été déplacé, supprimé, ou n'a jamais existé.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
