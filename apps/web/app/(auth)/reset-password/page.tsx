import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { ResetPasswordForm } from './ResetPasswordForm';

interface PageProps {
  searchParams: Promise<{ token?: string; sent?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  // ?token=... pre-fills the code (e.g. from an email link).
  // ?sent=<email> means we just dispatched a code — display it for confirmation.
  const initialCode = params.token?.trim();
  const sentTo = params.sent?.trim();

  return (
    <AuthShell
      title="Nouveau mot de passe."
      subtitle={
        sentTo
          ? `Un code à 8 caractères vient d'être envoyé à ${sentTo}. Entrez-le ci-dessous puis choisissez un nouveau mot de passe.`
          : "Entrez le code à 8 caractères reçu par email puis choisissez un nouveau mot de passe."
      }
      footer={
        <>
          Pas reçu d'email ?{' '}
          <Link
            href="/forgot-password"
            className="text-terracotta font-semibold hover:underline"
          >
            Renvoyer un code →
          </Link>
        </>
      }
    >
      <ResetPasswordForm initialCode={initialCode} />
    </AuthShell>
  );
}
