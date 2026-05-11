import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '@/components/brand/Logo';
import { WelcomeStrip } from '@/components/brand/WelcomeStrip';

export const metadata: Metadata = {
  title: 'Mentions légales — Civique',
  description:
    "Informations légales relatives à Civique : éditeur, hébergeur, contact, propriété intellectuelle et loi applicable.",
};

const LAST_UPDATED = '11 mai 2026';

export default function MentionsLegalesPage() {
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
            Mentions{' '}
            <span className="display-italic text-terracotta">légales</span>
          </h1>
          <p className="text-ink-mute text-[1.05rem] leading-[1.65] max-w-[60ch]">
            Informations légales obligatoires conformément à la loi française
            n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie
            numérique.
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
                ['editeur', '1. Éditeur'],
                ['hebergeur', '2. Hébergeur'],
                ['contact', '3. Contact'],
                ['propriete', '4. Propriété intellectuelle'],
                ['donnees', '5. Données personnelles'],
                ['cookies', '6. Cookies'],
                ['liens', '7. Liens externes'],
                ['loi', '8. Loi applicable'],
                ['maj', '9. Mise à jour'],
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

          <Section id="editeur" title="1. Éditeur du site">
            <p>
              Le site Civique est édité par :
            </p>
            <ul>
              <li>
                <strong>Anis DAHMANI</strong> — Entrepreneur individuel
                exerçant sous le nom commercial <em>IntégraFLE</em>
              </li>
              <li>
                <strong>Forme juridique</strong> : Entreprise individuelle
                (régime de la micro-entreprise)
              </li>
              <li>
                <strong>Siège social</strong> : 7 Rue Marie Sophie de la Briffe,
                91610 Ballancourt-sur-Essonne, France
              </li>
              <li>
                <strong>SIREN</strong> : 102 739 455
              </li>
              <li>
                <strong>SIRET</strong> : 102 739 455 00016
              </li>
              <li>
                <strong>Code APE</strong> : 8559B — Autres enseignements
              </li>
              <li>
                <strong>Nature de l'activité</strong> : Libérale non
                réglementée (création et animation de cours en ligne,
                accompagnement à l'apprentissage du français, préparation
                aux certifications DELF et DALF)
              </li>
              <li>
                <strong>TVA intracommunautaire</strong> : Non applicable —
                TVA non applicable, article 293 B du Code général des impôts
                (franchise en base de TVA, régime micro-entreprise)
              </li>
              <li>
                <strong>Directeur de la publication</strong> : Anis DAHMANI
              </li>
              <li>
                <strong>Contact éditorial</strong> :{' '}
                <a href="mailto:support@integrafle.fr">support@integrafle.fr</a>
                {' · '}
                <a href="tel:+33668843116">+33 6 68 84 31 16</a>
              </li>
            </ul>
          </Section>

          <Section id="hebergeur" title="2. Hébergeur">
            <p>
              Le site Civique est hébergé par :
            </p>
            <ul>
              <li>
                <strong>Hetzner Online GmbH</strong>
              </li>
              <li>Industriestr. 25</li>
              <li>91710 Gunzenhausen, Allemagne</li>
              <li>
                Site web :{' '}
                <a
                  href="https://www.hetzner.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hetzner.com
                </a>
              </li>
            </ul>
            <p>
              L'ensemble des données est hébergé sur des serveurs situés en
              Allemagne, au sein de l'Union européenne.
            </p>
          </Section>

          <Section id="contact" title="3. Contact">
            <p>
              Pour toute question relative au site ou au service Civique, vous
              pouvez nous joindre par :
            </p>
            <ul>
              <li>
                <strong>Email</strong> :{' '}
                <a href="mailto:support@integrafle.fr">support@integrafle.fr</a>
              </li>
              <li>
                <strong>Téléphone</strong> :{' '}
                <a href="tel:+33668843116">+33 6 68 84 31 16</a>
              </li>
              <li>
                <strong>Courrier</strong> : 7 Rue Marie Sophie de la Briffe,
                91610 Ballancourt-sur-Essonne, France
              </li>
            </ul>
            <p>
              Pour les questions relatives à la protection des données
              personnelles, contactez{' '}
              <a href="mailto:privacy@integrafle.fr">privacy@integrafle.fr</a>.
            </p>
          </Section>

          <Section id="propriete" title="4. Propriété intellectuelle">
            <p>
              Civique et l'ensemble du contenu présent sur le site (textes,
              fiches pédagogiques, questions, traductions, illustrations,
              identité visuelle, marque <em>Civique</em>, code source) sont
              protégés par le droit d'auteur et par les lois relatives à la
              propriété intellectuelle.
            </p>
            <p>
              <strong>
                Toute reproduction, représentation, modification, publication,
                adaptation ou exploitation de tout ou partie des éléments du
                site, par quelque procédé et sur quelque support que ce soit,
                est strictement interdite sans autorisation écrite préalable
                de Civique.
              </strong>
            </p>
            <p>
              Toute exploitation non autorisée du site ou de ses contenus
              constitue une contrefaçon, sanctionnée par les articles L.335-2
              et suivants du Code de la propriété intellectuelle.
            </p>
          </Section>

          <Section id="donnees" title="5. Données personnelles">
            <p>
              Civique collecte et traite des données personnelles dans le
              strict respect du Règlement Général sur la Protection des
              Données (RGPD) et de la loi française Informatique et Libertés.
            </p>
            <p>
              Pour connaître en détail les données collectées, leurs finalités,
              les destinataires, les durées de conservation et vos droits
              (accès, rectification, effacement, opposition, portabilité),
              consultez notre{' '}
              <Link href="/privacy">Politique de confidentialité</Link>.
            </p>
          </Section>

          <Section id="cookies" title="6. Cookies">
            <p>
              Civique utilise uniquement des cookies strictement nécessaires
              au fonctionnement du service (authentification, mémorisation de
              la préférence d'examen). Aucun cookie publicitaire ou de
              traçage tiers n'est utilisé.
            </p>
            <p>
              Pour plus de détails, consultez la section dédiée de notre{' '}
              <Link href="/privacy">Politique de confidentialité</Link>.
            </p>
          </Section>

          <Section id="liens" title="7. Liens externes">
            <p>
              Le site Civique peut contenir des liens hypertextes vers des
              sites tiers (par exemple : sites institutionnels, partenaires,
              références documentaires). Civique n'exerce aucun contrôle sur
              ces sites externes et décline toute responsabilité quant à leur
              contenu, leur politique de confidentialité ou leurs pratiques.
            </p>
            <p>
              L'inclusion de tels liens ne constitue pas une approbation des
              opinions ou contenus présents sur ces sites.
            </p>
          </Section>

          <Section id="loi" title="8. Loi applicable et juridiction">
            <p>
              Les présentes mentions légales sont régies par le{' '}
              <strong>droit français</strong>. En cas de litige relatif à
              l'utilisation du site, et à défaut de résolution amiable, la
              compétence est attribuée aux <strong>tribunaux de Paris</strong>,
              sous réserve des dispositions impératives applicables.
            </p>
          </Section>

          <Section id="maj" title="9. Mise à jour">
            <p>
              Civique se réserve le droit de modifier les présentes mentions
              légales à tout moment, notamment pour refléter des évolutions
              légales ou structurelles. La date de dernière mise à jour est
              indiquée en haut de cette page.
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
              <Link href="/privacy" className="hover:text-saffron">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-saffron">
                Conditions
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

/**
 * Visible placeholder block — yellow callout that says "must be filled in
 * before going live". Designed to be impossible to miss in a code review or
 * a quick scroll-through of the page.
 */
function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="note"
      aria-label="Section à compléter avant publication"
      className="my-4 rounded-xl border-[1.5px] border-saffron bg-saffron/30 px-4 py-3 text-[0.95rem] leading-[1.55] text-aubergine"
    >
      <p className="font-semibold mb-1 not-italic">
        ⚠️ À compléter par Anis
      </p>
      <p className="font-display italic text-aubergine/90">{children}</p>
    </div>
  );
}

/**
 * Inline placeholder — italic terracotta text used inside a list item to
 * flag a missing value that needs to be filled in.
 */
function PlaceholderText({ children }: { children: React.ReactNode }) {
  return (
    <em className="display-italic text-terracotta font-medium">
      {children}
    </em>
  );
}
