import Link from 'next/link';
import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
  title: 'Créer un compte',
  description:
    "Créez votre compte Civique gratuitement et commencez votre préparation à l'examen civique français. Aucune carte bancaire requise.",
  alternates: { canonical: '/register' },
  // Thin auth form — same reasoning as /login: keep it out of the index
  // so crawl budget goes to the content pages. Still reachable from
  // every CTA; `follow` keeps its outgoing links counted.
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Créez votre compte."
      subtitle="Quelques secondes pour commencer votre préparation à l'examen civique."
      footer={
        <>
          Déjà un compte ?{' '}
          <Link
            href="/login"
            className="text-terracotta font-semibold hover:underline"
          >
            Se connecter →
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
