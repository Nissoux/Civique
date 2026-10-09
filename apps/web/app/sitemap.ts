import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_WEB_URL || 'https://civique.integrafle.fr';

// Static lastModified dates per route. Why static and not `new Date()`:
// Google reads `<lastmod>` as a recrawl signal — if every URL claims to
// have changed "just now" on every fetch of the sitemap, the value
// becomes noise and gets de-weighted. Honest dates (the actual last
// meaningful content update) keep the signal trustworthy.
//
// Bump the date for a route when its content materially changes.
// Format: YYYY-MM-DD. Convert to Date at build-time.
const LAST_MODIFIED: Record<string, string> = {
  '/': '2026-10-07',                        // + section « Guides pratiques » (8 liens)
  '/pourquoi-civique': '2026-05-29',        // h1 rewrite + pillar copy
  '/methodologie': '2026-05-29',            // h1 rewrite + meta overhaul
  '/livret-du-citoyen': '2026-05-20',       // content.json last updated
  '/charte': '2026-05-10',                  // décret text reproduction, stable
  '/partenariats': '2026-05-25',            // pillar copy, three personas
  '/privacy': '2026-05-11',                 // matches LAST_UPDATED in mentions
  '/terms': '2026-05-11',                   // matches LAST_UPDATED in mentions
  '/mentions-legales': '2026-05-11',
  '/guides': '2026-10-01',                  // cluster launch
};

// The /guides/ long-tail cluster. Kept as a flat list (rather than
// importing lib/guides.ts) so the sitemap stays dependency-free; the
// launch date doubles as lastModified until a guide's content changes.
const GUIDE_SLUGS: Array<{ slug: string; lastModified: string }> = [
  { slug: 'comment-passer-examen-civique-2026', lastModified: '2026-10-01' },
  { slug: 'difference-csp-cr-naturalisation', lastModified: '2026-10-01' },
  { slug: 'livret-citoyen-resume', lastModified: '2026-10-01' },
  { slug: 'marianne-symboles-republique', lastModified: '2026-10-01' },
  { slug: 'laicite-comprendre-principe', lastModified: '2026-10-01' },
  { slug: 'droits-devoirs-citoyen-francais', lastModified: '2026-10-01' },
  { slug: 'parcours-naturalisation-etapes', lastModified: '2026-10-01' },
  { slug: 'entretien-assimilation-questions-frequentes', lastModified: '2026-10-01' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const date = (path: string) => new Date(LAST_MODIFIED[path]);

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: date('/'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pourquoi-civique`,
      lastModified: date('/pourquoi-civique'),
      changeFrequency: 'monthly',
      // High priority — this is the main differentiation page, target
      // of paid-acquisition links and the "why us" SEO bucket.
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/methodologie`,
      lastModified: date('/methodologie'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/livret-du-citoyen`,
      lastModified: date('/livret-du-citoyen'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/charte`,
      lastModified: date('/charte'),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/partenariats`,
      lastModified: date('/partenariats'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: date('/guides'),
      changeFrequency: 'monthly',
      // Hub of the long-tail content cluster — high priority: it's the
      // organic-acquisition entry point.
      priority: 0.9,
    },
    ...GUIDE_SLUGS.map((g) => ({
      url: `${BASE_URL}/guides/${g.slug}`,
      lastModified: new Date(g.lastModified),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // /register and /login are deliberately absent: they are noindex
    // (see their page metadata) and a sitemap must only list URLs we
    // want indexed — listing them sent Googlebot to the auth forms
    // while the guides were still waiting to be crawled.
    {
      url: `${BASE_URL}/privacy`,
      lastModified: date('/privacy'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: date('/terms'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: date('/mentions-legales'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
