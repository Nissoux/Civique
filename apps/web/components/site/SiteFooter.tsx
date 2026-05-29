import Link from 'next/link';
import { getCurrentUser } from '@/lib/server/me';
import { Logo } from '@/components/brand/Logo';

/**
 * Public-site footer — extracted from the home so that every public
 * landing page (/pourquoi-civique, /methodologie, /livret-du-citoyen,
 * /charte, /partenariats) ships the same maillage interne.
 *
 * The SEO audit (2026-05-29) called this out as a top priority: the
 * footer was only present on the home, which left Google crawling the
 * other landing pages without follow-links to the cluster. Putting the
 * footer everywhere doubles the internal-link count to each /référence/
 * page, which feeds PageRank distribution and improves discoverability.
 *
 * Programme + Méthode anchors point to /#programme and /#methode so
 * they keep working from any page (browser handles the cross-page
 * fragment-scroll natively).
 */
export async function SiteFooter() {
  const user = await getCurrentUser();

  return (
    <footer className="bg-aubergine text-bone border-t border-aubergine">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-14 grid grid-cols-2 md:grid-cols-12 gap-8">
        <div className="col-span-2 md:col-span-5">
          <Logo size="md" href={null} className="[&_span:last-child]:!text-bone" />
          <p className="display-italic text-[1.05rem] mt-4 text-saffron">
            Tisser un nouveau chez-soi.
          </p>
          <p className="text-bone/60 text-sm mt-3 max-w-xs leading-relaxed">
            Préparation indépendante à l'examen civique français. Sans affiliation
            officielle avec l'État.
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 md:col-start-6">
          <p className="font-semibold mb-3 text-bone">Produit</p>
          <ul className="space-y-2 text-sm text-bone/70">
            <li>
              <Link href="/#programme" className="hover:text-saffron">
                Le programme
              </Link>
            </li>
            <li>
              <Link href="/#methode" className="hover:text-saffron">
                Méthode
              </Link>
            </li>
            <li>
              <Link href="/pourquoi-civique" className="hover:text-saffron">
                Pourquoi Civique
              </Link>
            </li>
            <li>
              {user ? (
                <Link href="/app" className="hover:text-saffron">
                  Mon tableau de bord
                </Link>
              ) : (
                <Link href="/login" className="hover:text-saffron">
                  Connexion
                </Link>
              )}
            </li>
          </ul>
        </div>
        <div className="col-span-1 md:col-span-3">
          {/* Reference content — back-links the public documentation
              pages we ship to crawlers and to anyone vetting our
              compliance story. Big SEO + credibility win. */}
          <p className="font-semibold mb-3 text-bone">Référence</p>
          <ul className="space-y-2 text-sm text-bone/70">
            <li>
              <Link href="/methodologie" className="hover:text-saffron">
                Méthodologie &amp; cadre légal
              </Link>
            </li>
            <li>
              <Link href="/livret-du-citoyen" className="hover:text-saffron">
                Livret du Citoyen
              </Link>
            </li>
            <li>
              <Link href="/charte" className="hover:text-saffron">
                Charte des droits et devoirs
              </Link>
            </li>
            <li>
              <Link href="/partenariats" className="hover:text-saffron">
                Partenariats associations
              </Link>
            </li>
            <li>
              <a href="mailto:contact@integrafle.fr" className="hover:text-saffron">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-2">
          <p className="font-semibold mb-3 text-bone">Légal</p>
          <ul className="space-y-2 text-sm text-bone/70">
            <li>
              <Link href="/privacy" className="hover:text-saffron">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-saffron">
                Conditions
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-saffron">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bone/10">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-bone/50">
          <span>© {new Date().getFullYear()} Civique · Tous droits réservés</span>
          <span className="display-italic">— Préparation indépendante</span>
        </div>
      </div>
    </footer>
  );
}
