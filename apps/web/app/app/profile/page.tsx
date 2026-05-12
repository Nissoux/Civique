import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LANGUAGES } from '@civique/shared';
import { getCurrentUser } from '@/lib/server/me';
import {
  getCurrentExamType,
  getExamTypeDefinition,
} from '@/lib/server/examType';
import { getCurrentLang } from '@/lib/server/lang';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { DangerZone } from '@/components/profile/DangerZone';
import { LogoutSection } from '@/components/profile/LogoutSection';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const examTypeCode = await getCurrentExamType();
  const examDef = examTypeCode ? getExamTypeDefinition(examTypeCode) : null;

  // The sidebar picker writes to the cookie immediately; the DB sync is
  // best-effort (see lib/actions/lang.ts). Show the cookie value here so
  // the form always reflects what the user just picked, and a subsequent
  // Save re-asserts that value to the DB.
  const currentLang = await getCurrentLang(user.preferredLang);

  const initial = user.displayName.trim()[0]?.toUpperCase() ?? 'U';
  const langDef = LANGUAGES.find((l) => l.code === currentLang);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-aubergine text-bone overflow-hidden border-b-[1.5px] border-aubergine">
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-terracotta/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-saffron/20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 py-10 sm:py-12">
          <div className="flex items-center gap-5 sm:gap-6">
            <span
              aria-hidden
              className="
                flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center
                rounded-full bg-terracotta text-bone
                font-display text-3xl sm:text-4xl font-medium
                shadow-[0_4px_0_rgb(74_45_67)]
                border-[1.5px] border-bone/20
              "
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              {initial}
            </span>

            <div className="min-w-0">
              <p className="font-display italic text-saffron text-base mb-1">
                — Votre compte
              </p>
              <h1
                className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] leading-[1.05] font-medium tracking-tight truncate"
                style={{ fontVariationSettings: "'opsz' 60" }}
              >
                Bonjour, <span className="display-italic text-terracotta">{user.displayName.split(' ')[0]}</span>
              </h1>
              <p className="text-sm text-bone/70 mt-1 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {examDef ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-bone/10 backdrop-blur px-3 py-1.5 text-xs font-semibold border border-bone/20">
                <span aria-hidden>{examDef.emoji}</span>
                {examDef.shortLabel}
              </span>
            ) : null}
            {langDef ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-bone/10 backdrop-blur px-3 py-1.5 text-xs font-semibold border border-bone/20">
                <span aria-hidden>🌐</span>
                {langDef.nativeName}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10 space-y-8">
        {/* Mon compte */}
        <Section
          eyebrow="— Mon compte"
          title={
            <>
              Vos <span className="display-italic text-terracotta">informations</span>
            </>
          }
          description="Modifiez votre nom d'affichage et la langue dans laquelle les questions sont traduites."
        >
          <ProfileForm
            initialDisplayName={user.displayName}
            initialLang={currentLang}
            email={user.email}
            emailVerified={
              (user as { emailVerified?: boolean }).emailVerified !== false
            }
          />
        </Section>

        {/* Mot de passe */}
        <Section
          eyebrow="— Sécurité"
          title={
            <>
              Mot de <span className="display-italic text-terracotta">passe</span>
            </>
          }
          description="Choisissez un mot de passe d'au moins 8 caractères. Vous serez prévenu(e) par e-mail."
        >
          <ChangePasswordForm />
        </Section>

        {/* Examen ciblé */}
        <Section
          eyebrow="— Examen ciblé"
          title={
            <>
              Votre <span className="display-italic text-terracotta">objectif</span>
            </>
          }
          description="Vous pouvez changer d'examen à tout moment. Votre progression reste enregistrée pour chaque examen."
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-ink-mute font-display italic mb-0.5">
                — Sélection actuelle
              </p>
              <p className="font-display text-xl font-medium text-aubergine truncate" style={{ fontVariationSettings: "'opsz' 32" }}>
                {examDef ? `${examDef.emoji} ${examDef.label}` : 'Non défini'}
              </p>
            </div>
            <Link href="/onboarding/exam-type" className="btn-secondary">
              Changer d'examen
            </Link>
          </div>
        </Section>

        {/* Déconnexion */}
        <Section
          eyebrow="— Session"
          title={
            <>
              <span className="display-italic text-terracotta">Déconnexion</span>
            </>
          }
          description="Vous pourrez vous reconnecter à tout moment avec votre e-mail."
        >
          <LogoutSection />
        </Section>

        {/* Zone dangereuse */}
        <section className="rounded-2xl border-[1.5px] border-fr-red/40 bg-error-bg/40 p-6 sm:p-8">
          <header className="mb-5">
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-fr-red mb-2">
              — Zone dangereuse
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-fr-red"
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              Supprimer votre <span className="display-italic">compte</span>
            </h2>
          </header>
          <DangerZone />
        </section>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card !rounded-2xl p-6 sm:p-8">
      <header className="mb-6">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2
          className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
          style={{ fontVariationSettings: "'opsz' 60" }}
        >
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-ink-mute mt-2 leading-relaxed">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
