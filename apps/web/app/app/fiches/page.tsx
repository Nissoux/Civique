import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentLang } from '@/lib/server/lang';
import { getFichesByTheme } from '@/lib/server/fiches';
import { ThemeFilter } from '@/components/fiches/ThemeFilter';

export const metadata = {
  title: 'Fiches mémo',
  description: 'Apprenez les essentiels du programme civique par thème.',
};

export default async function FichesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const lang = await getCurrentLang(user.preferredLang);
  let fichesByTheme: Record<number, import('@civique/shared').Fiche[]> = {};
  let loadError = false;
  try {
    fichesByTheme = await getFichesByTheme(lang);
  } catch {
    loadError = true;
  }

  const totalFiches = Object.values(fichesByTheme).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="
          relative bg-aubergine text-bone overflow-hidden
          border-b-[1.5px] border-aubergine
        "
      >
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-saffron/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-terracotta/25 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-10 sm:py-12">
          <p className="font-display italic text-saffron text-base mb-1">
            — Fiches mémo
          </p>
          <h1
            className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-medium tracking-tight mb-3"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            L'essentiel,{' '}
            <span className="display-italic text-terracotta">par thème</span>.
          </h1>
          <p className="text-sm sm:text-base text-bone/75 max-w-xl">
            Des fiches courtes pour réviser les notions clés à votre rythme,
            disponibles en huit langues.
          </p>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="pill bg-bone/10 border-bone/20 text-bone">
              {totalFiches} {totalFiches > 1 ? 'fiches' : 'fiche'}
            </span>
            {user.preferredLang !== 'fr' ? (
              <span className="pill bg-bone/10 border-bone/20 text-bone">
                Langue : {user.preferredLang}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-8 sm:py-10">
        {loadError ? (
          <div className="card !rounded-2xl !p-8 text-center">
            <p className="font-display italic text-ink-mute mb-2">
              — Chargement impossible
            </p>
            <p className="text-sm text-ink-mute">
              Impossible de récupérer les fiches pour le moment. Réessayez dans un instant.
            </p>
          </div>
        ) : totalFiches === 0 ? (
          <div className="card !rounded-2xl !p-8 text-center">
            <p className="font-display italic text-ink-mute mb-2">
              — Bibliothèque vide
            </p>
            <p className="text-sm text-ink-mute">
              Aucune fiche n'est disponible pour votre langue.
            </p>
          </div>
        ) : (
          <ThemeFilter fichesByTheme={fichesByTheme} />
        )}
      </section>
    </div>
  );
}
