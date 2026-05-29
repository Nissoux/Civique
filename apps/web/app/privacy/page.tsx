import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '@/components/brand/Logo';
import { WelcomeStrip } from '@/components/brand/WelcomeStrip';

export const metadata: Metadata = {
  // Layout adds " · Civique" via title.template.
  title: 'Politique de confidentialité',
  description:
    'Comment Civique collecte, utilise et protège vos données personnelles. Vos droits RGPD, durées de conservation et engagements.',
  alternates: { canonical: '/privacy' },
};

const LAST_UPDATED = '10 mai 2026';

export default function PrivacyPage() {
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
            Politique de{' '}
            <span className="display-italic text-terracotta">confidentialité</span>
          </h1>
          <p className="text-ink-mute text-[1.05rem] leading-[1.65] max-w-[60ch]">
            Civique respecte votre vie privée. Cette page explique simplement
            quelles données nous collectons, pourquoi, et comment vous pouvez
            les contrôler.
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
                ['preambule', '1. Préambule'],
                ['donnees', '2. Données collectées'],
                ['finalites', '3. Finalités'],
                ['destinataires', '4. Destinataires'],
                ['conservation', '5. Durée de conservation'],
                ['droits', '6. Vos droits RGPD'],
                ['cookies', '7. Cookies'],
                ['securite', '8. Sécurité'],
                ['contact', '9. Contact'],
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

          <Section id="preambule" title="1. Préambule">
            <p>
              Civique est un service indépendant de préparation à l'examen
              civique français, édité par <strong>Civique</strong>, opérant en
              France. Nous accompagnons les candidat·e·s à la carte de séjour
              pluriannuelle, à la carte de résident et à la nationalité française.
            </p>
            <p>
              Nous ne sommes pas affilié·e·s à l'État français. Cette politique
              de confidentialité décrit la manière dont nous traitons vos
              données personnelles, conformément au Règlement Général sur la
              Protection des Données (RGPD) et à la loi française Informatique
              et Libertés.
            </p>
          </Section>

          <Section id="donnees" title="2. Données collectées">
            <p>
              Nous collectons uniquement les données strictement nécessaires au
              fonctionnement du service.
            </p>
            <h3>Données de compte</h3>
            <ul>
              <li>Adresse e-mail (pour identifiant et communications)</li>
              <li>Nom d'affichage (choisi par vous)</li>
              <li>
                Langue préférée pour les traductions des fiches et questions
              </li>
              <li>
                Mot de passe — stocké de manière chiffrée (jamais en clair)
              </li>
            </ul>
            <h3>Données d'usage</h3>
            <ul>
              <li>Examen ciblé (CSP, CR ou nationalité)</li>
              <li>Réponses aux questions, scores, niveau de maîtrise</li>
              <li>Progression par thème et par fiche</li>
              <li>Dates et durées de session</li>
            </ul>
            <h3>Données techniques</h3>
            <ul>
              <li>
                Cookies de session strictement nécessaires (authentification)
              </li>
              <li>
                Adresse IP et type de navigateur (logs serveur, à des fins de
                sécurité)
              </li>
            </ul>
          </Section>

          <Section id="finalites" title="3. Finalités du traitement">
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>
                <strong>Fournir le service</strong> — créer votre compte, vous
                authentifier, afficher les questions adaptées à votre examen.
              </li>
              <li>
                <strong>Mesurer votre progression</strong> — vous présenter des
                statistiques par thème et adapter les révisions à vos lacunes.
              </li>
              <li>
                <strong>Communiquer avec vous</strong> — uniquement pour des
                e-mails transactionnels (vérification d'adresse, réinitialisation
                de mot de passe, alertes de sécurité). Pas de communication
                marketing sans votre consentement explicite.
              </li>
              <li>
                <strong>Sécurité</strong> — détecter les abus et préserver
                l'intégrité du service.
              </li>
            </ul>
            <p>
              La base légale du traitement est <em>l'exécution du contrat</em>{' '}
              (les conditions d'utilisation que vous acceptez à l'inscription)
              et <em>l'intérêt légitime</em> pour la sécurité du service.
            </p>
          </Section>

          <Section id="destinataires" title="4. Destinataires des données">
            <p>
              Vos données ne sont jamais vendues, louées, ni cédées à des tiers
              à des fins commerciales. Elles sont accessibles à :
            </p>
            <ul>
              <li>
                <strong>L'équipe Civique</strong> — restreinte aux personnes
                ayant besoin d'y accéder pour faire fonctionner le service.
              </li>
              <li>
                <strong>Brevo</strong> (sib SAS, France) — sous-traitant pour
                l'envoi des e-mails transactionnels. Données transmises :
                adresse e-mail et nom d'affichage uniquement.
              </li>
              <li>
                <strong>Hetzner Online GmbH</strong> (Allemagne) — hébergeur de
                nos serveurs. Tous nos serveurs sont situés en Allemagne, dans
                l'Union européenne.
              </li>
            </ul>
            <p>
              Aucun transfert hors Union européenne n'est effectué pour vos
              données personnelles.
            </p>
          </Section>

          <Section id="conservation" title="5. Durée de conservation">
            <ul>
              <li>
                <strong>Données de compte</strong> — conservées tant que votre
                compte est actif. Si vous demandez la suppression, les données
                personnelles sont effacées sous 30 jours.
              </li>
              <li>
                <strong>Tokens d'authentification</strong> — 7 jours maximum.
              </li>
              <li>
                <strong>Logs serveur</strong> — 90 jours, à des fins de
                sécurité, puis purgés automatiquement.
              </li>
              <li>
                <strong>Données de progression</strong> — supprimées avec votre
                compte sur demande.
              </li>
            </ul>
          </Section>

          <Section id="droits" title="6. Vos droits RGPD">
            <p>
              Vous disposez à tout moment des droits suivants sur vos données
              personnelles :
            </p>
            <ul>
              <li>
                <strong>Droit d'accès</strong> — obtenir une copie des données
                que nous détenons à votre sujet.
              </li>
              <li>
                <strong>Droit de rectification</strong> — corriger toute
                information inexacte (modifiable directement depuis votre
                profil).
              </li>
              <li>
                <strong>Droit à l'effacement</strong> — demander la suppression
                de votre compte et de toutes les données associées.
              </li>
              <li>
                <strong>Droit à la portabilité</strong> — recevoir vos données
                dans un format lisible par machine (JSON).
              </li>
              <li>
                <strong>Droit d'opposition</strong> — vous opposer à un
                traitement spécifique.
              </li>
              <li>
                <strong>Droit à la limitation</strong> — restreindre certains
                traitements.
              </li>
            </ul>
            <p>
              Pour exercer ces droits, écrivez à{' '}
              <a href="mailto:privacy@integrafle.fr">privacy@integrafle.fr</a>.
              Nous répondons sous 30 jours maximum. Vous avez également le
              droit d'introduire une réclamation auprès de la CNIL{' '}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                (cnil.fr)
              </a>
              .
            </p>
          </Section>

          <Section id="cookies" title="7. Cookies">
            <p>
              Civique utilise uniquement des cookies <strong>essentiels</strong>{' '}
              au fonctionnement du service :
            </p>
            <ul>
              <li>
                Cookies de session (authentification) — durée 7 jours, supprimés
                à la déconnexion.
              </li>
              <li>
                Cookie de préférence d'examen — pour mémoriser le titre que
                vous préparez.
              </li>
            </ul>
            <p>
              <strong>
                Aucun cookie publicitaire, aucun pixel de tracking tiers, aucun
                outil d'analyse comportementale.
              </strong>{' '}
              Nous ne vous suivons pas sur le web.
            </p>
          </Section>

          <Section id="securite" title="8. Sécurité">
            <p>
              Nous mettons en œuvre les mesures techniques et organisationnelles
              suivantes pour protéger vos données :
            </p>
            <ul>
              <li>
                <strong>Chiffrement TLS</strong> sur toutes les communications
                avec nos serveurs.
              </li>
              <li>
                <strong>Mots de passe hashés</strong> avec bcrypt (algorithme
                à coût adaptatif). Nous ne pouvons pas lire votre mot de passe.
              </li>
              <li>
                <strong>Tokens JWT signés</strong> et de courte durée pour
                l'authentification.
              </li>
              <li>
                <strong>Hébergement sécurisé</strong> sur infrastructure
                Hetzner certifiée ISO 27001, en Allemagne.
              </li>
              <li>
                <strong>Sauvegardes chiffrées</strong> et accès restreint aux
                bases de données.
              </li>
            </ul>
          </Section>

          <Section id="contact" title="9. Contact">
            <p>
              Pour toute question relative à la protection de vos données ou
              pour exercer vos droits, contactez notre référent confidentialité :
            </p>
            <p>
              <a href="mailto:privacy@integrafle.fr">
                privacy@integrafle.fr
              </a>
            </p>
            <p>
              Pour toute autre question concernant le service :{' '}
              <a href="mailto:contact@integrafle.fr">contact@integrafle.fr</a>
            </p>
          </Section>

          <Section id="maj" title="10. Mise à jour de cette politique">
            <p>
              Cette politique peut être amenée à évoluer. Toute modification
              substantielle vous sera notifiée par e-mail au moins 30 jours
              avant son entrée en vigueur.
            </p>
            <p className="font-display italic text-ink-mute">
              Dernière mise à jour : {LAST_UPDATED}.
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
              <Link href="/terms" className="hover:text-saffron">
                Conditions d'utilisation
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
