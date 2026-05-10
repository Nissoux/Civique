'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/app', label: 'Accueil', icon: '🏠' },
  { href: '/app/exams', label: 'Examens', icon: '📄' },
  { href: '/app/fiches', label: 'Fiches', icon: '📖' },
  { href: '/app/flashcards', label: 'Mémo', icon: '🃏' },
  { href: '/app/profile', label: 'Compte', icon: '👤' },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="
        lg:hidden fixed bottom-0 inset-x-0 z-40
        bg-bone border-t-[1.5px] border-aubergine
        shadow-[0_-3px_0_rgb(45_27_46)]
      "
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const isActive =
            item.href === '/app'
              ? pathname === '/app'
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex flex-col items-center justify-center py-2.5 text-[0.65rem] font-semibold
                  transition-colors
                  ${isActive ? 'text-terracotta' : 'text-ink-mute hover:text-aubergine'}
                `}
              >
                <span className="text-lg mb-0.5" aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
