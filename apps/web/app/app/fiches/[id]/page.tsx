import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { LANGUAGES, THEMES } from '@civique/shared';
import { getCurrentUser } from '@/lib/server/me';
import { getCurrentLang } from '@/lib/server/lang';
import { getFiche, getFiches } from '@/lib/server/fiches';
import { FicheContent } from '@/components/fiches/FicheContent';
import { TranslationPendingNotice } from '@/components/nav/TranslationStatus';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return { title: 'Fiche — Civique' };

  try {
    const fiche = await getFiche(numericId);
    if (!fiche) return { title: 'Fiche introuvable — Civique' };
    return {
      title: `${fiche.titleFr} — Fiche mémo`,
      description: (fiche.contentFr || '').slice(0, 160),
    };
  } catch {
    return { title: 'Fiche — Civique' };
  }
}

export default async function FicheDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/expire');

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const lang = await getCurrentLang(user.preferredLang);
  const fiche = await getFiche(numericId, lang);
  if (!fiche) notFound();

  // For prev/next we fetch the full list of fiches in this theme.
  // Cheap because the API is paginated and themes typically hold <30 fiches.
  // Fallback to empty siblings on error.
  let siblings: Awaited<ReturnType<typeof getFiches>> = [];
  try {
    siblings = await getFiches({
      themeId: fiche.themeId,
      lang: lang,
      limit: 100,
    });
  } catch {
    siblings = [fiche];
  }

  const currentIndex = siblings.findIndex((f) => f.id === fiche.id);
  const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < siblings.length - 1
      ? siblings[currentIndex + 1]
      : null;
  const positionLabel =
    currentIndex >= 0
      ? `${currentIndex + 1} / ${siblings.length}`
      : null;

  const theme = THEMES.find((t) => t.id === fiche.themeId);
  const themeColor = theme?.color ?? '#2D1B2E';
  const themeName = theme?.nameFr ?? '';

  const langDef = LANGUAGES.find((l) => l.code === lang);
  const isRtl = langDef?.rtl ?? false;
  const showTranslation =
    lang !== 'fr' &&
    fiche.translatedContent &&
    fiche.translatedContent !== fiche.contentFr;

  const isLocked = fiche.isPremium && !user.isPremium;

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <section
        className="
          relative bg-aubergine text-bone overflow-hidden
          border-b-[1.5px] border-aubergine
        "
      >
        <div
          className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: themeColor }}
        />

        <div className="relative max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-10">
          <Link
            href="/app/fiches"
            className="
              inline-flex items-center gap-2 text-sm text-bone/75 hover:text-bone
              mb-5 transition-colors
            "
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Toutes les fiches
          </Link>

          {theme ? (
            <div className="inline-flex items-center gap-2 mb-4 rounded-full bg-bone/10 border border-bone/20 px-3 py-1">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-bone/85">
                {themeName}
              </span>
            </div>
          ) : null}

          <h1
            className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 72" }}
          >
            {fiche.titleFr}
          </h1>

          {showTranslation && fiche.translatedTitle && fiche.translatedTitle !== fiche.titleFr ? (
            <p
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`mt-2 font-display italic text-bone/80 text-lg sm:text-xl ${isRtl ? 'text-right' : ''}`}
            >
              {fiche.translatedTitle}
            </p>
          ) : null}

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            {positionLabel ? (
              <span className="pill bg-bone/10 border-bone/20 text-bone">
                Fiche {positionLabel}
              </span>
            ) : null}
            {fiche.isPremium ? (
              <span className="pill bg-saffron/30 border-saffron/60 text-bone">
                <svg className="h-3 w-3 text-saffron" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                Premium
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-10">
        {isLocked ? (
          <LockedCard />
        ) : (
          <div className="space-y-6">
            {/* French content */}
            <article className="card !rounded-2xl !p-6 sm:!p-8">
              <FicheContent content={fiche.contentFr} variant="primary" />
            </article>

            {/* Translated content — or a discreet "in progress" notice when
                the user picked a language we don't yet have a row for. */}
            {showTranslation && fiche.translatedContent ? (
              <article
                className="card-deep !rounded-2xl !p-6 sm:!p-8"
              >
                <p className="eyebrow mb-4">
                  — {langDef?.nativeName ?? lang}
                </p>
                <FicheContent
                  content={fiche.translatedContent}
                  variant="secondary"
                  rtl={isRtl}
                />
              </article>
            ) : lang !== 'fr' ? (
              <TranslationPendingNotice lang={lang} variant="boxed" />
            ) : null}
          </div>
        )}

        {/* Prev / Next nav within the same theme */}
        {(prev || next) && !isLocked ? (
          <nav
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3"
            aria-label="Navigation entre fiches"
          >
            {prev ? (
              <Link
                href={`/app/fiches/${prev.id}`}
                className="
                  card !rounded-2xl !p-5 transition-all
                  hover:-translate-y-1 hover:shadow-clay-lg
                "
              >
                <p className="eyebrow mb-1.5 text-[0.65rem]">— Précédente</p>
                <p className="font-display text-base sm:text-lg font-medium leading-snug text-aubergine line-clamp-2">
                  {prev.titleFr}
                </p>
                {prev.translatedTitle && prev.translatedTitle !== prev.titleFr ? (
                  <p className="font-display italic text-xs sm:text-sm text-ink-mute leading-snug mt-1 line-clamp-1">
                    {prev.translatedTitle}
                  </p>
                ) : null}
              </Link>
            ) : (
              <div aria-hidden />
            )}

            {next ? (
              <Link
                href={`/app/fiches/${next.id}`}
                className="
                  card !rounded-2xl !p-5 transition-all text-right
                  hover:-translate-y-1 hover:shadow-clay-lg
                  sm:text-right
                "
              >
                <p className="eyebrow mb-1.5 text-[0.65rem]">— Suivante</p>
                <p className="font-display text-base sm:text-lg font-medium leading-snug text-aubergine line-clamp-2">
                  {next.titleFr}
                </p>
                {next.translatedTitle && next.translatedTitle !== next.titleFr ? (
                  <p className="font-display italic text-xs sm:text-sm text-ink-mute leading-snug mt-1 line-clamp-1">
                    {next.translatedTitle}
                  </p>
                ) : null}
              </Link>
            ) : (
              <div aria-hidden />
            )}
          </nav>
        ) : null}

        <div className="mt-8 text-center">
          <Link href="/app/fiches" className="btn-secondary">
            Retour aux fiches
          </Link>
        </div>
      </section>
    </div>
  );
}

function LockedCard() {
  return (
    <article className="card !rounded-2xl !p-8 sm:!p-10 text-center">
      <div
        className="
          mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl
          bg-saffron/30 text-saffron
        "
        aria-hidden
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 11c1.10457 0 2-.8954 2-2V7a2 2 0 10-4 0v2c0 1.1046.8954 2 2 2zm-3 0V7a3 3 0 116 0v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z"
          />
        </svg>
      </div>
      <h2
        className="font-display text-2xl sm:text-3xl font-medium mb-2"
        style={{ fontVariationSettings: "'opsz' 60" }}
      >
        Contenu <span className="display-italic text-terracotta">Premium</span>
      </h2>
      <p className="text-sm sm:text-base text-ink-mute max-w-md mx-auto mb-6">
        Cette fiche est réservée aux membres Premium. Passez à Premium pour
        accéder à l'intégralité de la bibliothèque.
      </p>
      <Link href="/app/profile" className="btn-primary">
        Passer à Premium
      </Link>
    </article>
  );
}
