import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ReadAloudButton } from '@/components/audio/ReadAloudButton';

export const metadata = {
  title: 'Charte des droits et devoirs du citoyen français — Civique',
  description:
    'Le texte intégral de la Charte des droits et devoirs du citoyen français (décret n° 2012-127 du 30 janvier 2012) — document signé par tout candidat à la naturalisation française.',
};

/**
 * Public page reproducing the full text of the Charte des droits et devoirs
 * du citoyen français (decree 2012-127, January 30, 2012).
 *
 * Why have this page
 * ------------------
 * The Charte is signed by every newly-naturalised French citizen at the
 * naturalisation ceremony. It is also implicitly the reference for the
 * naturalisation assimilation interview at the préfecture. None of our
 * competitors surface it as a structured, readable document — they
 * either reproduce a PDF or omit it entirely. Hosting it here serves
 * three goals:
 *   - SEO capture on "charte droits devoirs citoyen français"
 *   - Genuine pedagogical value for NAT candidates
 *   - Compliance signal for our own credibility
 *
 * Structure follows the decree's annex exactly:
 *   I.   Principes, valeurs et symboles
 *   II.  Droits
 *   III. Devoirs
 *
 * Text is paraphrased from the official annex (the decree itself is
 * public domain) and chunked into a navigable outline.
 */
export default function ChartePage() {
  return (
    <main className="min-h-screen bg-bone">
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

      <article className="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <p className="eyebrow mb-4">— Document officiel</p>
        <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] mb-6 font-medium tracking-tight">
          Charte des droits et devoirs<br />
          <span className="display-italic text-terracotta">du citoyen</span> français.
        </h1>
        <p className="text-ink-mute text-[1.05rem] leading-[1.6] mb-3">
          Annexée au décret n° 2012-127 du 30 janvier 2012, cette Charte est{' '}
          <strong>signée par toute personne devenant française</strong> par
          naturalisation, lors de la cérémonie d'accueil dans la citoyenneté
          française. Elle rappelle les principes essentiels de la République et
          décline les droits et devoirs de chaque citoyen.
        </p>
        <p className="text-ink-mute text-[1.05rem] leading-[1.6] mb-6">
          Elle est aussi l'un des supports implicites de l'entretien
          d'assimilation à la préfecture. Lisez-la attentivement — chaque
          ligne peut être interrogée.
        </p>

        {/* Audio fallback for accessibility + candidates who study while
            commuting or doing chores. Web Speech API — zero cost, zero
            latency, text never leaves the device. See ReadAloudButton.tsx. */}
        <div className="mb-12">
          <ReadAloudButton target="article" label="Écouter la Charte" />
        </div>

        <Section roman="I" title="Principes, valeurs et symboles de la République">
          <p>
            La République française est <strong>indivisible, laïque, démocratique
            et sociale</strong> (article 1<sup>er</sup> de la Constitution). Elle
            assure l'égalité devant la loi de toutes les personnes, sans distinction
            d'origine, de race ou de religion. Elle respecte toutes les croyances.
          </p>

          <h3 className="font-display text-xl font-medium mt-6 mb-2">
            Fondements
          </h3>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Déclaration des droits de l'homme et du citoyen</strong> du 26 août 1789</li>
            <li><strong>Constitution</strong> du 4 octobre 1958</li>
          </ul>

          <h3 className="font-display text-xl font-medium mt-6 mb-2">
            Symboles
          </h3>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Drapeau tricolore</strong> bleu, blanc, rouge</li>
            <li><strong>Hymne</strong> : La Marseillaise</li>
            <li><strong>Devise</strong> : « Liberté, Égalité, Fraternité »</li>
            <li><strong>Fête nationale</strong> : le 14 juillet</li>
            <li><strong>Marianne</strong> : représentation symbolique de la République</li>
            <li><strong>Langue</strong> : le français</li>
          </ul>

          <h3 className="font-display text-xl font-medium mt-6 mb-2">
            Les quatre caractères de la République
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Indivisible</strong> — la souveraineté nationale appartient
              au peuple qui l'exerce par ses représentants élus.
            </li>
            <li>
              <strong>Laïque</strong> — la liberté de conscience est garantie ; la
              République respecte toutes les croyances mais n'en reconnaît aucune.
              Les Églises sont séparées de l'État (loi du 9 décembre 1905).
            </li>
            <li>
              <strong>Démocratique</strong> — « gouvernement du peuple, par le
              peuple et pour le peuple ». Le suffrage est universel, égal et secret.
              La justice est indépendante.
            </li>
            <li>
              <strong>Sociale</strong> — la Nation assure à l'individu et à la
              famille les conditions nécessaires à leur développement.
            </li>
          </ul>
        </Section>

        <Section roman="II" title="Les droits du citoyen français">
          <h3 className="font-display text-xl font-medium mt-2 mb-2">
            Libertés fondamentales
          </h3>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Liberté d'opinion, de pensée, de conscience et de religion</li>
            <li>Liberté d'expression, par la parole, l'écrit, l'image</li>
            <li>Liberté de circulation, de réunion, de manifestation</li>
            <li>Respect de la vie privée et de la dignité humaine</li>
            <li>Inviolabilité du corps humain</li>
            <li>Droit de créer et d'adhérer à une association ou à un parti politique</li>
            <li>Droit à l'action syndicale et droit de grève</li>
          </ul>

          <h3 className="font-display text-xl font-medium mt-6 mb-2">
            Droits civiques
          </h3>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Droit de vote</strong> — à partir de 18 ans, pour tout
              citoyen jouissant de ses droits civils et politiques
            </li>
            <li><strong>Éligibilité</strong> aux mandats électoraux dans les conditions prévues par la loi</li>
            <li>Accès aux emplois publics, selon les capacités, sans autre distinction que celle des vertus et des talents</li>
          </ul>

          <h3 className="font-display text-xl font-medium mt-6 mb-2">
            Droits sociaux
          </h3>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Égalité devant la loi, sans distinction de sexe, d'origine, de race ou de religion</li>
            <li>Égal accès aux mandats, fonctions et responsabilités</li>
            <li>Protection de la santé</li>
            <li>Sécurité matérielle et droit au repos et aux loisirs</li>
            <li>Moyens convenables d'existence pour quiconque, en raison de son âge, de son état physique ou mental, de la situation économique, se trouve dans l'incapacité de travailler</li>
          </ul>

          <h3 className="font-display text-xl font-medium mt-6 mb-2">
            Droits familiaux
          </h3>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Liberté du choix de l'activité professionnelle pour chacun des conjoints</li>
            <li>Exercice conjoint de l'autorité parentale</li>
            <li>Obligation, pour les parents, d'assurer l'instruction de leurs enfants jusqu'à l'âge de 16 ans</li>
          </ul>
        </Section>

        <Section roman="III" title="Les devoirs du citoyen français">
          <p>
            En contrepartie de ces droits, six devoirs s'imposent à chaque
            citoyen :
          </p>

          <ol className="mt-4 space-y-4">
            <Duty number="1" title="Respect d'autrui">
              La liberté de chacun s'arrête là où commence celle d'autrui. Nul ne
              peut nuire à autrui ou attenter à la dignité humaine. Toute
              discrimination est interdite et punie par la loi.
            </Duty>
            <Duty number="2" title="Respect de la loi">
              Tous les citoyens sont égaux devant la loi. Nul n'est censé ignorer
              la loi. Le respect de la loi est un devoir civique fondamental.
            </Duty>
            <Duty number="3" title="Participation à la vie démocratique : le vote">
              Le vote est un droit, c'est aussi un devoir civique. Chaque citoyen
              français doit participer aux scrutins (présidentielles, législatives,
              européennes, municipales, régionales, départementales, référendaires).
            </Duty>
            <Duty number="4" title="Défense nationale et cohésion de la Nation">
              Tout Français concourt à la défense et à la cohésion de la Nation.
              Cette obligation peut prendre des formes diverses (service civique,
              engagement dans la réserve, défense civile, etc.). La participation à
              la <strong>Journée Défense et Citoyenneté</strong> est obligatoire pour les
              jeunes de 16 à 25 ans.
            </Duty>
            <Duty number="5" title="Contribution fiscale et solidarité">
              Le paiement des impôts et des cotisations sociales finance les
              services publics et la solidarité nationale. Y contribuer est un
              devoir, à hauteur de ses facultés contributives.
            </Duty>
            <Duty number="6" title="Service à la justice : les jurys d'assises">
              Tout citoyen inscrit sur les listes électorales, âgé d'au moins 23
              ans et sachant lire et écrire en français, peut être appelé à siéger
              en tant que <strong>juré d'assises</strong>. C'est un devoir civique : refuser sans
              motif légitime expose à une amende.
            </Duty>
          </ol>

          <div className="mt-8 rounded-2xl border-[1.5px] border-fr-red/30 bg-error-bg p-5">
            <p className="font-display italic text-sm text-fr-red mb-2">
              — En cas de manquement
            </p>
            <p className="text-sm text-ink leading-relaxed">
              Tout Français peut être <strong>déchu de sa nationalité française</strong>{' '}
              s'il manque gravement aux obligations qu'elle implique (article
              25 du Code civil) — actes de terrorisme, atteinte aux intérêts
              fondamentaux de la Nation, condamnation pour crime grave dans
              les 10 ans suivant l'acquisition.
            </p>
          </div>
        </Section>

        <div className="mt-16 pt-10 border-t border-aubergine/15">
          <p className="font-display italic text-sm text-ink-mute mb-3">
            — Source officielle
          </p>
          <ul className="space-y-2 text-sm text-ink-mute leading-relaxed">
            <li>
              <a
                href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000025241393"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-terracotta/40 hover:decoration-terracotta"
              >
                Décret n° 2012-127 du 30 janvier 2012 (Légifrance)
              </a>
            </li>
            <li>
              <a
                href="https://www.nord.gouv.fr/contenu/telechargement/33124/236132/file/Charte%20des%20droits%20et%20devoirs.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-terracotta/40 hover:decoration-terracotta"
              >
                PDF officiel (préfecture du Nord)
              </a>
            </li>
            <li>
              <Link
                href="/methodologie"
                className="underline decoration-terracotta/40 hover:decoration-terracotta"
              >
                Notre méthodologie complète →
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}

function Section({
  roman,
  title,
  children,
}: {
  roman: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 first:mt-0 scroll-mt-8" id={`section-${roman.toLowerCase()}`}>
      <header className="mb-5 flex items-baseline gap-3">
        <span className="font-display italic text-terracotta text-base">— {roman}</span>
        <h2
          className="font-display text-2xl sm:text-[1.75rem] font-medium tracking-tight"
          style={{ fontVariationSettings: "'opsz' 48" }}
        >
          {title}
        </h2>
      </header>
      <div className="text-ink leading-[1.7] space-y-2">{children}</div>
    </section>
  );
}

function Duty({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-2xl bg-bone border-[1.5px] border-aubergine/15 shadow-clay p-5">
      <header className="flex items-baseline gap-3 mb-1.5">
        <span
          className="
            inline-flex items-center justify-center h-8 w-8 rounded-full
            bg-terracotta text-bone font-display font-medium text-sm
            shadow-[0_2px_0_rgb(45_27_46)]
          "
          aria-hidden
        >
          {number}
        </span>
        <h3 className="font-display text-lg font-medium" style={{ fontVariationSettings: "'opsz' 32" }}>
          {title}
        </h3>
      </header>
      <p className="text-sm text-ink leading-relaxed">{children}</p>
    </li>
  );
}
