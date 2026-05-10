import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from './RegisterForm';

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
