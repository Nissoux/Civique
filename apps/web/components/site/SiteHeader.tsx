import Link from 'next/link';
import { getCurrentUser } from '@/lib/server/me';
import { Logo } from '@/components/brand/Logo';
import { WelcomeStrip } from '@/components/brand/WelcomeStrip';

/**
 * Public-site header — used across the landing, /pourquoi-civique,
 * /methodologie, /livret-du-citoyen, /charte, /partenariats.
 *
 * Why a shared component (and not duplicated per page):
 *   - Pre-SEO sprint, the secondary pages shipped a minimal
 *     "← Retour à l'accueil" link only — no nav, no footer. Google saw
 *     a dead-end for internal linking, and visitors had no path forward.
 *   - Centralising means a single source of truth for nav items, which
 *     matters when we add /guides/ (Sprint 4) and /[lang]/ (Sprint 5).
 *
 * Anchors (#programme, #methode) use `/#anchor` form so they navigate
 * back to the home and scroll, when clicked from a non-home page.
 * Browsers handle this natively — no router push needed.
 */
export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <>
      <WelcomeStrip />
      <header className="border-b border-aubergine/15">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Logo />
          <nav
            aria-label="Navigation principale"
            className="hidden md:flex items-center gap-7 lg:gap-9 text-[0.95rem] font-medium"
          >
            <Link href="/#programme" className="hover:text-terracotta transition-colors">
              Le programme
            </Link>
            <Link href="/methodologie" className="hover:text-terracotta transition-colors">
              Méthodologie
            </Link>
            <Link
              href="/pourquoi-civique"
              className="hover:text-terracotta transition-colors"
            >
              Pourquoi Civique
            </Link>
            <Link
              href="/partenariats"
              className="hover:text-terracotta transition-colors hidden lg:inline"
            >
              Partenariats
            </Link>
            {user ? (
              <Link href="/app" className="btn-primary !px-5 !py-2 text-sm">
                Mon tableau de bord →
              </Link>
            ) : (
              <Link href="/login" className="hover:text-terracotta transition-colors">
                Se connecter
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
