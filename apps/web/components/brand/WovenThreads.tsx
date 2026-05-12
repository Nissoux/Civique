// 5 colored threads weaving toward a central "vous" knot.
// Each thread = one of the 5 official civic themes. Colors match mobile app.
// The knot is the user — the weaving represents integrating the 5 themes
// into the candidate's preparation.

const THREAD_COLORS = {
  republic: '#002395', // theme 1 — Principes & valeurs (DSFR navy)
  institutions: '#ED2939', // theme 2 — Système institutionnel (DSFR red)
  rights: '#D4A017', // theme 3 — Droits & devoirs (gold)
  history: '#4A90D9', // theme 4 — Histoire / géographie (light blue)
  society: '#2ECC71', // theme 5 — Vivre en France (green)
} as const;

export function WovenThreads({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 540"
      className={`w-full max-w-[500px] h-auto ${className}`}
      fill="none"
      strokeWidth="6"
      strokeLinecap="round"
      role="img"
      aria-label="Cinq fils représentant les cinq thèmes officiels qui s'entrelacent vers vous"
    >
      {/* Thread 1 — Principes (top-left, navy) */}
      <path
        d="M 30,80 Q 130,140 200,200 Q 260,260 200,340 Q 140,420 220,490"
        stroke={THREAD_COLORS.republic}
        className="weave-thread"
        pathLength={1}
        style={{ animationDelay: '0.4s' }}
      />
      {/* Thread 2 — Institutions (top, red) */}
      <path
        d="M 240,40 Q 280,140 220,210 Q 160,280 240,360 Q 320,440 260,510"
        stroke={THREAD_COLORS.institutions}
        className="weave-thread"
        pathLength={1}
        style={{ animationDelay: '0.7s' }}
      />
      {/* Thread 3 — Droits (top-right, gold) */}
      <path
        d="M 450,100 Q 360,180 290,210 Q 220,240 270,320 Q 320,400 240,470"
        stroke={THREAD_COLORS.rights}
        className="weave-thread"
        pathLength={1}
        style={{ animationDelay: '1.0s' }}
      />
      {/* Thread 4 — Histoire (right, light blue) */}
      <path
        d="M 460,300 Q 370,290 290,250 Q 210,210 240,310 Q 270,410 350,460"
        stroke={THREAD_COLORS.history}
        className="weave-thread"
        pathLength={1}
        style={{ animationDelay: '1.3s' }}
      />
      {/* Thread 5 — Société (bottom, green) */}
      <path
        d="M 60,440 Q 160,400 220,330 Q 280,260 220,180 Q 160,100 220,30"
        stroke={THREAD_COLORS.society}
        className="weave-thread"
        pathLength={1}
        style={{ animationDelay: '1.6s' }}
      />

      {/* Central "vous" knot — floating */}
      <circle
        cx="240"
        cy="270"
        r="44"
        fill="rgb(244, 236, 221)"
        stroke="rgb(45, 27, 46)"
        strokeWidth="2"
        style={{ animation: 'float 4s ease-in-out infinite' }}
      />
      <text
        x="240"
        y="278"
        textAnchor="middle"
        fontFamily="var(--font-newsreader), Georgia, serif"
        fontStyle="italic"
        fontSize="22"
        fontWeight="500"
        fill="rgb(45, 27, 46)"
        stroke="none"
        style={{ animation: 'float 4s ease-in-out infinite' }}
      >
        vous
      </text>

      {/* Origin dots */}
      <g fill="rgb(45, 27, 46)">
        <circle cx="30" cy="80" r="5" />
        <circle cx="240" cy="40" r="5" />
        <circle cx="450" cy="100" r="5" />
        <circle cx="460" cy="300" r="5" />
        <circle cx="60" cy="440" r="5" />
      </g>
      {/* End dots — colored to match each thread */}
      <circle cx="220" cy="490" r="6" fill={THREAD_COLORS.republic} />
      <circle cx="260" cy="510" r="6" fill={THREAD_COLORS.institutions} />
      <circle cx="240" cy="470" r="6" fill={THREAD_COLORS.rights} />
      <circle cx="350" cy="460" r="6" fill={THREAD_COLORS.history} />
      <circle cx="220" cy="30" r="6" fill={THREAD_COLORS.society} />
    </svg>
  );
}
