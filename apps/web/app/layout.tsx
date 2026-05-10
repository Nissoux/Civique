import type { Metadata, Viewport } from 'next';
import { Newsreader, Karla } from 'next/font/google';
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
  metadataBase: new URL('https://civique.fr'),
  icons: {
    icon: '/favicon.png',
  },
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
