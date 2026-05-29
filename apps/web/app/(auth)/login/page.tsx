import Link from 'next/link';
import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { FormMessage } from '@/components/auth/FormMessage';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Se connecter',
  description:
    "Connectez-vous à votre compte Civique pour reprendre votre préparation à l'examen civique français.",
  alternates: { canonical: '/login' },
};

interface PageProps {
  searchParams: Promise<{ next?: string; reset?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = params.next ?? '/app';
  const justReset = params.reset === '1';

  return (
    <AuthShell
      title="Bon retour."
      subtitle="Connectez-vous pour reprendre votre préparation."
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link
            href="/register"
            className="text-terracotta font-semibold hover:underline"
          >
            Créer un compte →
          </Link>
        </>
      }
    >
      {justReset ? (
        <div className="mb-5">
          <FormMessage message="Mot de passe mis à jour. Connectez-vous avec le nouveau." />
        </div>
      ) : null}
      <LoginForm next={next} />
    </AuthShell>
  );
}
