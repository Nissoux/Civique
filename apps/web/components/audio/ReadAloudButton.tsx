'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  /** CSS selector for the element whose text content to read. Walked
   * with textContent, so it picks up paragraphs and lists naturally. */
  target: string;
  /** Optional label override — defaults to "Écouter / Pause". */
  label?: string;
}

/**
 * Read-aloud control backed by the browser's Web Speech Synthesis API.
 *
 * Why Web Speech rather than a paid TTS service
 * ----------------------------------------------
 * - Zero cost. We're at MVP scale and TTS API quotas would blow the
 *   margin on a free or low-tier subscription.
 * - Zero latency. The voice plays back immediately, no network round-
 *   trip to an upstream provider.
 * - Privacy. The text never leaves the user's device.
 *
 * Trade-off: the voice quality depends on the OS (macOS / iOS sound
 * great, Android decent, Windows passable, Linux variable). We
 * mitigate by picking the best French voice available at mount time
 * (lang === 'fr-FR' preferred over generic 'fr').
 *
 * The button is a single toggle:
 *   - First click: read aloud
 *   - Click again while reading: pause
 *   - Click again while paused: resume
 * Stops when the user navigates away (cleanup in useEffect).
 *
 * Falls back gracefully: on browsers without speechSynthesis (rare —
 * older Firefox + privacy-strict configs), the button renders disabled
 * with an explanatory tooltip rather than throwing.
 */
export function ReadAloudButton({ target, label = 'Écouter' }: Props) {
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);

    // Voice list arrives asynchronously on some browsers (Chrome): subscribe
    // and pick the best French voice the first time it's populated.
    function pickFrenchVoice() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      // Prefer fr-FR over any French dialect, prefer non-novelty voices
      // (some browsers ship cartoonish "ami" voices that lead the list).
      const ranked = voices
        .filter((v) => v.lang.startsWith('fr'))
        .sort((a, b) => {
          const aFR = a.lang === 'fr-FR' ? 1 : 0;
          const bFR = b.lang === 'fr-FR' ? 1 : 0;
          if (aFR !== bFR) return bFR - aFR;
          // Local voices usually sound better than remote.
          return Number(b.localService) - Number(a.localService);
        });
      voiceRef.current = ranked[0] ?? voices[0] ?? null;
    }
    pickFrenchVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickFrenchVoice);

    // Stop reading when the component unmounts (route change).
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', pickFrenchVoice);
      window.speechSynthesis.cancel();
    };
  }, []);

  function extractText(): string {
    const root = document.querySelector(target);
    if (!root) return '';
    // textContent flattens children naturally; we strip excessive
    // whitespace so the TTS engine doesn't pause weirdly.
    return root.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  function start() {
    const text = extractText();
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => {
      setPlaying(false);
      setPaused(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setPlaying(false);
      setPaused(false);
      utteranceRef.current = null;
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
    setPaused(false);
  }

  function toggle() {
    if (!playing) {
      start();
      return;
    }
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function stop() {
    window.speechSynthesis.cancel();
    setPlaying(false);
    setPaused(false);
  }

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Lecture audio non supportée sur ce navigateur"
        className="
          inline-flex items-center gap-2 rounded-full
          bg-bone-deep border-[1.5px] border-aubergine/20
          px-4 py-2 text-sm font-medium text-ink-mute
          cursor-not-allowed opacity-60
        "
      >
        <SpeakerIcon />
        Audio indisponible
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-label={
          !playing
            ? `${label} — démarrer la lecture audio`
            : paused
              ? 'Reprendre la lecture audio'
              : 'Mettre la lecture en pause'
        }
        className="
          inline-flex items-center gap-2 rounded-full
          bg-saffron/15 border-[1.5px] border-saffron/40
          px-4 py-2 text-sm font-semibold text-aubergine
          shadow-[0_2px_0_rgb(45_27_46)]
          transition-all hover:bg-saffron hover:-translate-y-0.5
        "
      >
        {!playing ? (
          <>
            <SpeakerIcon />
            {label}
          </>
        ) : paused ? (
          <>
            <PlayIcon />
            Reprendre
          </>
        ) : (
          <>
            <PauseIcon />
            Pause
          </>
        )}
      </button>
      {playing ? (
        <button
          type="button"
          onClick={stop}
          aria-label="Arrêter la lecture audio"
          className="
            inline-flex items-center justify-center rounded-full
            h-9 w-9 bg-bone border-[1.5px] border-aubergine/20
            text-aubergine hover:bg-bone-deep transition-colors
          "
        >
          <StopIcon />
        </button>
      ) : null}
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M10 4H6v16h4V4zm8 0h-4v16h4V4z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 6h12v12H6z" />
    </svg>
  );
}
