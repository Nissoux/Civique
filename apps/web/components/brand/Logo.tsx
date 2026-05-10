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
  const inner = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/logo-c.png"
        alt="Civique"
        width={s.mark}
        height={s.mark}
        priority
        className="rounded-[8px] shrink-0"
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
      <Link href={href} className="inline-flex items-center">
        {inner}
      </Link>
    );
  }
  return inner;
}
