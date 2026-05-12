import { LANGUAGES, type Language } from '@civique/shared';

interface TranslationPendingNoticeProps {
  /** The active translation language (from cookie / user preference). */
  lang: Language;
  /**
   * Optional override for the visual variant. `subtle` (default) is a single
   * muted italic line — used inline above questions or fiche bodies. `boxed`
   * wraps the same copy in a softly tinted card — used for listing pages
   * (glossaire, fiches index) where the picker may not be in eyeshot.
   */
  variant?: 'subtle' | 'boxed';
  /** Optional className passthrough (e.g. spacing tweaks per call-site). */
  className?: string;
}

/**
 * Tiny notice shown when the user selected a translation language for which
 * we don't yet have content (today: English & Turkish). The copy stays
 * intentionally low-key — France stays primary, this is just a "we're on it"
 * acknowledgement, not an apology or an error.
 *
 * Render only when the active language has no translated row for the entity
 * the parent is rendering. The decision belongs to the parent — this
 * component just paints.
 */
export function TranslationPendingNotice({
  lang,
  variant = 'subtle',
  className = '',
}: TranslationPendingNoticeProps) {
  const def = LANGUAGES.find((l) => l.code === lang);
  const label = def?.nativeName ?? lang;

  if (variant === 'boxed') {
    return (
      <p
        role="status"
        className={`
          rounded-xl bg-bone-deep/70 border border-aubergine/10
          px-3.5 py-2 text-xs sm:text-[0.8rem] text-ink-mute
          font-display italic leading-snug
          ${className}
        `.trim()}
      >
        — Traduction en cours pour <span lang={lang} dir={def?.rtl ? 'rtl' : undefined}>{label}</span>.
        Le contenu reste affiché en français en attendant.
      </p>
    );
  }

  return (
    <p
      role="status"
      className={`
        text-xs text-ink-mute font-display italic leading-snug
        ${className}
      `.trim()}
    >
      — Traduction <span lang={lang} dir={def?.rtl ? 'rtl' : undefined}>{label}</span> en cours.
      Affichage en français pour l’instant.
    </p>
  );
}
