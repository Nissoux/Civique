'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/app/social/friends', label: 'Amis' },
  { href: '/app/social/challenges', label: 'Défis' },
  { href: '/app/social/leaderboard', label: 'Classement' },
] as const;

export function SocialTabs() {
  const pathname = usePathname() ?? '';
  return (
    <nav
      aria-label="Sections sociales"
      className="
        flex gap-1 sm:gap-2 p-1 rounded-2xl
        bg-bone-deep border border-aubergine/15
      "
    >
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`
              flex-1 text-center px-3 sm:px-5 py-2 rounded-xl text-sm font-semibold
              transition-all
              ${
                isActive
                  ? 'bg-aubergine text-bone shadow-[0_2px_0_rgb(74_45_67)]'
                  : 'text-aubergine hover:bg-bone'
              }
            `}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
