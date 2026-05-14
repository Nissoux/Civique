import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

export const metadata = {
  title: 'Méthodologie — Civique',
  description:
    "Comment Civique prépare l'examen civique 2026 conformément à l'arrêté du 10 octobre 2025 : pool officiel du Ministère de l'Intérieur, distribution prescrite 11/6/11/8/4, mises en situation, et pédagogie sous-jacente.",
};

export default function MethodologiePage() {
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
        <p className="eyebrow mb-4">— Notre méthodologie</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] mb-6 font-medium tracking-tight">
          Comment Civique<br />
          <span className="display-italic text-terracotta">prépare</span> l'examen 2026.
        </h1>
        <p className="text-ink-mute text-[1.05rem] leading-[1.6] mb-12">
          Civique est aligné sur le cadre officiel défini par l'État français pour l'examen
          civique entrant en vigueur le 1<sup>er</sup> janvier 2026. Voici, sources à
          l'appui, comment notre contenu et notre simulation d'examen sont construits.
        </p>

        <Section number="1" title="Cadre légal applicable">
          <p>
            L'examen civique est exigé depuis le 1<sup>er</sup> janvier 2026 pour
            obtenir une carte de séjour pluriannuelle (CSP), une carte de résident
            (CR) ou la naturalisation française. Le cadre s'articule autour de :
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-6 text-ink leading-relaxed">
            <li>
              <strong>Loi n° 2024-42 du 26 janvier 2024</strong>{' '}
              « pour contrôler l'immigration, améliorer l'intégration » — qui institue
              l'examen civique obligatoire.
            </li>
            <li>
              <strong>
                <a
                  href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052381620"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-terracotta/40 hover:decoration-terracotta"
                >
                  Arrêté du 10 octobre 2025
                </a>
              </strong>
              {' '}(JORFTEXT000052381620) — programme, épreuves et modalités. C'est le
              texte que nous appliquons mot pour mot dans la composition de l'examen
              blanc.
            </li>
            <li>
              <strong>
                <a
                  href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000025241393"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-terracotta/40 hover:decoration-terracotta"
                >
                  Décret n° 2012-127 du 30 janvier 2012
                </a>
              </strong>
              {' '}— Charte des droits et devoirs du citoyen français, signée par tout
              candidat à la naturalisation.
            </li>
            <li>
              <strong>Circulaire dite « Retailleau » du 2 mai 2025</strong> — durcit
              l'instruction des demandes de naturalisation et porte le niveau de
              langue requis à <strong>B2</strong> oral et écrit (auparavant B1).
            </li>
          </ul>
        </Section>

        <Section number="2" title="Format de l'examen — strictement conforme">
          <p>L'examen prescrit par l'arrêté du 10 octobre 2025 est :</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
            <Card label="Durée" value="45 minutes" />
            <Card label="Questions" value="40 QCM" />
            <Card label="Choix par question" value="4 (une seule juste)" />
            <Card label="Seuil de réussite" value="32 / 40 (80 %)" />
            <Card label="Connaissances" value="28 questions" />
            <Card label="Mises en situation" value="12 questions" />
          </div>
          <p className="mt-6">
            Notre <strong>examen blanc</strong> reprend ces six paramètres à l'identique.
            Le timer démarre dès la première question, la grille de navigation des 40
            questions est disponible à tout moment, et le score final s'évalue contre
            le même seuil.
          </p>
        </Section>

        <Section number="3" title="Répartition par thème — prescrite par l'arrêté">
          <p>
            L'arrêté du 10 octobre 2025 fixe une répartition <em>précise</em> des 40
            questions parmi les cinq thèmes officiels. Civique applique cette
            répartition exacte :
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-aubergine/15">
            <table className="w-full text-sm">
              <thead className="bg-aubergine/5 text-left">
                <tr>
                  <th className="px-4 py-3 font-display font-medium text-aubergine">Thème</th>
                  <th className="px-3 py-3 font-display font-medium text-aubergine text-center">Connaissances</th>
                  <th className="px-3 py-3 font-display font-medium text-aubergine text-center">Mises en situation</th>
                  <th className="px-3 py-3 font-display font-medium text-aubergine text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aubergine/10">
                <tr><td className="px-4 py-3">1 · Principes et valeurs de la République</td><td className="px-3 py-3 text-center">5</td><td className="px-3 py-3 text-center">6</td><td className="px-3 py-3 text-center font-semibold">11</td></tr>
                <tr><td className="px-4 py-3">2 · Système institutionnel et politique</td><td className="px-3 py-3 text-center">6</td><td className="px-3 py-3 text-center">0</td><td className="px-3 py-3 text-center font-semibold">6</td></tr>
                <tr><td className="px-4 py-3">3 · Droits et devoirs</td><td className="px-3 py-3 text-center">5</td><td className="px-3 py-3 text-center">6</td><td className="px-3 py-3 text-center font-semibold">11</td></tr>
                <tr><td className="px-4 py-3">4 · Histoire, géographie et culture</td><td className="px-3 py-3 text-center">8</td><td className="px-3 py-3 text-center">0</td><td className="px-3 py-3 text-center font-semibold">8</td></tr>
                <tr><td className="px-4 py-3">5 · Vivre dans la société française</td><td className="px-3 py-3 text-center">4</td><td className="px-3 py-3 text-center">0</td><td className="px-3 py-3 text-center font-semibold">4</td></tr>
                <tr className="bg-aubergine/5 font-display"><td className="px-4 py-3">Total</td><td className="px-3 py-3 text-center font-semibold">28</td><td className="px-3 py-3 text-center font-semibold">12</td><td className="px-3 py-3 text-center font-semibold text-terracotta">40</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-mute font-display italic">
            — Les 12 mises en situation sont placées <strong>uniquement</strong> dans
            les thèmes 1 (Principes) et 3 (Droits et devoirs), conformément à
            l'arrêté.
          </p>
        </Section>

        <Section number="4" title="Pool de questions — adossé aux listes officielles">
          <p>
            Le Ministère de l'Intérieur publie une <strong>liste officielle des
            questions de connaissance</strong> pour chaque mention de l'examen
            (CSP, CR, naturalisation) sur{' '}
            <a
              href="https://formation-civique.interieur.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-terracotta/40 hover:decoration-terracotta"
            >
              formation-civique.interieur.gouv.fr
            </a>
            .
          </p>
          <p className="mt-3">
            Notre corpus de plus de <strong>600 questions</strong> est aligné
            ligne par ligne sur ces listes officielles. Chaque question taggée{' '}
            <code className="px-1.5 py-0.5 rounded bg-bone-deep text-aubergine text-[0.85em]">is_official</code>{' '}
            dans notre base est traçable à son entrée dans la liste publique du
            Ministère.
          </p>
          <p className="mt-3">
            Les <strong>mises en situation</strong> ne sont pas rendues publiques
            par le Ministère (volontairement, pour préserver la valeur du test).
            Nos 12 mises en situation par examen blanc sont rédigées par nos soins
            sur les sujets prescrits, en s'appuyant sur les retours d'expérience
            publiés sur les forums officiels et associatifs.
          </p>
        </Section>

        <Section number="5" title="Charte des droits et devoirs (naturalisation)">
          <p>
            La <strong>Charte des droits et devoirs du citoyen français</strong>{' '}
            (décret n° 2012-127) est lue et signée par tout candidat lors de la
            cérémonie d'accueil dans la citoyenneté française. Elle est aussi un
            référentiel implicite de l'entretien d'assimilation en préfecture.
          </p>
          <p className="mt-3">
            Civique l'intègre comme contenu d'apprentissage à part entière —
            principes, libertés fondamentales, droits civiques et sociaux, six
            devoirs constitutionnels (respect d'autrui, respect de la loi, vote,
            défense nationale, contribution fiscale, service à la justice).
          </p>
        </Section>

        <Section number="6" title="Pédagogie">
          <p>
            Civique combine trois mécaniques d'apprentissage éprouvées :
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-6 text-ink leading-relaxed">
            <li>
              <strong>Active Recall</strong> via les QCM — chaque question vous force
              à re-générer la réponse plutôt qu'à la reconnaître passivement.
            </li>
            <li>
              <strong>Répétition espacée</strong> sur les flashcards — vous revoyez les
              cartes que vous n'avez pas su selon des intervalles croissants.
            </li>
            <li>
              <strong>Conditions d'examen</strong> — l'examen blanc reproduit fidèlement
              la durée, la grille, le seuil et la composition officielle, pour que le
              jour J ne contienne aucune surprise de format.
            </li>
          </ul>
        </Section>

        <Section number="7" title="Multilingue assumé">
          <p>
            Civique présente le contenu en français (langue de l'examen) avec une
            traduction d'appui dans <strong>sept autres langues</strong> : arabe,
            persan, portugais, espagnol, hindi, anglais, turc. La traduction
            apparaît en italique sous chaque texte français pour soutenir la
            compréhension sans masquer la langue cible.
          </p>
          <p className="mt-3">
            <strong>L'examen blanc, lui, reste en français uniquement</strong> —
            c'est la condition de l'épreuve officielle.
          </p>
        </Section>

        <Section number="8" title="Ressources officielles">
          <ul className="mt-3 space-y-2 list-disc pl-6 text-ink leading-relaxed">
            <li>
              <a
                href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052381620"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-terracotta/40 hover:decoration-terracotta"
              >
                Arrêté du 10 octobre 2025
              </a>{' '}
              — programme et modalités de l'examen civique (Légifrance)
            </li>
            <li>
              <a
                href="https://formation-civique.interieur.gouv.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-terracotta/40 hover:decoration-terracotta"
              >
                Site officiel formation-civique.interieur.gouv.fr
              </a>{' '}
              — listes officielles des questions CSP / CR / NAT
            </li>
            <li>
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F39426"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-terracotta/40 hover:decoration-terracotta"
              >
                Service-public.fr — Naturalisation et examen civique
              </a>
            </li>
            <li>
              <a
                href="https://www.immigration.interieur.gouv.fr/Integration-et-Acces-a-la-nationalite/La-nationalite-francaise/Le-livret-du-citoyen"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-terracotta/40 hover:decoration-terracotta"
              >
                Livret du Citoyen (Ministère de l'Intérieur)
              </a>{' '}
              — référentiel officiel à étudier
            </li>
          </ul>
        </Section>

        <div className="mt-16 pt-10 border-t border-aubergine/15 text-sm text-ink-mute font-display italic leading-relaxed">
          <p>
            Cette page est mise à jour à chaque évolution du cadre légal de
            l'examen civique. Si vous identifiez une discordance entre notre
            simulation et le cadre officiel, écrivez-nous à{' '}
            <a
              href="mailto:support@integrafle.fr"
              className="text-terracotta hover:underline"
            >
              support@integrafle.fr
            </a>{' '}
            — nous corrigeons sous 48 h.
          </p>
        </div>
      </article>
    </main>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 first:mt-0">
      <header className="mb-4 flex items-baseline gap-3">
        <span className="font-display italic text-terracotta text-sm">— {number}</span>
        <h2
          className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
          style={{ fontVariationSettings: "'opsz' 60" }}
        >
          {title}
        </h2>
      </header>
      <div className="text-ink leading-[1.7] space-y-2">{children}</div>
    </section>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-bone border-[1.5px] border-aubergine/20 shadow-clay px-4 py-3">
      <p className="text-[0.7rem] font-display italic text-ink-mute uppercase tracking-wider mb-1">
        — {label}
      </p>
      <p className="font-display text-lg font-medium text-aubergine">{value}</p>
    </div>
  );
}
