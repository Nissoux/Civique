'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import type { Language } from '@civique/shared';
import { Logo } from '@/components/brand/Logo';
import { LanguagePicker } from '@/components/nav/LanguagePicker';
import { logoutAction } from '@/app/app/actions';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface NavSection {
  eyebrow: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    eyebrow: '— Préparation',
    items: [
      { href: '/app', label: 'Accueil', icon: <HomeIcon /> },
      { href: '/app/exams', label: 'Examens blancs', icon: <DocIcon /> },
      { href: '/app/fiches', label: 'Fiches mémo', icon: <BookIcon /> },
      { href: '/app/flashcards', label: 'Révisions', icon: <CardsIcon /> },
      { href: '/app/glossaire', label: 'Glossaire', icon: <ListIcon /> },
    ],
  },
  {
    eyebrow: '— Votre parcours',
    items: [
      { href: '/app/stats', label: 'Progression', icon: <ChartIcon /> },
      { href: '/app/social', label: 'Social', icon: <UsersIcon /> },
      { href: '/app/profile', label: 'Compte', icon: <UserIcon /> },
      { href: '/app/settings', label: 'Réglages', icon: <CogIcon /> },
    ],
  },
];

interface SidebarProps {
  user: { displayName: string; email: string };
  examLabel?: string;
  currentLang: Language;
}

export function Sidebar({ user, examLabel, currentLang }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden lg:flex flex-col w-64 shrink-0
        border-r border-aubergine/15 bg-bone
        sticky top-0 h-screen
      "
    >
      <div className="px-6 py-5 border-b border-aubergine/10 shrink-0">
        <Logo size="md" />
      </div>

      <nav aria-label="Navigation principale" className="flex-1 px-3 py-4 overflow-y-auto">
        {SECTIONS.map((section, sIdx) => (
          <div key={section.eyebrow} className={sIdx > 0 ? 'mt-5' : undefined}>
            <p className="eyebrow px-3 mb-2 text-[0.65rem]">{section.eyebrow}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === '/app'
                    ? pathname === '/app'
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`
                        flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium
                        transition-all
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-1 focus-visible:ring-offset-bone
                        ${
                          isActive
                            ? 'bg-aubergine text-bone shadow-[0_2px_0_rgb(74_45_67)]'
                            : 'text-aubergine hover:bg-bone-deep'
                        }
                      `}
                    >
                      <span
                        className={isActive ? 'text-saffron' : 'text-aubergine/60'}
                        aria-hidden
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-aubergine/10 space-y-2 shrink-0">
        <LanguagePicker currentLang={currentLang} />
        {examLabel ? (
          <Link
            // `?change=1` lets the exam-type page know we're switching
            // post-onboarding so it doesn't bounce us back to /app.
            href="/onboarding/exam-type?change=1"
            aria-label={`Examen ciblé : ${examLabel}. Cliquez pour changer.`}
            className="block px-3 py-1.5 rounded-xl bg-bone-deep border border-aubergine/15 text-xs hover:border-aubergine/30 transition-colors"
          >
            <p className="font-display italic text-ink-mute text-[0.7rem]">— Examen ciblé</p>
            <p className="font-semibold text-aubergine truncate text-sm">{examLabel}</p>
          </Link>
        ) : null}
        <div className="px-3 py-1.5">
          <p className="text-[0.7rem] text-ink-mute font-display italic">— Connecté</p>
          <p className="text-sm font-semibold text-aubergine truncate leading-tight">
            {user.displayName}
          </p>
          <p className="text-[0.7rem] text-ink-mute truncate">{user.email}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-ink-mute hover:text-aubergine hover:bg-bone-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-1 focus-visible:ring-offset-bone"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}

// ── Icons ────────────────────────────────────

function iconCls() {
  return 'h-5 w-5';
}
function HomeIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
function CardsIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
function CogIcon() {
  return (
    <svg className={iconCls()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
