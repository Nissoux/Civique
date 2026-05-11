// Three exam paths — the product covers all of them.
// CSP: 4-year residence permit · CR: 10-year resident card · NAT: citizenship.

const EXAMS = [
  {
    code: 'csp',
    label: 'Carte de séjour',
    sub: 'pluriannuelle',
    icon: '🪪',
  },
  {
    code: 'cr',
    label: 'Carte de résident',
    sub: '10 ans',
    icon: '🏠',
  },
  {
    code: 'nat',
    label: 'Nationalité',
    sub: 'française',
    icon: '🇫🇷',
  },
] as const;

export function ExamTypeBadges() {
  return (
    <div className="flex flex-wrap items-center gap-3" aria-label="Examens couverts">
      {EXAMS.map((e) => (
        <div
          key={e.code}
          className="
            inline-flex items-center gap-2.5 rounded-full
            bg-bone border-[1.5px] border-aubergine px-4 py-2
            transition-all hover:-translate-y-0.5 hover:bg-bone-warm
            shadow-[0_2px_0_rgb(45_27_46)]
            cursor-default
          "
        >
          <span className="text-lg leading-none" aria-hidden>{e.icon}</span>
          <span className="text-left">
            <span className="block text-sm font-semibold text-aubergine leading-tight">
              {e.label}
            </span>
            <span className="block text-[0.7rem] text-ink-mute leading-tight">
              {e.sub}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
