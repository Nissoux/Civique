import Link from 'next/link';
import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Mot de passe oublié — Civique',
  description:
    "Réinitialisez votre mot de passe Civique. Nous vous enverrons un code à 8 caractères pour récupérer l'accès à votre compte.",
  alternates: { canonical: '/forgot-password' },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Mot de passe oublié ?"
      subtitle="Entrez votre email — nous vous enverrons un code à 8 caractères pour le réinitialiser."
      footer={
        <Link
          href="/login"
          className="text-terracotta font-semibold hover:underline"
        >
          ← Retour à la connexion
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
