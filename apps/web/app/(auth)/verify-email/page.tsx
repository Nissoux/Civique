import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { getCurrentUser } from '@/lib/server/me';
import { VerifyEmailForm } from './VerifyEmailForm';

export default async function VerifyEmailPage() {
  const user = await getCurrentUser();

  // Middleware ensures a session before reaching this page; null here means
  // the access cookie is valid but /me failed (e.g. user deleted upstream).
  if (!user) {
    redirect('/api/auth/expire');
  }

  // If somehow already verified, skip ahead.
  if ((user as { emailVerified?: boolean }).emailVerified) {
    redirect('/app');
  }

  return (
    <AuthShell
      title="Vérifiez votre email."
      subtitle={`Nous avons envoyé un code à 6 chiffres à ${user.email}. Entrez-le pour finaliser votre inscription.`}
    >
      <VerifyEmailForm />
    </AuthShell>
  );
}
