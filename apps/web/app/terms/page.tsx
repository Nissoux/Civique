import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '@/components/brand/Logo';
import { WelcomeStrip } from '@/components/brand/WelcomeStrip';

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Civique",
  description:
    "Les conditions d'utilisation du service Civique : création de compte, abonnement, résiliation, propriété intellectuelle et loi applicable.",
  alternates: { canonical: '/terms' },
};

const LAST_UPDATED = '10 mai 2026';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bone">
      <WelcomeStrip />

      {/* Header */}
      <header className="border-b border-aubergine/15">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Logo />
          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-9 text-[0.95rem] font-medium">
            <Link href="/" className="hover:text-terracotta transition-colors">
              Accueil
            </Link>
            <Link
              href="/login"
              className="hover:text-terracotta transition-colors"
            >
              Se connecter
            </Link>
          </nav>
          <Link
            href="/"
            className="md:hidden text-sm font-medium hover:text-terracotta transition-colors"
          >
            ← Accueil
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <section className="border-b border-aubergine/15 bg-bone-deep">
        <div className="max-w-[70ch] mx-auto px-6 sm:px-10 py-14 sm:py-20">
          <p className="eyebrow mb-4">— Document légal</p>
          <h1
            className="font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] font-medium tracking-tight mb-5"
            style={{ fontVariationSettings: "'opsz' 72" }}
          >
            Conditions d'
            <span className="display-italic text-terracotta">utilisation</span>
          </h1>
          <p className="text-ink-mute text-[1.05rem] leading-[1.65] max-w-[60ch]">
            Les règles qui encadrent l'utilisation de Civique. En créant un
            compte, vous acceptez ces conditions. Lisez-les attentivement.
          </p>
          <p className="text-sm text-ink-mute mt-6 font-display italic">
            — Dernière mise à jour : {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 sm:px-10 py-14 sm:py-20">
        <article className="max-w-[70ch] mx-auto">
          {/* Table of contents */}
          <nav
            aria-label="Sommaire"
            className="mb-12 rounded-2xl border-[1.5px] border-aubergine/15 bg-bone-deep/50 p-5 sm:p-6"
          >
            <p className="eyebrow mb-3">— Sommaire</p>
            <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                ['acceptation', '1. Acceptation'],
                ['service', '2. Description du service'],
                ['compte', '3. Compte utilisateur'],
                ['contenu', '4. Contenu pédagogique'],
                ['abonnement', '5. Abonnement'],
                ['resiliation', '6. Résiliation'],
                ['responsabilite', '7. Limitation de responsabilité'],
                ['propriete', '8. Propriété intellectuelle'],
                ['loi', '9. Loi applicable'],
                ['maj', '10. Mise à jour'],
              ].map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-aubergine hover:text-terracotta transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <Section id="acceptation" title="1. Acceptation des conditions">
            <p>
              En créant un compte sur Civique ou en utilisant le service, vous
              acceptez sans réserve les présentes conditions d'utilisation.
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser
              le service.
            </p>
            <p>
              Civique se réserve le droit de modifier ces conditions à tout
              moment. Toute modification substantielle vous sera notifiée par
              e-mail au moins 30 jours avant son entrée en vigueur. Votre
              utilisation continue du service après cette période vaut
              acceptation des nouvelles conditions.
            </p>
          </Section>

          <Section id="service" title="2. Description du service">
            <p>
              Civique est un service en ligne de préparation à l'examen civique
              français. Il comprend des questions, des fiches pédagogiques, des
              statistiques de progression et des outils d'entraînement adaptés
              à trois examens :
            </p>
            <ul>
              <li>la carte de séjour pluriannuelle (CSP) ;</li>
              <li>la carte de résident (CR) ;</li>
              <li>l'acquisition de la nationalité française.</li>
            </ul>
            <p>
              <strong>
                Civique est un service indépendant. Il n'est pas un substitut
                à la formation civique officielle dispensée par l'État français
                (OFII, préfectures), et n'est en aucun cas affilié à une
                administration publique.
              </strong>
            </p>
          </Section>

          <Section id="compte" title="3. Compte utilisateur">
            <p>
              Pour utiliser Civique, vous devez créer un compte avec une
              adresse e-mail valide. Vous êtes responsable :
            </p>
            <ul>
              <li>de l'exactitude des informations fournies ;</li>
              <li>
                de la confidentialité de votre mot de passe et de toutes les
                activités effectuées depuis votre compte ;
              </li>
              <li>
                de notifier Civique sans délai en cas d'utilisation non
                autorisée de votre compte.
              </li>
            </ul>
            <p>
              Vous vous engagez à ne pas partager votre compte ni à créer
              plusieurs comptes pour contourner les limitations du service.
              Civique se réserve le droit de suspendre tout compte utilisé
              de manière abusive ou frauduleuse.
            </p>
            <p>
              Vous devez avoir au moins 18 ans, ou disposer de l'autorisation
              de votre représentant légal, pour créer un compte.
            </p>
          </Section>

          <Section id="contenu" title="4. Contenu pédagogique">
            <p>
              Civique fournit des questions et des fiches pédagogiques
              élaborées à partir du livret du citoyen officiel et de sources
              publiques de référence. Nous mettons un soin particulier à la
              qualité du contenu, mais :
            </p>
            <ul>
              <li>
                <strong>
                  Civique ne garantit pas l'exactitude absolue ni l'exhaustivité
                  du contenu.
                </strong>{' '}
                Le programme officiel peut évoluer indépendamment du service.
              </li>
              <li>
                Le contenu est destiné à la préparation et à la révision. Il ne
                remplace pas les ressources officielles ni les formations
                dispensées par l'État.
              </li>
              <li>
                En cas d'erreur identifiée, vous pouvez nous la signaler à{' '}
                <a href="mailto:contact@integrafle.fr">contact@integrafle.fr</a>
                . Nous nous engageons à corriger rapidement.
              </li>
            </ul>
          </Section>

          <Section id="abonnement" title="5. Abonnement">
            <p>
              Civique est proposé selon deux modèles :
            </p>
            <ul>
              <li>
                <strong>Accès gratuit</strong> — un échantillon limité du
                contenu est disponible sans abonnement, pour vous permettre
                de découvrir le service.
              </li>
              <li>
                <strong>Abonnement payant</strong> — l'accès complet (toutes
                les questions, toutes les fiches, suivi détaillé de progression)
                est disponible via un abonnement mensuel ou semestriel.
              </li>
            </ul>
            <h3>Renouvellement</h3>
            <p>
              Sauf résiliation de votre part, votre abonnement se renouvelle
              automatiquement à chaque échéance, au tarif en vigueur.
              Vous êtes informé·e par e-mail avant chaque renouvellement.
            </p>
            <h3>Paiement</h3>
            <p>
              Le paiement est traité par notre prestataire de paiement
              sécurisé. Civique ne stocke aucune donnée bancaire.
            </p>
            <h3>Modification des tarifs</h3>
            <p>
              Tout changement de tarif vous sera notifié au moins 30 jours
              avant l'application. Vous pourrez résilier sans frais avant
              l'application du nouveau tarif.
            </p>
          </Section>

          <Section id="resiliation" title="6. Résiliation">
            <h3>Résiliation par l'utilisateur</h3>
            <p>
              Vous pouvez résilier votre abonnement{' '}
              <strong>à tout moment</strong>, sans frais ni justification, depuis
              la page{' '}
              <Link
                href="/app/settings/subscription"
                className="text-terracotta underline underline-offset-2 hover:text-aubergine"
              >
                Mon abonnement
              </Link>
              . La résiliation prend effet à la fin de la période en cours :
              vous conservez l'accès jusqu'à cette date.
            </p>
            <p>
              Vous pouvez également supprimer entièrement votre compte depuis
              votre profil. La suppression est définitive : toutes vos données
              de progression sont effacées.
            </p>
            <h3>Résiliation par Civique</h3>
            <p>
              Civique peut suspendre ou résilier votre compte sans préavis en
              cas de violation grave des présentes conditions, notamment :
              tentative de fraude, partage de compte, contournement des
              mesures techniques, ou comportement abusif.
            </p>
          </Section>

          <Section id="responsabilite" title="7. Limitation de responsabilité">
            <p>
              Civique met tout en œuvre pour assurer un service de qualité,
              mais :
            </p>
            <ul>
              <li>
                <strong>
                  Civique ne garantit pas la réussite à l'examen civique.
                </strong>{' '}
                La réussite dépend de nombreux facteurs propres à chaque
                candidat·e, et l'examen est conduit par les autorités
                officielles selon leurs propres critères.
              </li>
              <li>
                Civique ne peut être tenu responsable d'une décision défavorable
                rendue par l'administration française.
              </li>
              <li>
                Civique met en œuvre les moyens raisonnables pour assurer la
                disponibilité du service, sans garantie d'absence d'interruption
                (maintenance, incident technique, force majeure).
              </li>
              <li>
                La responsabilité de Civique, en cas de manquement avéré,
                est limitée au montant des sommes versées par l'utilisateur
                au cours des 12 derniers mois.
              </li>
            </ul>
          </Section>

          <Section id="propriete" title="8. Propriété intellectuelle">
            <p>
              Tous les éléments du service (textes, fiches, questions,
              traductions, design, code, marque <em>Civique</em>) sont la
              propriété exclusive de Civique ou de ses ayants droit, et sont
              protégés par les lois relatives à la propriété intellectuelle.
            </p>
            <p>
              L'abonnement vous donne un droit personnel, non exclusif et non
              transférable d'utiliser le service à des fins de préparation
              individuelle.
            </p>
            <p>
              Toute reproduction, copie, diffusion, revente, ou exploitation
              commerciale du contenu est strictement interdite sans autorisation
              écrite préalable de Civique.
            </p>
          </Section>

          <Section id="loi" title="9. Loi applicable et juridiction">
            <p>
              Les présentes conditions sont régies par le{' '}
              <strong>droit français</strong>.
            </p>
            <p>
              En cas de litige, les parties s'efforceront de trouver une
              solution amiable. À défaut, et conformément aux dispositions du
              Code de la consommation, le consommateur peut recourir
              gratuitement à un médiateur de la consommation. Si aucune
              solution amiable n'est trouvée, le litige sera porté devant les
              tribunaux français compétents.
            </p>
          </Section>

          <Section id="maj" title="10. Mise à jour des conditions">
            <p>
              Civique peut mettre à jour ces conditions pour refléter des
              évolutions légales, techniques ou commerciales. La date de
              dernière mise à jour est indiquée en haut de cette page.
            </p>
            <p className="font-display italic text-ink-mute">
              Dernière mise à jour : {LAST_UPDATED}.
            </p>
            <p>
              Pour toute question :{' '}
              <a
                href="mailto:contact@integrafle.fr"
                className="text-terracotta underline underline-offset-2 hover:text-aubergine"
              >
                contact@integrafle.fr
              </a>
              .
            </p>
          </Section>
        </article>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-aubergine text-bone border-t border-aubergine">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Logo size="sm" href="/" className="[&_span:last-child]:!text-bone" />
          <Link
            href="/"
            className="text-saffron font-display italic text-base hover:underline"
          >
            ← Retour à l'accueil
          </Link>
        </div>
        <div className="border-t border-bone/10">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-bone/50">
            <span>
              © {new Date().getFullYear()} Civique · Tous droits réservés
            </span>
            <span className="display-italic flex gap-4">
              <Link href="/privacy" className="hover:text-saffron">
                Politique de confidentialité
              </Link>
              <Link href="/mentions-legales" className="hover:text-saffron">
                Mentions légales
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2
        className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-aubergine mb-5"
        style={{ fontVariationSettings: "'opsz' 48" }}
      >
        {title}
      </h2>
      <div className="space-y-4 text-[1.025rem] leading-[1.7] text-aubergine/90 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-aubergine [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_a]:text-terracotta [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-aubergine [&_strong]:font-semibold [&_strong]:text-aubergine">
        {children}
      </div>
    </section>
  );
}
