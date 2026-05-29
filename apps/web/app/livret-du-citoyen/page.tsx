import Link from 'next/link';
import type { Metadata } from 'next';
import { ReadAloudButton } from '@/components/audio/ReadAloudButton';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import content from './content.json';

export const metadata: Metadata = {
  title: 'Livret du Citoyen — synthèse navigable',
  description:
    "Le Livret du Citoyen du Ministère de l'Intérieur (référence naturalisation française) en version navigable : 5 thèmes, repères chiffrés, dates clés.",
  alternates: { canonical: '/livret-du-citoyen' },
  openGraph: {
    title: 'Livret du Citoyen — synthèse navigable | Civique',
    description:
      "Le document officiel du Ministère mis en forme pour la lecture : 5 thèmes, repères chiffrés, dates clés.",
    url: '/livret-du-citoyen',
    siteName: 'Civique',
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Livret du Citoyen — synthèse navigable',
    description:
      "Document de référence Ministère de l'Intérieur, naturalisation française.",
  },
};

interface BaseBlock {
  type: string;
}
interface TextBlock extends BaseBlock {
  type: 'h3' | 'h4' | 'p';
  text: string;
}
interface ListBlock extends BaseBlock {
  type: 'ul';
  items: string[];
}
type Block = TextBlock | ListBlock;

interface Section {
  id: string;
  number: number;
  title: string;
  summary?: string;
  blocks: Block[];
}

interface AnnexeSubsection {
  id?: string;
  title: string;
  blocks: Block[];
}

interface LivretContent {
  title: string;
  subtitle?: string;
  disclaimer?: string;
  sources?: string[];
  sections: Section[];
  annexe?: AnnexeSubsection[] | { sections?: AnnexeSubsection[] };
}

const typedContent = content as unknown as LivretContent;

/**
 * Livret du Citoyen — public page.
 *
 * Renders a structured JSON synthesis of the official Ministry of Interior
 * "Livret du Citoyen" (the reference document for the naturalisation
 * civic exam and the préfecture assimilation interview).
 *
 * Why a JSON-driven page rather than MDX
 * --------------------------------------
 * MDX adds a runtime/loader layer we don't currently configure. JSON keeps
 * the content trivially scriptable for future i18n (drop a content.en.json
 * sibling and the same renderer works) and lets us re-generate the
 * document with one agent run when the Ministry publishes a new edition.
 *
 * The page is purely server-rendered (no client JS) — fast, SEO-friendly,
 * and the table of contents at the top deep-links to each section.
 */
export default function LivretPage() {
  const sections = typedContent.sections ?? [];
  const annexe = normalizeAnnexe(typedContent.annexe);

  return (
    <div className="min-h-screen bg-bone flex flex-col">
      <SiteHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
      <article className="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <p className="eyebrow mb-4">— Document de référence</p>
        <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] mb-6 font-medium tracking-tight">
          Livret du<br />
          <span className="display-italic text-terracotta">Citoyen</span>.
        </h1>
        {typedContent.subtitle ? (
          <p className="text-ink-mute text-[1.05rem] leading-[1.6] mb-3">
            {typedContent.subtitle}
          </p>
        ) : null}
        <p className="text-ink-mute text-[1.05rem] leading-[1.6] mb-6">
          Publié par le Ministère de l'Intérieur, le Livret du Citoyen est{' '}
          <strong>le référentiel officiel</strong> que les candidats à la
          naturalisation française doivent maîtriser pour l'examen civique et
          l'entretien d'assimilation. Ci-dessous, une synthèse navigable de
          son contenu, mise à jour pour 2026.
        </p>

        {/* Audio fallback for accessibility + candidates who study while
            commuting. Web Speech API — see ReadAloudButton.tsx. */}
        <div className="mb-8">
          <ReadAloudButton target="article" label="Écouter le Livret" />
        </div>

        {typedContent.disclaimer ? (
          <aside className="mb-12 rounded-2xl border-[1.5px] border-aubergine/15 bg-bone-deep px-5 py-4 text-sm text-ink-mute leading-relaxed font-display italic">
            — {typedContent.disclaimer}
          </aside>
        ) : null}

        {/* Table of contents */}
        <nav aria-label="Sommaire du livret" className="mb-14 rounded-2xl border-[1.5px] border-aubergine/15 bg-bone-deep p-5">
          <p className="font-display italic text-sm text-ink-mute mb-3">— Sommaire</p>
          <ol className="space-y-1.5">
            {sections.map((s) => (
              <li key={s.id} className="flex gap-3 items-baseline">
                <span className="font-display italic text-terracotta text-sm shrink-0">
                  {s.number}.
                </span>
                <a
                  href={`#${s.id}`}
                  className="text-aubergine hover:text-terracotta transition-colors font-medium"
                >
                  {s.title}
                </a>
              </li>
            ))}
            {annexe.length > 0 ? (
              <li className="flex gap-3 items-baseline pt-2 mt-2 border-t border-aubergine/10">
                <span className="font-display italic text-terracotta text-sm shrink-0">★</span>
                <a
                  href="#annexe"
                  className="text-aubergine hover:text-terracotta transition-colors font-medium"
                >
                  Annexe — Repères chiffrés
                </a>
              </li>
            ) : null}
          </ol>
        </nav>

        {sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}

        {annexe.length > 0 ? (
          <section className="mt-20 scroll-mt-24" id="annexe">
            <header className="mb-6 flex items-baseline gap-3">
              <span className="font-display italic text-terracotta text-base">— ★</span>
              <h2
                className="font-display text-2xl sm:text-[1.75rem] font-medium tracking-tight"
                style={{ fontVariationSettings: "'opsz' 48" }}
              >
                Annexe — Repères chiffrés
              </h2>
            </header>
            {annexe.map((sub, idx) => (
              <div key={idx} className="mt-8">
                <h3
                  className="font-display text-xl font-medium mb-3"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  {sub.title}
                </h3>
                {sub.blocks.map((b, i) => (
                  <BlockRenderer key={i} block={b} />
                ))}
              </div>
            ))}
          </section>
        ) : null}

        {typedContent.sources && typedContent.sources.length > 0 ? (
          <footer className="mt-20 pt-10 border-t border-aubergine/15">
            <p className="font-display italic text-sm text-ink-mute mb-3">— Sources et références</p>
            <ul className="space-y-1.5 text-sm text-ink-mute leading-relaxed">
              {typedContent.sources.map((src, i) => (
                <li key={i}>• {src}</li>
              ))}
              <li className="mt-3">
                <Link
                  href="/methodologie"
                  className="underline decoration-terracotta/40 hover:decoration-terracotta"
                >
                  Notre méthodologie complète →
                </Link>
              </li>
              <li>
                <Link
                  href="/charte"
                  className="underline decoration-terracotta/40 hover:decoration-terracotta"
                >
                  Charte des droits et devoirs du citoyen français →
                </Link>
              </li>
            </ul>
          </footer>
        ) : null}
      </article>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="mt-14 first:mt-0 scroll-mt-24" id={section.id}>
      <header className="mb-5 flex items-baseline gap-3">
        <span className="font-display italic text-terracotta text-base">— {section.number}</span>
        <h2
          className="font-display text-2xl sm:text-[1.75rem] font-medium tracking-tight"
          style={{ fontVariationSettings: "'opsz' 48" }}
        >
          {section.title}
        </h2>
      </header>
      {section.summary ? (
        <p className="text-ink-mute italic font-display text-[0.95rem] leading-relaxed mb-5">
          {section.summary}
        </p>
      ) : null}
      <div className="text-ink leading-[1.7] space-y-2">
        {section.blocks.map((b, i) => (
          <BlockRenderer key={i} block={b} />
        ))}
      </div>
    </section>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === 'h3') {
    return (
      <h3
        className="font-display text-xl font-medium mt-6 mb-2"
        style={{ fontVariationSettings: "'opsz' 32" }}
      >
        {block.text}
      </h3>
    );
  }
  if (block.type === 'h4') {
    return (
      <h4 className="font-display font-medium text-lg mt-5 mb-1 text-aubergine">
        {block.text}
      </h4>
    );
  }
  if (block.type === 'p') {
    return <p>{block.text}</p>;
  }
  if (block.type === 'ul') {
    return (
      <ul className="list-disc pl-6 space-y-1.5 my-3">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  return null;
}

/**
 * The agent produced annexe either as a flat array of subsections or as
 * an object with a `sections` field. Normalize to a flat array so the
 * renderer doesn't care which shape arrived.
 */
function normalizeAnnexe(
  annexe: LivretContent['annexe'],
): AnnexeSubsection[] {
  if (!annexe) return [];
  if (Array.isArray(annexe)) return annexe;
  if (annexe.sections && Array.isArray(annexe.sections)) return annexe.sections;
  return [];
}
