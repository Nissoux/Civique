import Link from 'next/link';

// Note: this page is rendered at build time as part of the static /404 export.
// We deliberately avoid components that rely on React Context at module
// scope (e.g. next/image via our Logo) — Next.js 15 + React 19 + the pnpm
// workspace had a `useContext` null crash during prerender. A plain <a>
// link and inline SVG sidestep it without any UX loss on the error page.
export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-bone flex items-center justify-center px-6 focus:outline-none"
    >
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 text-aubergine">
            <span
              aria-hidden
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-aubergine text-bone font-display font-bold"
            >
              C
            </span>
            <span className="font-display text-2xl tracking-tight">Civique</span>
          </Link>
        </div>
        <p className="eyebrow mb-4">— Erreur 404</p>
        <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[1.05] mb-6 font-medium tracking-tight">
          Page<br />
          <span className="display-italic text-terracotta">introuvable</span>.
        </h1>
        <p className="text-ink-mute leading-relaxed mb-8">
          Ce que vous cherchez a été déplacé, supprimé, ou n'a jamais existé.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
