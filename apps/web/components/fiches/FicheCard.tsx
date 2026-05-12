import Link from 'next/link';
import type { Fiche } from '@civique/shared';

interface Props {
  fiche: Fiche;
  themeColor: string;
  themeName: string;
}

/**
 * Compact list card. The French title (source of truth) is always the
 * primary headline; the translated title — when it differs and the user
 * has picked a non-FR language — appears below in muted italic.
 *
 * The preview line is extracted from the FR content so it stays aligned
 * with the primary title; we don't surface a translated preview here to
 * keep the card scannable in any language.
 *
 * Server Component — pure presentation, no client state.
 */
export function FicheCard({ fiche, themeColor, themeName }: Props) {
  const titleFr = fiche.titleFr;
  const showTranslatedTitle =
    Boolean(fiche.translatedTitle) &&
    fiche.translatedTitle !== fiche.titleFr;

  const rawContent = fiche.contentFr || '';
  const preview =
    rawContent
      .replace(/^#+\s*/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.length > 0) || '';

  return (
    <Link
      href={`/app/fiches/${fiche.id}`}
      className="
        card !rounded-2xl !p-0 flex overflow-hidden
        transition-all hover:-translate-y-1 hover:shadow-clay-lg
        focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta
        focus-visible:ring-offset-2 focus-visible:ring-offset-bone
      "
    >
      <span
        aria-hidden
        className="w-1.5 shrink-0 self-stretch"
        style={{ backgroundColor: themeColor }}
      />

      <div className="flex-1 min-w-0 px-5 py-4">
        <div className="flex items-center gap-2 mb-1.5">
          <h3
            className="font-display text-lg sm:text-xl font-medium text-aubergine flex-1 min-w-0 truncate"
            style={{ fontVariationSettings: "'opsz' 32" }}
            title={titleFr}
          >
            {titleFr}
          </h3>
          {fiche.isPremium && (
            <span className="pill !text-[0.62rem] !px-2 !py-0.5 bg-saffron/30 border-saffron/60 text-aubergine">
              <svg
                className="h-2.5 w-2.5 text-saffron"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Premium
            </span>
          )}
        </div>
        {showTranslatedTitle ? (
          <p
            className="text-xs sm:text-sm text-ink-mute italic font-display leading-snug mb-1"
            title={fiche.translatedTitle}
          >
            {fiche.translatedTitle}
          </p>
        ) : null}
        <p className="text-sm text-ink-mute line-clamp-2 leading-snug">
          {preview}
        </p>
        <p className="sr-only">Thème : {themeName}</p>
      </div>

      <div className="flex items-center pr-4 text-aubergine/40">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
