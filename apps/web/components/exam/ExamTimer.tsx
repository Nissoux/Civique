'use client';

import { useEffect, useRef, useState } from 'react';

interface ExamTimerProps {
  /** Wall-clock ms when the exam started. */
  startedAtMs: number;
  /** Total exam duration in seconds. */
  durationSec: number;
  /** Fired exactly once when the timer hits zero. */
  onTimeUp: () => void;
}

/**
 * Countdown timer for an exam session. Computes remaining time from
 * (startedAtMs + durationSec*1000 - Date.now()) so that page reloads,
 * tab switches, or background pauses can't be exploited to stop the clock.
 *
 * Visual: monospaced mm:ss. Last 5 minutes turns saffron, last 60 seconds
 * pulses fr-red.
 */
export function ExamTimer({
  startedAtMs,
  durationSec,
  onTimeUp,
}: ExamTimerProps) {
  const computeRemaining = () => {
    const elapsed = Math.floor((Date.now() - startedAtMs) / 1000);
    return Math.max(0, durationSec - elapsed);
  };

  const [remaining, setRemaining] = useState<number>(computeRemaining);
  const firedRef = useRef(false);

  useEffect(() => {
    // Always sync once on mount in case startedAtMs/durationSec changed.
    setRemaining(computeRemaining());

    const interval = setInterval(() => {
      const r = computeRemaining();
      setRemaining(r);
      if (r <= 0 && !firedRef.current) {
        firedRef.current = true;
        clearInterval(interval);
        onTimeUp();
      }
    }, 500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAtMs, durationSec]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const isCritical = remaining <= 60;
  const isLow = remaining <= 5 * 60 && !isCritical;

  let toneClass = 'text-aubergine';
  if (isCritical) toneClass = 'text-fr-red animate-pulse';
  else if (isLow) toneClass = 'text-saffron';

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-2xl border-[1.5px] border-aubergine
        bg-bone-deep px-4 py-2 font-display tabular-nums tracking-tight
        shadow-[0_2px_0_rgb(45_27_46)] ${toneClass}
      `}
      role="timer"
      aria-live="polite"
      aria-label={`Temps restant : ${minutes} minutes ${seconds} secondes`}
    >
      <svg
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-lg sm:text-xl font-medium">{formatted}</span>
    </div>
  );
}
