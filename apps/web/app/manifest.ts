import type { MetadataRoute } from 'next';

/**
 * PWA manifest — makes Civique installable to the mobile home screen
 * from the web browser ("Add to Home Screen" on iOS/Android). For a
 * product whose users consult mostly on mobile, this is a free
 * conversion lever: a tile on the home screen returns users without
 * them having to retype the URL.
 *
 * Icons reference the file-based metadata convention (`app/icon.png`,
 * `app/apple-icon.png`) which Next.js exposes at /icon.png and
 * /apple-icon.png respectively. Add more sizes here if Lighthouse PWA
 * audit later complains about missing 192/512 maskable icons.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Civique — Examen civique français',
    short_name: 'Civique',
    description:
      "Préparation indépendante à l'examen civique français 2026 : QCM officiels, entretien d'assimilation, 8 langues.",
    start_url: '/',
    display: 'standalone',
    background_color: '#F4ECDD', // bone
    theme_color: '#F4ECDD',
    orientation: 'portrait',
    lang: 'fr-FR',
    dir: 'ltr',
    categories: ['education', 'reference'],
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
