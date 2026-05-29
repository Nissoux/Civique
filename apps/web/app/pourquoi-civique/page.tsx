import Link from 'next/link';
import type { Metadata } from 'next';
import { env } from '@/lib/env';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export const metadata: Metadata = {
  // Was 67 ch (truncated in SERP). Layout's title.template adds
  // " · Civique" — keep the bare phrase here for natural reading.
  title: { absolute: "Pourquoi choisir Civique pour l'examen civique 2026" },
  description:
    "Comparatif Civique vs sites officiels, PDF préfecture, MOOCs : pool officiel du Ministère, 8 langues, révisions adaptatives SM-2.",
  alternates: { canonical: '/pourquoi-civique' },
  openGraph: {
    title: 'Pourquoi Civique pour votre examen civique 2026',
    description:
      "La préparation indépendante la plus rigoureuse — pool officiel, 8 langues, méthode adaptative.",
    url: '/pourquoi-civique',
    siteName: 'Civique',
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pourquoi Civique pour votre examen civique 2026',
    description:
      "Comparatif rigoureux face aux sites officiels et aux MOOCs. Pool ministériel, 8 langues, SM-2.",
  },
};

interface Coverage {
  total: number;
  official: number;
  official_csp: number;
  official_cr: number;
  official_nat: number;
  official_pct: number;
}

/**
 * Same live-coverage call as the methodologie page — backs the
 * "X% traçable au pool officiel" pillar with a real number.
 */
async function fetchCoverage(): Promise<Coverage | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/public/coverage`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data: Coverage };
    return json.data;
  } catch {
    return null;
  }
}

/**
 * /pourquoi-civique — public, indexed, brand differentiation page.
 *
 * Why this page exists
 * --------------------
 * The audit identified that we had a strong product but no consolidated
 * "why us" landing. Visitors arrive via SEO on "examen civique
 * préparation" / "questions naturalisation 2026" and need a fast read
 * on what makes Civique different from the three main alternatives:
 *
 *   - Sites officiels (vie-publique, service-public): exhaustifs mais
 *     non-pédagogiques, pas d'entraînement, pas d'évaluation.
 *   - PDF de préfecture (livret du citoyen brut): référence mais
 *     statique, monolingue, pas d'interactivité.
 *   - MOOC / apps généralistes (Babbel, Coursera): pas de focus
 *     examen civique, ou contenu obsolète vis-à-vis de l'arrêté 2025.
 *
 * The comparative table is intentionally not snarky — we cite what
 * each ressource fait bien et où elle s'arrête. Crédibilité d'abord.
 *
 * Cite par défaut sur des faits vérifiables (URLs officielles, dates,
 * pool count). Aucun chiffre du concurrent fabriqué.
 */
export default async function PourquoiPage() {
  const coverage = await fetchCoverage();

  return (
    <div className="min-h-screen bg-bone flex flex-col">
      <SiteHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-[1340px] mx-auto w-full px-6 sm:px-10 py-16 sm:py-20 focus:outline-none"
      >
        {/* Hero */}
        <section className="max-w-3xl">
          <p className="eyebrow mb-4">— Pourquoi nous choisir</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.04] mb-6 font-medium tracking-tight">
            La préparation à l'<span className="display-italic text-terracotta">examen civique</span><br />
            la plus rigoureuse et la plus humaine.
          </h1>
          <p className="text-ink-mute text-[1.1rem] leading-[1.65] mb-4">
            Beaucoup de ressources couvrent l'examen civique : sites officiels,
            PDF de préfectures, vidéos YouTube, MOOCs. Toutes sont utiles. Aucune
            ne réunit ce que Civique propose dans un seul outil :{' '}
            <strong>
              une préparation alignée sur l'arrêté du 10 octobre 2025
            </strong>
            , adaptée à votre rythme, traduite dans huit langues, et qui apprend
            de vos erreurs.
          </p>
          {coverage ? (
            <p className="text-ink-mute text-[0.95rem] leading-[1.65] italic">
              <strong className="text-aubergine not-italic">
                {coverage.official}/{coverage.total} questions
              </strong>{' '}
              ({coverage.official_pct}%) sont traçables au pool officiel du
              Ministère de l'Intérieur — chiffre vérifié et mis à jour
              automatiquement.
            </p>
          ) : null}
        </section>

        {/* 5 pillars */}
        <section className="mt-16 sm:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Pillar
            icon="📜"
            title="Pool officiel intégré"
            text="Les questions du Ministère de l'Intérieur (CSP / CR / NAT) sont importées telles quelles, sous-titrées et explicables — pas de paraphrase, pas de devinette."
          />
          <Pillar
            icon="🧭"
            title="Conforme à l'arrêté 2025"
            text="Distribution officielle 11 / 6 / 11 / 8 / 4 par thème, composition fine des sous-thèmes (devise, laïcité, vote, Union européenne…) — strictement reproduite."
          />
          <Pillar
            icon="🌐"
            title="Huit langues d'accompagnement"
            text="Français, arabe, persan, portugais, espagnol, hindi, anglais et turc : fiches, explications et indices traduits par des relecteurs natifs."
          />
          <Pillar
            icon="🧠"
            title="Révisions adaptatives (SRS)"
            text="Notre algorithme SM-2 (Anki) replanifie chaque question selon votre courbe de l'oubli. Vous révisez moins, vous retenez mieux."
          />
          <Pillar
            icon="🎧"
            title="Mode audio inclus"
            text="Livret du citoyen et Charte des droits et devoirs lus à voix haute, sans coût supplémentaire, dans la langue de votre navigateur."
          />
          <Pillar
            icon="🤝"
            title="Sans affiliation officielle"
            text="Civique est indépendant. Notre seule loyauté va à votre réussite — pas à un éditeur, pas à une école, pas à une administration."
          />
        </section>

        {/* Comparative table */}
        <section className="mt-16 sm:mt-24">
          <div className="max-w-3xl mb-10">
            <p className="eyebrow mb-4">— Comparatif honnête</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-medium tracking-tight mb-5">
              Ce que les autres font<br />
              <span className="display-italic text-terracotta">et où ils s'arrêtent</span>.
            </h2>
            <p className="text-ink-mute text-[1.05rem] leading-[1.6]">
              Aucune ressource n'est mauvaise. Mais chacune répond à un seul
              besoin, là où Civique en assemble cinq. Voici la lecture honnête
              du paysage, pour vous aider à choisir lucidement.
            </p>
          </div>

          <ComparativeTable />

          <p className="text-xs text-ink-mute italic mt-5 max-w-3xl leading-relaxed">
            — Comparatif établi à partir des ressources publiques accessibles
            au 14 mai 2026. Les concurrents cités sont les ressources les plus
            consultées sur les requêtes « examen civique préparation » et
            « questions naturalisation ». Aucune affiliation, aucune
            rétribution. Les chiffres affichés pour les autres ressources
            sont issus de leurs pages publiques au moment du comparatif.
          </p>
        </section>

        {/* Distinct sections — what we won't pretend to do */}
        <section className="mt-20 sm:mt-24 grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border-[1.5px] border-aubergine/15 bg-bone-deep p-8">
            <p className="font-display italic text-terracotta text-base mb-3">— Ce que Civique fait</p>
            <h3 className="font-display text-2xl font-medium mb-4">
              Préparer, accompagner, encourager.
            </h3>
            <ul className="space-y-2.5 text-ink leading-relaxed text-[0.98rem]">
              <li>✓ Importer le pool officiel du Ministère de l'Intérieur.</li>
              <li>✓ Reproduire la distribution prescrite par l'arrêté de 2025.</li>
              <li>✓ Adapter les révisions à vos lacunes (SM-2 / spaced repetition).</li>
              <li>✓ Traduire fiches et explications dans 8 langues.</li>
              <li>✓ Offrir le mode audio (Livret + Charte).</li>
              <li>✓ Vous laisser commencer gratuitement, sans CB.</li>
            </ul>
          </div>
          <div className="rounded-3xl border-[1.5px] border-aubergine/15 bg-bone p-8">
            <p className="font-display italic text-terracotta text-base mb-3">— Ce que Civique ne fait pas</p>
            <h3 className="font-display text-2xl font-medium mb-4">
              Honnêteté avant tout.
            </h3>
            <ul className="space-y-2.5 text-ink leading-relaxed text-[0.98rem]">
              <li>✗ Aucune affiliation avec l'État ou la préfecture.</li>
              <li>✗ Aucune garantie d'obtention du titre — c'est l'agent qui décide.</li>
              <li>✗ Pas de service juridique ; pour cela, voyez un avocat ou la Cimade.</li>
              <li>✗ Pas de prise de rendez-vous préfecture.</li>
              <li>✗ Pas de promesse de réussite « 100% » — quiconque le promet ment.</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 sm:mt-24">
          <div className="rounded-3xl bg-aubergine text-bone p-10 sm:p-14 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-terracotta/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-saffron/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="eyebrow text-saffron mb-4">— Convaincu ?</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] mb-5 font-medium tracking-tight">
                Essayez Civique<br />
                <span className="display-italic text-saffron">gratuitement</span> aujourd'hui.
              </h2>
              <p className="text-bone/85 text-[1.05rem] leading-relaxed mb-7">
                Aucune carte bancaire pour commencer. Vous accédez immédiatement
                aux fiches pédagogiques, à un quiz par thème et à la simulation
                d'examen blanche.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-primary text-base">
                  Créer mon compte gratuit
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/methodologie" className="btn-secondary text-base !bg-bone/10 !text-bone !border-bone/30 hover:!bg-bone/20">
                  Lire la méthodologie
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Pillar({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-6">
      <div className="text-3xl mb-3" aria-hidden>
        {icon}
      </div>
      <h3
        className="font-display text-xl font-medium mb-2"
        style={{ fontVariationSettings: "'opsz' 32" }}
      >
        {title}
      </h3>
      <p className="text-ink-mute text-[0.95rem] leading-[1.6]">{text}</p>
    </div>
  );
}

/**
 * The comparative table. Tailwind-only, no JS — works server-rendered
 * and prints clean. Mobile: collapses into vertical stacked cards
 * because a 5-column table on a phone is unreadable.
 */
function ComparativeTable() {
  // Rows are features; columns are providers. We want this data co-located
  // with the table component because adding/removing a feature must
  // touch only one place. Order: from "table stakes" to differentiators
  // — the longer the user reads, the more Civique pulls ahead.
  const rows: Array<{
    feature: string;
    civique: string | boolean;
    officielle: string | boolean;
    pdf: string | boolean;
    autres: string | boolean;
  }> = [
    { feature: 'Couvre l\'intégralité du programme civique 2026', civique: true, officielle: true, pdf: true, autres: 'Partiel' },
    { feature: 'Aligné sur l\'arrêté du 10 octobre 2025', civique: true, officielle: 'Évolutif', pdf: 'Souvent obsolète', autres: 'Rarement vérifié' },
    { feature: 'Pool officiel CSP / CR / NAT intégré et étiqueté', civique: '631 questions', officielle: 'Liens externes', pdf: 'Texte brut', autres: false },
    { feature: 'Questions interactives avec correction', civique: true, officielle: false, pdf: false, autres: 'Oui (limité)' },
    { feature: 'Révisions espacées (SRS, Anki-style)', civique: true, officielle: false, pdf: false, autres: false },
    { feature: 'Simulation d\'examen chronométrée', civique: true, officielle: false, pdf: false, autres: 'Parfois' },
    { feature: '8 langues d\'accompagnement (FR/AR/FA/PT/ES/HI/EN/TR)', civique: '8 langues', officielle: 'FR uniquement', pdf: 'FR uniquement', autres: 'EN parfois' },
    { feature: 'Mode audio (TTS) gratuit', civique: true, officielle: false, pdf: false, autres: 'Payant' },
    { feature: 'Charte des droits et devoirs intégrée et navigable', civique: true, officielle: 'PDF', pdf: 'PDF', autres: false },
    { feature: 'Suivi de progression personnalisé', civique: true, officielle: false, pdf: false, autres: 'Basique' },
    { feature: 'Sans publicité', civique: true, officielle: true, pdf: true, autres: 'Variable' },
    { feature: 'Démarrage gratuit, sans carte bancaire', civique: true, officielle: 'Gratuit', pdf: 'Gratuit', autres: 'Souvent CB requise' },
    { feature: 'Indépendant (pas d\'éditeur ni d\'école)', civique: true, officielle: 'État', pdf: 'Préfecture', autres: 'Éditeurs' },
  ];

  return (
    <div>
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border-[1.5px] border-aubergine/15 bg-bone-deep">
        <table className="w-full text-sm">
          <thead className="bg-aubergine text-bone">
            <tr>
              <th className="text-left px-5 py-4 font-display font-medium text-base">Fonctionnalité</th>
              <th className="text-center px-4 py-4 font-display font-medium text-base bg-terracotta">Civique</th>
              <th className="text-center px-4 py-4 font-display font-medium text-base">Sites officiels</th>
              <th className="text-center px-4 py-4 font-display font-medium text-base">PDF préfecture</th>
              <th className="text-center px-4 py-4 font-display font-medium text-base">Apps & MOOCs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-aubergine/10">
                <td className="px-5 py-4 text-ink font-medium leading-snug">
                  {row.feature}
                </td>
                <Cell value={row.civique} highlight />
                <Cell value={row.officielle} />
                <Cell value={row.pdf} />
                <Cell value={row.autres} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — stacked cards: same data, vertical so it reads. We
          avoid horizontal scroll on a phone (the user scrolls past
          rather than across, and the visual hierarchy stays intact). */}
      <div className="md:hidden space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-2xl border-[1.5px] border-aubergine/15 bg-bone-deep p-4"
          >
            <p className="font-medium text-ink mb-3 leading-snug">{row.feature}</p>
            <dl className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
              <dt className="text-ink-mute">Civique</dt>
              <dd className="text-right"><MobileMark value={row.civique} highlight /></dd>
              <dt className="text-ink-mute">Sites officiels</dt>
              <dd className="text-right"><MobileMark value={row.officielle} /></dd>
              <dt className="text-ink-mute">PDF préfecture</dt>
              <dd className="text-right"><MobileMark value={row.pdf} /></dd>
              <dt className="text-ink-mute">Apps & MOOCs</dt>
              <dd className="text-right"><MobileMark value={row.autres} /></dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  return (
    <td
      className={`px-4 py-4 text-center align-middle leading-tight ${
        highlight ? 'bg-terracotta/8 font-semibold text-aubergine' : 'text-ink-mute'
      }`}
    >
      {renderValue(value)}
    </td>
  );
}

function MobileMark({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  return (
    <span
      className={`${highlight ? 'font-semibold text-aubergine' : 'text-ink-mute'}`}
    >
      {renderValue(value)}
    </span>
  );
}

function renderValue(value: string | boolean): React.ReactNode {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1 text-success">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        <span className="sr-only">Oui</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1 text-ink-mute/50">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="sr-only">Non</span>
      </span>
    );
  }
  return <span>{value}</span>;
}
