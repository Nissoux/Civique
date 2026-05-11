interface AvatarProps {
  displayName: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

const SIZE_CLASS: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-11 w-11 text-base',
  lg: 'h-14 w-14 text-lg',
};

/**
 * Pick a deterministic background color from a small palette so that
 * initials avatars don't all look the same.
 */
function bgFromName(name: string): string {
  const palette = [
    'bg-terracotta',
    'bg-saffron',
    'bg-teal',
    'bg-sienna',
    'bg-fr-blue',
    'bg-aubergine',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Avatar({
  displayName,
  avatarUrl,
  size = 'md',
  highlight,
}: AvatarProps) {
  const initial = (displayName?.trim()[0] ?? '?').toUpperCase();
  const cls = SIZE_CLASS[size];
  const ring = highlight
    ? 'ring-2 ring-terracotta ring-offset-1 ring-offset-bone'
    : '';

  if (avatarUrl) {
    return (
      <span
        className={`${cls} ${ring} relative inline-flex shrink-0 overflow-hidden rounded-full bg-bone-deep border border-aubergine/15`}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt=""
          className="object-cover h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </span>
    );
  }

  const bg = bgFromName(displayName || 'X');
  return (
    <span
      className={`
        ${cls} ${bg} ${ring}
        inline-flex shrink-0 items-center justify-center rounded-full
        font-display font-medium text-bone
        border border-aubergine/15
      `}
      style={{ fontVariationSettings: "'opsz' 32" }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
