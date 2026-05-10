import Link from 'next/link';
import { type ReactNode } from 'react';
import { Logo } from '@/components/brand/Logo';
import { WelcomeStrip } from '@/components/brand/WelcomeStrip';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bone">
      <WelcomeStrip />

      <div className="flex-1 grid lg:grid-cols-2 min-h-[calc(100vh-44px)]">
        {/* Brand panel — left on desktop, top on mobile */}
        <aside className="relative bg-aubergine text-bone overflow-hidden">
          {/* decorative woven texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgb(244 236 221) 0 2px, transparent 2px 12px), repeating-linear-gradient(-45deg, rgb(244 236 221) 0 1px, transparent 1px 12px)',
            }}
          />
          {/* decorative glow */}
          <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-terracotta/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-saffron/20 blur-3xl" />

          <div className="relative h-full flex flex-col p-10 lg:p-14">
            <Logo size="lg" />

            <div className="flex-1 flex flex-col justify-center py-10">
              <p className="font-display italic text-saffron text-lg mb-4">
                — Préparation à l'examen civique
              </p>
              <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] leading-[1.05] mb-6 font-medium">
                Tisser un<br />
                <span className="display-italic text-terracotta">nouveau chez-soi</span>,<br />
                fil après fil.
              </h2>
              <p className="text-bone/80 text-base leading-relaxed max-w-md mb-8">
                Une préparation rigoureuse pour la carte de séjour, la carte de
                résident et la nationalité française. À votre rythme, dans
                votre langue.
              </p>

              <ul className="space-y-2.5 text-sm text-bone/85">
                <li className="flex items-baseline gap-3">
                  <span className="text-saffron font-bold">·</span>
                  <span>5 thèmes officiels · 611 questions</span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="text-saffron font-bold">·</span>
                  <span>6 langues d'accompagnement</span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="text-saffron font-bold">·</span>
                  <span>Aucune carte bancaire requise</span>
                </li>
              </ul>
            </div>

            <div className="text-xs text-bone/50">
              © {new Date().getFullYear()} Civique · Préparation indépendante
            </div>
          </div>
        </aside>

        {/* Form panel — right on desktop, bottom on mobile */}
        <main className="relative flex flex-col p-8 sm:p-12 lg:p-16">
          <Link
            href="/"
            className="
              inline-flex items-center gap-2 text-aubergine hover:text-terracotta
              text-sm font-medium transition-colors mb-8 self-start
            "
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-md w-full">
            <p className="eyebrow mb-3 rise-init rise-d-1">— Civique</p>
            <h1 className="rise-init rise-d-2 font-display text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.05] mb-4 font-medium tracking-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="rise-init rise-d-3 text-ink-mute leading-relaxed mb-9">
                {subtitle}
              </p>
            ) : null}

            <div className="rise-init rise-d-4">{children}</div>

            {footer ? (
              <div className="mt-10 text-sm text-ink-mute">{footer}</div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
