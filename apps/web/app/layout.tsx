import type { Metadata, Viewport } from 'next';
import { Newsreader, Karla } from 'next/font/google';
import { CookieBanner } from '@/components/cookie/CookieBanner';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
});

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Civique — Préparez votre examen civique français',
  description:
    "Civique vous accompagne dans la préparation de l'examen civique français : pour la carte de séjour pluriannuelle, la carte de résident ou la nationalité. 5 thèmes officiels, 611 questions, 6 langues.",
  metadataBase: new URL('https://civique.integrafle.fr'),
  // Favicons are emitted automatically from `app/icon.svg` + `app/apple-icon.png`
  // via Next.js' file-based metadata convention — no explicit icons block here.
  openGraph: {
    title: 'Civique — Préparez votre examen civique français',
    description:
      "La préparation officielle pour la carte de séjour, la carte de résident et la nationalité française.",
    locale: 'fr_FR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#F4ECDD',
  width: 'device-width',
  initialScale: 1,
};

// Force every route to render dynamically. We hit a Next.js 15 + React 19 +
// pnpm-workspace issue where static prerender of /404 and /500 throws
// "Cannot read properties of null (reading 'useContext')" — the root cause
// is React being resolved twice in the workspace's traced module graph.
// Dynamic rendering bypasses prerender entirely. Trade-off: no static HTML
// caching on the public landing/legal pages, but for an MVP at low traffic
// this is invisible to users and we keep all our Server Components +
// Server Actions intact.
// TODO post-launch: pin react/react-dom via pnpm.overrides at the workspace
// root once we confirm it doesn't break the mobile RN build, then drop this.
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${newsreader.variable} ${karla.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        {/* Skip-to-main-content link for keyboard / screen-reader users.
            Stays visually hidden until focused, then surfaces as a focused chip. */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            focus:fixed focus:top-3 focus:left-3 focus:z-[100]
            focus:inline-flex focus:items-center focus:px-4 focus:py-2
            focus:rounded-full focus:bg-aubergine focus:text-bone
            focus:font-semibold focus:text-sm focus:shadow-warm
            focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone
          "
        >
          Aller au contenu principal
        </a>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
