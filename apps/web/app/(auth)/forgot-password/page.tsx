import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { ForgotPasswordForm } from './ForgotPasswordForm';

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
