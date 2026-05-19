import Link from 'next/link';
import type { Metadata } from 'next';
import { THEMES, LANGUAGES } from '@civique/shared';
import { getCurrentUser } from '@/lib/server/me';
import { Logo } from '@/components/brand/Logo';
import { WelcomeStrip } from '@/components/brand/WelcomeStrip';
import { WovenThreads } from '@/components/brand/WovenThreads';
import { ExamTypeBadges } from '@/components/brand/ExamTypeBadges';

export const metadata: Metadata = {
  title: 'Civique — Préparez votre examen civique français',
  description:
    "Préparation à l'examen civique français 2026 conforme à l'arrêté du 10 octobre 2025. Pour la carte de séjour pluriannuelle, la carte de résident ou la nationalité : 611 questions QCM officielles, 240 questions d'entretien d'assimilation, 8 langues d'accompagnement.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Civique — Préparez votre examen civique français',
    description:
      "Préparation à l'examen civique 2026 (arrêté du 10 octobre 2025) pour CSP, CR et nationalité française. 851 questions au total, 8 langues.",
    url: '/',
    type: 'website',
    locale: 'fr_FR',
  },
};

const THEME_DESCRIPTIONS: Record<number, string> = {
  1: 'Devise nationale, laïcité, symboles républicains, droits fondamentaux.',
  2: 'Pouvoirs, élections, collectivités locales, intégration européenne.',
  3: 'Le vote, la justice, le service civique, la solidarité.',
  4: 'Grandes dates, régions, patrimoine, arts, traditions.',
  5: 'Travail, santé, école, démarches, vie associative.',
};

const THEME_META: Record<number, { questions: number; fiches: number }> = {
  1: { questions: 96, fiches: 28 },
  2: { questions: 132, fiches: 34 },
  3: { questions: 108, fiches: 26 },
  4: { questions: 168, fiches: 42 },
  5: { questions: 107, fiches: 29 },
};

// schema.org JSON-LD describing the program. Helps search engines surface
// Civique as an educational resource for the French civic exam.
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOccupationalProgram',
  name: 'Civique',
  alternateName: 'Préparation à l\'examen civique français',
  description:
    "Préparation indépendante à l'examen civique français 2026, conforme à l'arrêté du 10 octobre 2025. CSP, CR et naturalisation : 611 questions QCM, 240 questions d'entretien d'assimilation, 8 langues d'accompagnement.",
  url: 'https://civique.integrafle.fr',
  inLanguage: ['fr', 'ar', 'fa', 'pt', 'es', 'hi', 'en', 'tr'],
  educationalLevel: 'Adult education',
  educationalProgramMode: 'online',
  programType: 'Civic education',
  provider: {
    '@type': 'Organization',
    name: 'Civique',
    url: 'https://civique.integrafle.fr',
    email: 'support@integrafle.fr',
  },
  occupationalCategory: 'Civic integration',
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'Candidate to French civic exam',
  },
  teaches: [
    'Devise nationale, laïcité, symboles républicains, droits fondamentaux',
    'Pouvoirs, élections, collectivités locales, intégration européenne',
    'Le vote, la justice, le service civique, la solidarité',
    'Grandes dates, régions, patrimoine, arts, traditions',
    'Travail, santé, école, démarches, vie associative',
  ],
};

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-bone">
      <script
        type="application/ld+json"
        // Schema.org JSON-LD — safe, server-rendered, no XSS risk
        // (only static, server-controlled values).
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <WelcomeStrip />

      {/* Header */}
      <header className="border-b border-aubergine/15">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Logo />
          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-7 lg:gap-9 text-[0.95rem] font-medium">
            <a href="#programme" className="hover:text-terracotta transition-colors">Le programme</a>
            <a href="#methode" className="hover:text-terracotta transition-colors">Méthode</a>
            <Link href="/pourquoi-civique" className="hover:text-terracotta transition-colors">Pourquoi Civique</Link>
            <Link href="/partenariats" className="hover:text-terracotta transition-colors hidden lg:inline">Partenariats</Link>
            {user ? (
              <Link href="/app" className="btn-primary !px-5 !py-2 text-sm">
                Mon tableau de bord →
              </Link>
            ) : (
              <Link href="/login" className="hover:text-terracotta transition-colors">Se connecter</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <section className="relative">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-10 sm:py-14 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 relative z-10">
            <p className="rise-init rise-d-1 eyebrow mb-3">— Préparation à l'examen civique français</p>
            {/* Compliance badge — surfaces the legal hook the competitive
                audit (2026-05-15) showed competitors using to anchor
                credibility. Cited inline so it's also SEO-indexed. */}
            <p className="rise-init rise-d-1 mb-7 inline-flex items-center gap-2 text-xs font-medium text-aubergine bg-saffron/15 border-[1.5px] border-saffron/40 rounded-full px-3 py-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Conforme à l'arrêté du 10 octobre 2025
            </p>

            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.96] mb-8 font-medium tracking-tight">
              <span className="rise-init rise-d-2 inline-block">Réussir votre</span><br />
              <span className="rise-init rise-d-3 inline-block">examen civique,</span><br />
              <span className="rise-init rise-d-4 inline-block underline-wavy">à votre rythme</span>
              <span className="rise-init rise-d-4 inline-block">.</span>
            </h1>

            <p className="rise-init rise-d-4 max-w-[34rem] text-[1.15rem] leading-[1.65] text-ink-mute mb-9">
              La préparation indépendante pour la <em className="display-italic text-aubergine">carte de séjour pluriannuelle</em>, la <em className="display-italic text-aubergine">carte de résident</em> et la <em className="display-italic text-aubergine">nationalité française</em>. 5 thèmes, 611 questions QCM, 240 questions d'entretien d'assimilation, 8 langues d'accompagnement.
            </p>

            <div className="rise-init rise-d-5 mb-9">
              <ExamTypeBadges />
            </div>

            <div className="rise-init rise-d-5 flex flex-wrap items-center gap-4 mb-10">
              {user ? (
                <Link href="/app" className="btn-primary text-base">
                  Aller au tableau de bord
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary text-base">
                    Commencer ma préparation
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link href="#programme" className="btn-secondary text-base">
                    Voir le programme
                  </Link>
                </>
              )}
            </div>

            {/* Language pills */}
            <div className="rise-init rise-d-6 flex flex-wrap gap-2 items-center">
              <span className="text-ink-mute text-sm font-medium mr-2">disponible en</span>
              {LANGUAGES.map((l) => (
                <span
                  key={l.code}
                  className="pill-lg font-display"
                  lang={l.code}
                  dir={l.rtl ? 'rtl' : 'ltr'}
                >
                  {l.nativeName}
                </span>
              ))}
            </div>
          </div>

          {/* Right side: woven threads + floating testimonial.
              overflow-hidden on the outer column kills the horizontal scroll
              the rotated sticker caused on 360px viewports — the rotate(8deg)
              transform combined with right:2 was pushing the sticker past
              the viewport's right edge. */}
          <div className="lg:col-span-5 flex items-center justify-center overflow-hidden lg:overflow-visible">
            <div className="relative inline-block max-h-[420px] lg:max-h-[480px]">
              <WovenThreads />

              {/* Floating testimonial sticker — anchored to the SVG, not the flex parent */}
              <div
                className="
                  absolute top-6 right-4 sm:right-6
                  px-4 py-3 rounded-3xl border-[1.5px] border-aubergine bg-saffron
                  max-w-[180px] sm:max-w-[200px]
                  shadow-[0_4px_0_rgb(45_27_46)]
                "
                style={{
                  transform: 'rotate(8deg)',
                  animation: 'float 5s ease-in-out infinite',
                  animationDelay: '1s',
                }}
              >
                <p className="font-display italic text-[0.95rem] leading-snug text-aubergine">
                  « J'ai eu mon entretien la semaine dernière. »
                </p>
                <p className="text-[0.72rem] mt-2 font-semibold text-aubergine-mid">
                  — Amina, Marseille
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 themes */}
      <section id="programme" className="border-t border-aubergine/15 bg-bone-deep relative">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-20 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow mb-4">— Le programme officiel</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] mb-5 font-medium tracking-tight">
              Cinq thèmes,<br />
              <span className="display-italic text-terracotta">cinq fils</span> à tisser ensemble.
            </h2>
            <p className="text-ink-mute text-[1.05rem] leading-[1.6]">
              Le programme couvre l'intégralité du livret du citoyen. Chaque thème est traité comme un parcours indépendant, à votre rythme.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {THEMES.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
            {/* 6th tease card — fiches pédagogiques */}
            <div className="theme-card flex items-center justify-center text-center bg-aubergine border-aubergine">
              <div>
                <p className="display-italic text-[1.5rem] mb-2 text-saffron">+ 200 fiches</p>
                <p className="text-sm leading-[1.55] text-bone/85 mb-4">
                  pédagogiques traduites dans les 8 langues d'accompagnement
                </p>
                <p className="text-saffron font-semibold text-sm">à découvrir →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Civique */}
      <section id="methode" className="border-t border-aubergine/15">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-20 sm:py-24 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">— Notre méthode</p>
            <h2 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] font-medium tracking-tight mb-6">
              Pas une école.<br />
              <span className="display-italic text-terracotta">Un compagnon de route.</span>
            </h2>
            <p className="text-ink-mute text-[1.05rem] leading-[1.7] mb-7">
              On sait que ce n'est pas qu'un examen. C'est un moment qui compte, souvent stressant. Civique vous accompagne avec des explications claires, des révisions courtes, et tout reste accessible quand vous en avez besoin.
            </p>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            <FeatureCard
              icon="🎯"
              title="Adapté à votre titre"
              text="Les questions et mises en situation s'ajustent à l'examen que vous préparez (CSP, CR ou nationalité)."
            />
            <FeatureCard
              icon="🌐"
              title="Six langues"
              text="Toutes les explications et fiches sont disponibles en français, arabe, persan, portugais, espagnol et hindi."
            />
            <FeatureCard
              icon="📊"
              title="Suivi de progression"
              text="Statistiques par thème, niveau de maîtrise, et révisions recommandées selon vos lacunes."
            />
            <FeatureCard
              icon="💝"
              title="Démarrer gratuitement"
              text="Aucune carte bancaire requise pour commencer. Vous décidez quand passer au plein accès."
            />
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      {user ? null : (
        <section className="border-t border-aubergine/15 bg-aubergine text-bone relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-terracotta/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-saffron/20 blur-3xl" />

          <div className="relative max-w-3xl mx-auto px-6 sm:px-10 py-20 sm:py-24 text-center">
            <p className="eyebrow text-saffron mb-4">— Prêt à commencer ?</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] mb-6 font-medium tracking-tight">
              Créez votre compte<br />
              <span className="display-italic text-saffron">en moins d'une minute</span>.
            </h2>
            <p className="text-bone/80 text-[1.1rem] leading-relaxed mb-10 max-w-xl mx-auto">
              Aucune carte bancaire, aucun engagement. Vous accédez immédiatement aux fiches et aux exercices.
            </p>
            <Link href="/register" className="btn-primary text-base">
              Créer mon compte gratuit
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      )}
      </main>

      {/* Footer */}
      <footer className="bg-aubergine text-bone border-t border-aubergine">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-14 grid grid-cols-2 md:grid-cols-12 gap-8">
          <div className="col-span-2 md:col-span-5">
            <Logo size="md" href={null} className="[&_span:last-child]:!text-bone" />
            <p className="display-italic text-[1.05rem] mt-4 text-saffron">
              Tisser un nouveau chez-soi.
            </p>
            <p className="text-bone/60 text-sm mt-3 max-w-xs leading-relaxed">
              Préparation indépendante à l'examen civique français. Sans affiliation officielle avec l'État.
            </p>
          </div>
          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <p className="font-semibold mb-3 text-bone">Produit</p>
            <ul className="space-y-2 text-sm text-bone/70">
              <li><a href="#programme" className="hover:text-saffron">Le programme</a></li>
              <li><a href="#methode" className="hover:text-saffron">Méthode</a></li>
              <li><Link href="/pourquoi-civique" className="hover:text-saffron">Pourquoi Civique</Link></li>
              <li>
                {user ? (
                  <Link href="/app" className="hover:text-saffron">Mon tableau de bord</Link>
                ) : (
                  <Link href="/login" className="hover:text-saffron">Connexion</Link>
                )}
              </li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-3">
            {/* Reference content — back-links the public documentation
                pages we ship to crawlers and to anyone vetting our
                compliance story. Big SEO + credibility win. */}
            <p className="font-semibold mb-3 text-bone">Référence</p>
            <ul className="space-y-2 text-sm text-bone/70">
              <li><Link href="/methodologie" className="hover:text-saffron">Méthodologie & cadre légal</Link></li>
              <li><Link href="/livret-du-citoyen" className="hover:text-saffron">Livret du Citoyen</Link></li>
              <li><Link href="/charte" className="hover:text-saffron">Charte des droits et devoirs</Link></li>
              <li><Link href="/partenariats" className="hover:text-saffron">Partenariats associations</Link></li>
              <li><a href="mailto:contact@integrafle.fr" className="hover:text-saffron">Contact</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2">
            <p className="font-semibold mb-3 text-bone">Légal</p>
            <ul className="space-y-2 text-sm text-bone/70">
              <li><Link href="/privacy" className="hover:text-saffron">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-saffron">Conditions</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-saffron">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-bone/10">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-bone/50">
            <span>© {new Date().getFullYear()} Civique · Tous droits réservés</span>
            <span className="display-italic">— Préparation indépendante</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ThemeCard({ theme }: { theme: (typeof THEMES)[number] }) {
  const meta = THEME_META[theme.id];
  return (
    <div className="theme-card">
      <div className="flex justify-between items-start mb-4">
        <div
          className="
            flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
            font-display text-2xl font-medium text-bone
            shadow-[0_2px_0_rgb(45_27_46)]
          "
          style={{ backgroundColor: theme.color }}
          aria-hidden
        >
          {theme.id}
        </div>
        <span
          className="font-display italic text-[3.5rem] leading-none"
          style={{ color: theme.color, fontVariationSettings: "'opsz' 72" }}
        >
          {romanize(theme.id)}
        </span>
      </div>
      <h3 className="font-display text-[1.4rem] leading-tight mb-3 font-medium" style={{ fontVariationSettings: "'opsz' 36" }}>
        {theme.nameFr}
      </h3>
      <p className="text-ink-mute text-sm leading-[1.55] mb-5">
        {THEME_DESCRIPTIONS[theme.id]}
      </p>
      <div className="flex items-center gap-2">
        <span className="pill">{meta.questions} questions</span>
        <span className="pill">{meta.fiches} fiches</span>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-6">
      <div className="text-3xl mb-3" aria-hidden>{icon}</div>
      <h3 className="font-display text-xl font-medium mb-2" style={{ fontVariationSettings: "'opsz' 32" }}>
        {title}
      </h3>
      <p className="text-ink-mute text-[0.95rem] leading-[1.6]">{text}</p>
    </div>
  );
}

function romanize(n: number): string {
  return ['I', 'II', 'III', 'IV', 'V'][n - 1] ?? String(n);
}
