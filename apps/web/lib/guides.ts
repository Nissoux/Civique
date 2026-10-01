import type { Metadata } from 'next';

import commentPasser from '@/app/guides/_content/comment-passer-examen-civique-2026.json';
import differenceTitres from '@/app/guides/_content/difference-csp-cr-naturalisation.json';
import entretienFaq from '@/app/guides/_content/entretien-assimilation-questions-frequentes.json';
import livretResume from '@/app/guides/_content/livret-citoyen-resume.json';
import symboles from '@/app/guides/_content/marianne-symboles-republique.json';
import laicite from '@/app/guides/_content/laicite-comprendre-principe.json';
import parcoursNat from '@/app/guides/_content/parcours-naturalisation-etapes.json';
import droitsDevoirs from '@/app/guides/_content/droits-devoirs-citoyen-francais.json';

export interface GuideBlock {
  type: 'p' | 'ul';
  text?: string;
  items?: string[];
}

export interface GuideSection {
  heading: string;
  blocks: GuideBlock[];
}

export interface GuideFaqItem {
  question: string;
  answer: string;
}

export interface GuideSource {
  label: string;
  url: string;
}

export interface GuideContent {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1Main: string;
  h1Accent: string;
  intro: string[];
  sections: GuideSection[];
  faq: GuideFaqItem[];
  sources: GuideSource[];
  related: string[];
  keywords: string[];
  updatedAt: string;
  readingMinutes: number;
}

/**
 * Registry of the /guides/ long-tail content cluster.
 *
 * Content lives as JSON in app/guides/_content/ (private folder — the
 * underscore keeps it out of the router). JSON rather than MDX for the
 * same reason as the Livret page: trivially scriptable, i18n-ready
 * (drop a <slug>.<lang>.json sibling later), and regenerable by an
 * agent run when the official corpus evolves. Rendering (headings,
 * rich text, JSON-LD) is centralised in app/guides/[slug]/page.tsx so
 * every guide stays visually and structurally consistent.
 *
 * ORDER MATTERS: this is the hub's display order — a deliberate
 * learning path (comprendre l'examen → réviser → aller à l'entretien).
 */
const REGISTRY: GuideContent[] = [
  commentPasser,
  differenceTitres,
  livretResume,
  symboles,
  laicite,
  droitsDevoirs,
  parcoursNat,
  entretienFaq,
] as unknown as GuideContent[];

export function getAllGuides(): GuideContent[] {
  return REGISTRY;
}

export function getGuide(slug: string): GuideContent | null {
  return REGISTRY.find((g) => g.slug === slug) ?? null;
}

/** Shared metadata builder so hub + pages stay consistent. */
export function guideMetadata(guide: GuideContent): Metadata {
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `/guides/${guide.slug}`,
      siteName: 'Civique',
      locale: 'fr_FR',
      type: 'article',
      publishedTime: guide.updatedAt,
      modifiedTime: guide.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  };
}
