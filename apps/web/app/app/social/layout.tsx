import { SocialTabs } from '@/components/social/SocialTabs';

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-aubergine text-bone overflow-hidden border-b-[1.5px] border-aubergine">
        <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-terracotta/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-saffron/20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-10 sm:py-12">
          <p className="font-display italic text-saffron text-base mb-1">
            — Communauté
          </p>
          <h1
            className="font-display text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.05] font-medium tracking-tight"
            style={{ fontVariationSettings: "'opsz' 96" }}
          >
            Apprenez{' '}
            <span className="display-italic text-terracotta">ensemble</span>.
          </h1>
          <p className="text-sm sm:text-base text-bone/70 mt-2 max-w-xl">
            Suivez vos amis, lancez des défis amicaux et grimpez dans le
            classement.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 space-y-8">
        <SocialTabs />
        {children}
      </div>
    </div>
  );
}
