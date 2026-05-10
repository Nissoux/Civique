import { GLOSSARY } from '@/lib/data/glossaire';
import { GlossaireList } from '@/components/glossaire/GlossaireList';

export const metadata = {
  title: 'Glossaire civique — Civique',
  description:
    "Tous les termes essentiels de l'éducation civique : République, laïcité, institutions, droits, vie sociale.",
};

export default function GlossairePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="
          relative bg-aubergine text-bone overflow-hidden
          border-b-[1.5px] border-aubergine
        "
      >
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-saffron/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-terracotta/20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-10 sm:py-14">
          <p className="font-display italic text-saffron text-base mb-2">
            — Glossaire
          </p>
          <h1
            className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            Le vocabulaire <span className="display-italic text-terracotta">civique</span>,
            <br />
            à portée de main.
          </h1>
          <p className="mt-4 text-bone/75 max-w-xl leading-relaxed">
            {GLOSSARY.length} termes essentiels classés par ordre alphabétique.
            Tapez quelques lettres pour filtrer instantanément.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
        <GlossaireList terms={GLOSSARY} />
      </section>
    </div>
  );
}
