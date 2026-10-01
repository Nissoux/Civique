import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllGuides } from '@/lib/guides';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export const metadata: Metadata = {
  // Layout adds " · Civique" via title.template.
  title: "Guides pratiques — examen civique et naturalisation",
  description:
    "Guides gratuits pour préparer l'examen civique 2026 et la naturalisation : déroulé de l'épreuve, entretien d'assimilation, laïcité, symboles, livret du citoyen.",
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Guides pratiques — examen civique et naturalisation',
    description:
      "Comprendre l'examen civique 2026, l'entretien d'assimilation et le parcours de naturalisation, pas à pas.",
    url: '/guides',
    siteName: 'Civique',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides pratiques — examen civique et naturalisation',
    description:
      "Comprendre l'examen civique 2026, l'entretien d'assimilation et le parcours de naturalisation, pas à pas.",
  },
};

const BASE_URL = 'https://civique.integrafle.fr';

export default function GuidesHubPage() {
  const guides = getAllGuides();

  // CollectionPage JSON-LD: declares the hub as a curated list of the 8
  // guides, each pointing at its Article page.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guides pratiques — examen civique et naturalisation',
    url: `${BASE_URL}/guides`,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${BASE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: guides.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${g.h1Main} ${g.h1Accent}`,
        url: `${BASE_URL}/guides/${g.slug}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-bone flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-[1340px] mx-auto w-full px-6 sm:px-10 py-14 sm:py-20 focus:outline-none"
      >
        <header className="max-w-3xl mb-12">
          <p className="eyebrow mb-4">— Guides pratiques</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.04] mb-6 font-medium tracking-tight">
            Comprendre l'examen,{' '}
            <span className="display-italic text-terracotta">pas à pas</span>.
          </h1>
          <p className="text-ink-mute text-[1.1rem] leading-[1.65]">
            Des guides clairs et sourcés pour préparer l'examen civique 2026,
            l'entretien d'assimilation et votre parcours vers le titre de
            séjour ou la nationalité française. Gratuits, sans inscription.
          </p>
        </header>

        {/* Ordered as a learning path: comprendre l'examen → réviser les
            fondamentaux → préparer l'entretien. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map((g, i) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="card !rounded-3xl !p-6 flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-clay-lg"
            >
              <span
                className="font-display italic text-[2.5rem] leading-none text-terracotta/70 mb-3"
                aria-hidden
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2
                className="font-display text-xl font-medium leading-snug text-aubergine mb-2"
                style={{ fontVariationSettings: "'opsz' 36" }}
              >
                {g.h1Main} {g.h1Accent}
              </h2>
              <p className="text-sm text-ink-mute leading-[1.6] flex-1">
                {g.metaDescription}
              </p>
              <p className="mt-4 text-sm font-semibold text-terracotta">
                Lecture {g.readingMinutes} min →
              </p>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
