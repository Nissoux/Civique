import { Fragment } from 'react';

interface Props {
  content: string;
  /** Render with reduced emphasis (used for the translated copy block). */
  variant?: 'primary' | 'secondary';
  /** Right-to-left text direction (Arabic, Farsi). */
  rtl?: boolean;
}

/**
 * Renders the structured-markdown content used by mobile fiches.
 * Format (matches mobile renderer):
 *   - Paragraphs separated by blank lines (\n\n)
 *   - `# ` headings (H1)
 *   - `## ` headings (H2)
 *   - `- ` bullet points
 *   - `**bold**` inline emphasis
 *
 * Server Component — pure rendering, no client interactivity.
 */
export function FicheContent({
  content,
  variant = 'primary',
  rtl = false,
}: Props) {
  if (!content?.trim()) return null;

  const blocks = content.split(/\n\n+/);
  const dir = rtl ? 'rtl' : 'ltr';
  const align = rtl ? 'text-right' : 'text-left';

  const headingPrimaryCls =
    variant === 'primary'
      ? 'text-terracotta'
      : 'text-aubergine/80';
  const heading2Cls =
    variant === 'primary'
      ? 'text-aubergine'
      : 'text-aubergine/70';
  const bodyCls =
    variant === 'primary'
      ? 'text-aubergine/90'
      : 'text-ink-mute';
  const bulletCls =
    variant === 'primary' ? 'text-terracotta' : 'text-ink-faded';

  return (
    <div dir={dir} className={`space-y-4 ${align}`}>
      {blocks.map((raw, idx) => {
        const trimmed = raw.trim();
        if (!trimmed) return null;

        // H1
        if (trimmed.startsWith('# ')) {
          return (
            <h2
              key={idx}
              className={`font-display text-2xl sm:text-3xl font-medium leading-tight ${headingPrimaryCls} mt-6 first:mt-0`}
              style={{ fontVariationSettings: "'opsz' 60" }}
            >
              {renderInline(trimmed.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        // H2
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className={`font-display text-xl sm:text-2xl font-medium leading-snug ${heading2Cls} mt-5 first:mt-0`}
              style={{ fontVariationSettings: "'opsz' 36" }}
            >
              {renderInline(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }

        // Bullet list — a block can contain several `- ` lines
        const lines = trimmed.split('\n').map((l) => l.trim());
        if (lines.every((l) => l.startsWith('- ') || l === '')) {
          const items = lines.filter((l) => l.startsWith('- '));
          return (
            <ul
              key={idx}
              className={`space-y-2 ${rtl ? 'pr-1' : 'pl-1'}`}
            >
              {items.map((item, i) => (
                <li
                  key={i}
                  className={`flex gap-2.5 leading-relaxed ${bodyCls} ${rtl ? 'flex-row-reverse text-right' : ''}`}
                >
                  <span
                    aria-hidden
                    className={`shrink-0 mt-[0.45em] h-1.5 w-1.5 rounded-full ${bulletCls.replace('text-', 'bg-')}`}
                  />
                  <span className="flex-1 min-w-0">
                    {renderInline(item.replace(/^-\s+/, ''))}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph (keeps soft line breaks)
        return (
          <p
            key={idx}
            className={`leading-relaxed ${bodyCls}`}
          >
            {trimmed.split('\n').map((line, i, arr) => (
              <Fragment key={i}>
                {renderInline(line)}
                {i < arr.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Inline parser — handles **bold** segments only (matching mobile).
 * Returns ReactNode array.
 */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-aubergine">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
