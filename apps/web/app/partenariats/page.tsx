import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '@/components/brand/Logo';

export const metadata: Metadata = {
  title: 'Partenariats associations & collectivités — Civique',
  description:
    "Civique pour les associations d'aide aux migrants, centres sociaux, avocats en droit des étrangers et collectivités locales : codes promo en lot, formations équipes, contenus sur mesure.",
  alternates: { canonical: '/partenariats' },
};

/**
 * /partenariats — B2B / institutional landing page.
 *
 * Audience
 * --------
 * Three distinct buyer personas, each with different needs:
 *
 *   - Associations d'aide aux étrangers (Cimade, Secours Catholique,
 *     France Terre d'Asile, GISTI, Auberges et Foyers de jeunes
 *     travailleurs). They accompany dozens to thousands of candidates
 *     per year. Their need: ressources pédagogiques en plusieurs
 *     langues, peu coûteuses, qu'ils peuvent recommander ou offrir.
 *
 *   - Avocats en droit des étrangers. They want a référent fiable
 *     pour orienter leurs clients pendant le délai de procédure.
 *     Plus marketing pour eux que financier.
 *
 *   - Collectivités locales / centres sociaux / MJC / écoles FLE.
 *     They prêtent un parcours civique à leurs publics. Besoin :
 *     licences groupées, intégration possible dans leur portail.
 *
 * Why a dedicated page rather than email-only outreach
 * ----------------------------------------------------
 * 1. SEO — captures requêtes type "préparation examen civique
 *    association partenariat", "formation citoyen migrants outil".
 * 2. Credibility — la page transforme une démarche commerciale en
 *    discussion d'égal à égal entre partenaires.
 * 3. Self-serve filter — un partenaire qui lit la page et choisit
 *    de cliquer "contacter" est déjà qualifié.
 *
 * The page intentionally does NOT publish bulk price tiers. We want
 * the conversation, not a price race to the bottom. Pricing is
 * negotiated case-by-case based on volume and length of partnership.
 */
export default function PartenariatsPage() {
  return (
    <div className="min-h-screen bg-bone">
      <header className="border-b border-aubergine/15">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-sm font-medium text-aubergine hover:text-terracotta transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="max-w-[1340px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
        {/* Hero */}
        <section className="max-w-3xl">
          <p className="eyebrow mb-4">— Partenariats institutionnels</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.04] mb-6 font-medium tracking-tight">
            Accompagner ensemble<br />
            <span className="display-italic text-terracotta">celles et ceux</span> qui préparent leur examen.
          </h1>
          <p className="text-ink-mute text-[1.1rem] leading-[1.65] mb-4">
            Vous accompagnez des étrangers dans leurs démarches d'intégration —
            au sein d'une association, d'un cabinet d'avocats, d'une collectivité
            ou d'un centre social ? Civique peut s'intégrer à votre offre
            d'accompagnement pour faciliter la préparation à l'examen civique.
          </p>
          <p className="text-ink-mute text-[1.05rem] leading-[1.65]">
            Trois formules de partenariat, adaptées à votre échelle et à votre mission.
          </p>
        </section>

        {/* Three partnership formats */}
        <section className="mt-16 sm:mt-20 grid lg:grid-cols-3 gap-6">
          <FormatCard
            icon="🤝"
            kind="Association"
            title="Codes d'accès en lot"
            description="Vous offrez à vos bénéficiaires un accès Civique Plein pour la durée de leur préparation. Idéal pour associations d'aide aux migrants, foyers, missions locales."
            features={[
              'Codes générés par lot (10, 50, 100, 500…)',
              'Tarif dégressif selon volume',
              "Durée d'accès personnalisable (1, 3, 6 mois)",
              'Tableau de suivi d\'utilisation',
              'Support dédié, e-mail prioritaire',
            ]}
          />
          <FormatCard
            icon="⚖️"
            kind="Avocat / Conseil"
            title="Programme prescripteur"
            description="Vous orientez vos clients vers Civique pendant la procédure. Nous reversons une commission ou nous offrons des accès prépayés à vos clients."
            features={[
              "Lien d'affiliation traçable (UTM)",
              "Codes promo dédiés à votre cabinet",
              'Co-branding possible sur la fiche client',
              'Reporting mensuel des inscriptions',
              "Reversement ou échange d'accès",
            ]}
            highlight
          />
          <FormatCard
            icon="🏛️"
            kind="Collectivité / FLE"
            title="Intégration parcours"
            description="Vous proposez un parcours civique à vos publics dans le cadre d'un dispositif d'intégration ou d'une formation FLE. Civique s'intègre comme brique numérique."
            features={[
              'Licences groupées par classe ou cohorte',
              'Suivi pédagogique par formateur',
              "Compte formateur (vue d'ensemble apprenants)",
              "Possibilité d'intégration LMS (Moodle, etc.)",
              'Convention pluriannuelle envisageable',
            ]}
          />
        </section>

        {/* Why partner */}
        <section className="mt-20 sm:mt-24 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">— Pourquoi nous</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-medium tracking-tight mb-6">
              Une préparation<br />
              <span className="display-italic text-terracotta">à la hauteur</span> de votre mission.
            </h2>
            <p className="text-ink-mute text-[1.05rem] leading-[1.7]">
              Vos bénéficiaires méritent un outil sérieux, aligné sur le cadre
              légal officiel, accessible dans leur langue, et qui ne les laisse
              pas seuls face à un PDF. Civique est conçu exactement pour cela.
            </p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            <BenefitCard
              title="Conformité 2026"
              text="Aligné sur l'arrêté du 10 octobre 2025. Pool officiel du Ministère de l'Intérieur intégré."
            />
            <BenefitCard
              title="Multilingue"
              text="Fiches et explications dans 8 langues — un atout différenciant pour les publics non-francophones."
            />
            <BenefitCard
              title="Accessible"
              text="Mode audio (TTS) intégré, lecture haute-fidélité, design accessible WCAG AA."
            />
            <BenefitCard
              title="Indépendant"
              text="Pas d'éditeur, pas d'école, pas d'affiliation officielle — neutralité préservée."
            />
          </div>
        </section>

        {/* References / social proof */}
        <section className="mt-20 sm:mt-24 rounded-3xl bg-bone-deep border-[1.5px] border-aubergine/15 p-8 sm:p-12">
          <div className="max-w-3xl">
            <p className="font-display italic text-terracotta text-base mb-3">— Notre approche</p>
            <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight mb-5">
              Un partenariat construit autour de votre réalité.
            </h2>
            <p className="text-ink leading-relaxed text-[1.05rem] mb-4">
              Nous démarrons systématiquement par un échange d'une trentaine
              de minutes pour comprendre votre public, vos contraintes (calendrier,
              budget, ressources humaines), et le niveau d'accompagnement attendu.
            </p>
            <p className="text-ink leading-relaxed text-[1.05rem] mb-4">
              Pas de prix de catalogue affiché. Chaque partenariat fait l'objet
              d'une proposition adaptée — en règle générale, plus le volume est
              important et plus l'engagement est long, plus le tarif par
              utilisateur diminue.
            </p>
            <p className="text-ink leading-relaxed text-[1.05rem]">
              Une convention de partenariat (ou bon de commande) est signée
              avant la création des codes. Nous savons travailler avec les
              services achats et les marchés publics.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-20 sm:mt-24">
          <div className="rounded-3xl bg-aubergine text-bone p-10 sm:p-14 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-terracotta/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-saffron/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="eyebrow text-saffron mb-4">— Discutons-en</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] mb-5 font-medium tracking-tight">
                Une demi-heure<br />
                <span className="display-italic text-saffron">pour explorer</span> ensemble.
              </h2>
              <p className="text-bone/85 text-[1.05rem] leading-relaxed mb-7">
                Envoyez-nous un message décrivant votre structure et vos
                besoins. Nous revenons vers vous sous 48h ouvrées avec une
                proposition de rendez-vous.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:partenariats@integrafle.fr?subject=Demande%20de%20partenariat%20Civique&body=Bonjour%2C%0A%0AStructure%20%3A%20%0AVille%20%2F%20département%20%3A%20%0AVolume%20de%20bénéficiaires%20envisagés%20%3A%20%0AFormule%20envisagée%20(association%20%2F%20avocat%20%2F%20collectivité)%20%3A%20%0ACalendrier%20approximatif%20%3A%20%0A%0AVotre%20message%20%3A%20%0A%0A"
                  className="btn-primary text-base"
                >
                  Écrire à l'équipe partenariats
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="mailto:partenariats@integrafle.fr"
                  className="text-bone/80 hover:text-saffron transition-colors text-sm font-medium underline-wavy"
                >
                  partenariats@integrafle.fr
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Practical info */}
        <section className="mt-12 grid sm:grid-cols-3 gap-5 text-sm">
          <div>
            <p className="font-display italic text-terracotta text-xs mb-1">— Délai</p>
            <p className="text-ink leading-relaxed">
              Réponse sous 48h ouvrées, proposition formelle sous 7 jours après le rendez-vous.
            </p>
          </div>
          <div>
            <p className="font-display italic text-terracotta text-xs mb-1">— Modes de paiement</p>
            <p className="text-ink leading-relaxed">
              Virement (SEPA), facture professionnelle, bon de commande, mandat public.
            </p>
          </div>
          <div>
            <p className="font-display italic text-terracotta text-xs mb-1">— Documents</p>
            <p className="text-ink leading-relaxed">
              Convention type, plaquette PDF, RIB et KBIS communicables sur demande.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function FormatCard({
  icon,
  kind,
  title,
  description,
  features,
  highlight,
}: {
  icon: string;
  kind: string;
  title: string;
  description: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <article
      className={`card !rounded-3xl !p-7 sm:!p-8 flex flex-col gap-5 h-full ${
        highlight ? 'ring-2 ring-terracotta border-terracotta' : ''
      }`}
    >
      <header>
        <div className="text-3xl mb-3" aria-hidden>
          {icon}
        </div>
        <p className="font-display italic text-terracotta text-sm mb-1">— {kind}</p>
        <h3
          className="font-display text-xl sm:text-2xl font-medium tracking-tight"
          style={{ fontVariationSettings: "'opsz' 36" }}
        >
          {title}
        </h3>
      </header>
      <p className="text-ink-mute text-[0.95rem] leading-[1.6]">{description}</p>
      <ul className="flex flex-col gap-2 flex-1">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-ink"
          >
            <svg
              aria-hidden
              className="h-4 w-4 shrink-0 text-success mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.4}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function BenefitCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-5">
      <h3
        className="font-display text-lg font-medium mb-2"
        style={{ fontVariationSettings: "'opsz' 32" }}
      >
        {title}
      </h3>
      <p className="text-ink-mute text-[0.92rem] leading-[1.55]">{text}</p>
    </div>
  );
}
