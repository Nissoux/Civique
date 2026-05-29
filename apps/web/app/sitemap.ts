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
  '/': '2026-05-29',                        // hero copy, themes, FeatureCards
  '/register': '2026-05-15',                // auth UI stable since May
  '/login': '2026-05-15',                   // auth UI stable since May
  '/pourquoi-civique': '2026-05-29',        // h1 rewrite + pillar copy
  '/methodologie': '2026-05-29',            // h1 rewrite + meta overhaul
  '/livret-du-citoyen': '2026-05-20',       // content.json last updated
  '/charte': '2026-05-10',                  // décret text reproduction, stable
  '/partenariats': '2026-05-25',            // pillar copy, three personas
  '/privacy': '2026-05-11',                 // matches LAST_UPDATED in mentions
  '/terms': '2026-05-11',                   // matches LAST_UPDATED in mentions
  '/mentions-legales': '2026-05-11',
};

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
      url: `${BASE_URL}/register`,
      lastModified: date('/register'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: date('/login'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
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
