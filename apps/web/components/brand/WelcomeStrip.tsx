// Multilingual welcome banner — declares immediately who the product is for.
// Six languages: French · Arabic · Persian · Portuguese · Spanish · Hindi.

const GREETINGS = [
  { text: 'Bienvenue', lang: 'fr' },
  { text: 'مرحباً', lang: 'ar' },
  { text: 'خوش آمدید', lang: 'fa' },
  { text: 'Bem-vindo', lang: 'pt' },
  { text: 'Bienvenidos', lang: 'es' },
  { text: 'स्वागत है', lang: 'hi' },
] as const;

export function WelcomeStrip() {
  // Duplicate the track so the marquee loop seams disappear.
  const items = [...GREETINGS, ...GREETINGS];
  return (
    <div className="bg-aubergine text-bone overflow-hidden border-b border-aubergine">
      <div
        className="flex gap-12 items-center py-2.5 whitespace-nowrap will-change-transform"
        style={{
          width: 'max-content',
          animation: 'scroll-strip 32s linear infinite',
        }}
      >
        {items.map((g, i) => (
          <span key={i} className="flex items-center gap-12">
            <span
              className="font-display italic text-[1.05rem] text-saffron"
              lang={g.lang}
              dir={g.lang === 'ar' || g.lang === 'fa' ? 'rtl' : 'ltr'}
            >
              {g.text}
            </span>
            <span className="text-bone/40" aria-hidden>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
