'use client';

import { useEffect, useState } from 'react';

/**
 * CSS-only confetti shower triggered on exam pass.
 *
 * - Renders 50 absolute-positioned pieces that fall from -10vh to 110vh
 *   while rotating 720°.
 * - Pieces array is generated client-side in useEffect to avoid SSR/CSR
 *   hydration mismatch from Math.random().
 * - Auto-cleans after ~4s so it doesn't leak DOM nodes.
 * - Respects prefers-reduced-motion via matchMedia — renders nothing
 *   if the user opted out of motion.
 * - Keyframes are inlined via <style dangerouslySetInnerHTML> with a
 *   unique class scope, since globals.css is frozen.
 */
const PIECE_COUNT = 50;
const PALETTE = [
  '#C7522A', // terracotta
  '#E8A33D', // saffron
  '#5D7A6B', // teal
  '#002395', // fr-blue
  '#ED2939', // fr-red
  '#8B5A3C', // sienna
];

interface Piece {
  left: number;       // 0-100 %
  duration: number;   // 2-3.5 s
  delay: number;      // 0-0.8 s
  size: number;       // 6-10 px
  rotate: number;     // initial rotation deg
  color: string;
  circle: boolean;    // shape mix
}

function generatePieces(): Piece[] {
  const arr: Piece[] = [];
  for (let i = 0; i < PIECE_COUNT; i++) {
    arr.push({
      left: Math.random() * 100,
      duration: 2 + Math.random() * 1.5,
      delay: Math.random() * 0.8,
      size: 6 + Math.random() * 4,
      rotate: Math.random() * 360,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)] as string,
      circle: Math.random() > 0.5,
    });
  }
  return arr;
}

export function ConfettiBurst({ onComplete }: { onComplete?: () => void }) {
  const [pieces, setPieces] = useState<Piece[] | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Respect reduced motion preference.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(false);
      onComplete?.();
      return;
    }

    // Generate pieces client-side to avoid hydration mismatch.
    setPieces(generatePieces());

    const t = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 4000);
    return () => window.clearTimeout(t);
  }, [onComplete]);

  if (!visible || !pieces) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes civique-confetti-fall {
              0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              90%  { opacity: 1; }
              100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
            .civique-confetti-piece {
              position: absolute;
              top: 0;
              will-change: transform, opacity;
              animation-name: civique-confetti-fall;
              animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
              animation-fill-mode: forwards;
              animation-iteration-count: 1;
            }
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 60 }}
      >
        {pieces.map((p, i) => (
          <span
            key={i}
            className="civique-confetti-piece"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.circle ? '50%' : '2px',
              transform: `rotate(${p.rotate}deg)`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
