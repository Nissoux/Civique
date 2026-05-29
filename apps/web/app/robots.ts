import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_WEB_URL || 'https://civique.integrafle.fr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // `allow: ['/']` is the default; listing specific paths under it
        // is a no-op against the disallow rules. The cleaner intent: open
        // everything by default, name explicitly what NOT to crawl.
        allow: ['/'],
        disallow: [
          '/app/',                  // authenticated user shell — private
          '/onboarding/',           // auth flow, private
          '/api/',                  // API endpoints — never indexed
          '/design-explorations/',  // prototype HTML pages — pollute index
          '/forgot-password',       // already noindex via metadata; belt + braces
          '/reset-password',        // same
          '/verify-email',          // auth callback, no SEO value
          '/oauth/',                // OAuth callback routes
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
