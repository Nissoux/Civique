import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server/me';
import {
  getCurrentExamType,
  getExamTypeDefinition,
} from '@/lib/server/examType';

interface SettingsCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  external?: boolean;
}

const ChevronRight = () => (
  <svg
    className="h-5 w-5 shrink-0 text-aubergine/50 transition-transform group-hover:translate-x-1 group-hover:text-terracotta"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

function SettingsCard({
  href,
  icon,
  title,
  description,
  external,
}: SettingsCardProps) {
  const inner = (
    <>
      <div
        aria-hidden
        className="
          flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center
          rounded-2xl bg-bone-deep border-[1.5px] border-aubergine/15
          text-2xl sm:text-3xl
          transition-colors group-hover:bg-saffron/30 group-hover:border-aubergine/30
        "
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="font-display text-lg sm:text-xl font-medium text-aubergine leading-snug"
          style={{ fontVariationSettings: "'opsz' 32" }}
        >
          {title}
        </h3>
        <p className="text-sm text-ink-mute leading-relaxed mt-1">
          {description}
        </p>
      </div>
      <ChevronRight />
    </>
  );

  const baseClass =
    'group flex items-center gap-4 sm:gap-5 rounded-2xl border-[1.5px] border-aubergine/15 bg-bone p-5 sm:p-6 transition-colors hover:border-aubergine/40 hover:bg-bone-deep/40 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-bone';

  if (external) {
    return (
      <a href={href} className={baseClass}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={baseClass}>
      {inner}
    </Link>
  );
}

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const examTypeCode = await getCurrentExamType();
  const examDef = examTypeCode ? getExamTypeDefinition(examTypeCode) : null;

  const firstName = user.displayName.split(' ')[0];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-aubergine text-bone overflow-hidden border-b-[1.5px] border-aubergine">
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-terracotta/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-saffron/20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 py-10 sm:py-12">
          <p className="font-display italic text-saffron text-base mb-2">
            — Bonjour, {firstName}
          </p>
          <h1
            className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 60" }}
          >
            Vos <span className="display-italic text-terracotta">réglages</span>
          </h1>
          <p className="text-bone/75 text-[1.05rem] leading-relaxed mt-4 max-w-xl">
            Gérez votre compte, votre abonnement et vos préférences. Tout reste accessible quand vous en avez besoin.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {examDef ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-bone/10 backdrop-blur px-3 py-1.5 text-xs font-semibold border border-bone/20">
                <span aria-hidden>{examDef.emoji}</span>
                {examDef.shortLabel}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10 sm:py-12 space-y-10">
        {/* Compte */}
        <section>
          <header className="mb-5">
            <p className="eyebrow mb-2">— Compte</p>
            <h2
              className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-aubergine"
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              Vos <span className="display-italic text-terracotta">informations</span>
            </h2>
          </header>
          <div className="grid gap-3 sm:gap-4">
            <SettingsCard
              href="/app/profile"
              icon="👤"
              title="Mon profil"
              description="Nom d'affichage, langue de traduction, mot de passe."
            />
            <SettingsCard
              href="/app/settings/subscription"
              icon="⭐"
              title="Mon abonnement"
              description="Plan en cours, facturation, gérer ou résilier."
            />
            <SettingsCard
              href="/onboarding/exam-type"
              icon="🎯"
              title="Mon examen"
              description="Changer d'examen ciblé (CSP, carte de résident, nationalité)."
            />
          </div>
        </section>

        {/* Légal & support */}
        <section>
          <header className="mb-5">
            <p className="eyebrow mb-2">— Légal & support</p>
            <h2
              className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-aubergine"
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              <span className="display-italic text-terracotta">Confiance</span> et transparence
            </h2>
          </header>
          <div className="grid gap-3 sm:gap-4">
            <SettingsCard
              href="/privacy"
              icon="🔒"
              title="Confidentialité"
              description="Comment nous protégeons vos données et vos droits RGPD."
            />
            <SettingsCard
              href="/terms"
              icon="📜"
              title="Conditions d'utilisation"
              description="Les règles d'usage du service Civique."
            />
            <SettingsCard
              href="mailto:contact@integrafle.fr"
              icon="✉️"
              title="Contact"
              description="Une question, un retour ? On vous répond rapidement."
              external
            />
          </div>
        </section>
      </div>
    </div>
  );
}
