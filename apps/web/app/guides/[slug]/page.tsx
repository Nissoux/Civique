import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllGuides, getGuide, guideMetadata, type GuideBlock } from '@/lib/guides';
import { RichText } from '@/components/guides/RichText';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: 'Guide introuvable' };
  return guideMetadata(guide);
}

const BASE_URL = 'https://civique.integrafle.fr';

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => g !== null);

  // JSON-LD: Article + BreadcrumbList, plus FAQPage when the guide has
  // a FAQ. Article/publisher references the site-wide Organization @id
  // emitted by the root layout, so Google links the pieces together.
  const structuredData: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${guide.h1Main} ${guide.h1Accent}`,
      description: guide.metaDescription,
      inLanguage: 'fr-FR',
      datePublished: guide.updatedAt,
      dateModified: guide.updatedAt,
      author: { '@id': `${BASE_URL}/#organization` },
      publisher: { '@id': `${BASE_URL}/#organization` },
      mainEntityOfPage: `${BASE_URL}/guides/${guide.slug}`,
      keywords: guide.keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE_URL}/guides` },
        { '@type': 'ListItem', position: 3, name: `${guide.h1Main} ${guide.h1Accent}` },
      ],
    },
  ];
  if (guide.faq.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          // JSON-LD answers must be plain text — strip the two inline
          // markdown constructs the pipeline can emit.
          text: f.answer.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'),
        },
      })),
    });
  }

  return (
    <div className="min-h-screen bg-bone flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <article className="max-w-3xl mx-auto px-6 sm:px-10 py-14 sm:py-20">
          {/* Breadcrumb — mirrors the BreadcrumbList JSON-LD */}
          <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-ink-mute">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-terracotta">Accueil</Link>
              </li>
              <li aria-hidden>›</li>
              <li>
                <Link href="/guides" className="hover:text-terracotta">Guides</Link>
              </li>
            </ol>
          </nav>

          <p className="eyebrow mb-4">— Guide pratique</p>
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] mb-4 font-medium tracking-tight">
            {guide.h1Main}{' '}
            <span className="display-italic text-terracotta">{guide.h1Accent}</span>
          </h1>

          <p className="mb-8 text-sm text-ink-mute font-display italic">
            — Lecture {guide.readingMinutes} min · Mis à jour le{' '}
            {new Date(guide.updatedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <div className="space-y-4 text-[1.05rem] leading-[1.7] text-ink mb-12">
            {guide.intro.map((para, i) => (
              <p key={i}>
                <RichText text={para} />
              </p>
            ))}
          </div>

          {guide.sections.map((section, i) => (
            <section key={i} className="mt-12 first:mt-0">
              <h2
                className="font-display text-2xl sm:text-[1.75rem] font-medium tracking-tight text-aubergine mb-4"
                style={{ fontVariationSettings: "'opsz' 48" }}
              >
                {section.heading}
              </h2>
              <div className="space-y-4 text-[1.025rem] leading-[1.7] text-ink">
                {section.blocks.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </div>
            </section>
          ))}

          {guide.faq.length > 0 ? (
            <section className="mt-14">
              <h2
                className="font-display text-2xl sm:text-[1.75rem] font-medium tracking-tight text-aubergine mb-6"
                style={{ fontVariationSettings: "'opsz' 48" }}
              >
                Questions fréquentes
              </h2>
              <div className="space-y-4">
                {guide.faq.map((f, i) => (
                  <details
                    key={i}
                    className="card !rounded-2xl !p-0 overflow-hidden group"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 font-display text-lg font-medium text-aubergine flex items-center justify-between gap-3 hover:text-terracotta transition-colors">
                      {f.question}
                      <span aria-hidden className="text-terracotta shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-[0.98rem] leading-[1.65] text-ink">
                      <RichText text={f.answer} />
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* CTA — sober, single mention, consistent with the editorial rule
              that guides sell by being useful, not by pitching. */}
          <aside className="mt-14 rounded-3xl bg-aubergine text-bone p-7 sm:p-9">
            <p className="font-display text-xl sm:text-2xl font-medium mb-2">
              Prêt à vous <span className="display-italic text-saffron">entraîner</span> ?
            </p>
            <p className="text-bone/80 leading-relaxed mb-6 text-[0.98rem]">
              Civique vous prépare avec les questions officielles, des examens
              blancs et un suivi de progression — gratuit pour commencer, sans
              carte bancaire.
            </p>
            <Link href="/register" className="btn-primary">
              Créer mon compte gratuit
            </Link>
          </aside>

          {guide.sources.length > 0 ? (
            <footer className="mt-12 pt-8 border-t border-aubergine/15">
              <p className="font-display italic text-sm text-ink-mute mb-3">
                — Sources officielles
              </p>
              <ul className="space-y-1.5 text-sm text-ink-mute leading-relaxed">
                {guide.sources.map((src, i) => (
                  <li key={i}>
                    •{' '}
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-terracotta/40 hover:decoration-terracotta"
                    >
                      {src.label}
                    </a>
                  </li>
                ))}
              </ul>
            </footer>
          ) : null}

          {related.length > 0 ? (
            <section className="mt-12">
              <p className="font-display italic text-sm text-ink-mute mb-4">
                — À lire ensuite
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/guides/${r.slug}`}
                    className="card !rounded-2xl !p-5 transition-all hover:-translate-y-0.5 hover:shadow-clay-lg"
                  >
                    <p className="font-display text-lg font-medium text-aubergine leading-snug mb-1">
                      {r.h1Main} {r.h1Accent}
                    </p>
                    <p className="text-sm text-ink-mute">
                      Lecture {r.readingMinutes} min →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

function Block({ block }: { block: GuideBlock }) {
  if (block.type === 'ul' && block.items) {
    return (
      <ul className="list-disc pl-6 space-y-1.5">
        {block.items.map((item, i) => (
          <li key={i}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === 'p' && block.text) {
    return (
      <p>
        <RichText text={block.text} />
      </p>
    );
  }
  return null;
}

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}
