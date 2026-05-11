import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withWordmark?: boolean;
  href?: string | null;
  className?: string;
}

const SIZES = {
  sm: { mark: 28, text: 'text-xl' },
  md: { mark: 36, text: 'text-[1.65rem]' },
  lg: { mark: 56, text: 'text-[2.2rem]' },
} as const;

export function Logo({
  size = 'md',
  withWordmark = true,
  href = '/',
  className = '',
}: LogoProps) {
  const s = SIZES[size];
  // When the wordmark is shown, mark the image as decorative so screen
  // readers don't read "Civique" twice. Otherwise, the image provides the
  // accessible name.
  const inner = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/logo-c.png"
        alt={withWordmark ? '' : 'Civique'}
        width={s.mark}
        height={s.mark}
        priority
        className="rounded-[8px] shrink-0"
        aria-hidden={withWordmark || undefined}
      />
      {withWordmark ? (
        <span
          className={`font-display font-medium tracking-tight text-aubergine ${s.text}`}
          style={{ fontVariationSettings: "'opsz' 36" }}
        >
          Civique
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
        aria-label={withWordmark ? undefined : 'Civique — accueil'}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
