'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { LANGUAGES, type Language } from '@civique/shared';
import { setLangAction } from '@/lib/actions/lang';

export function LanguagePicker({ currentLang }: { currentLang: Language }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  function handlePick(code: Language) {
    if (code === currentLang) {
      setOpen(false);
      return;
    }
    start(async () => {
      await setLangAction(code);
      setOpen(false);
    });
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="
          w-full px-3 py-2 rounded-xl bg-bone-deep border border-aubergine/15
          text-left transition-colors hover:border-aubergine/30
          disabled:opacity-60
        "
      >
        <p className="font-display italic text-ink-mute mb-0.5 text-xs">
          — Langue de traduction
        </p>
        <p
          className="font-semibold text-aubergine truncate text-sm"
          lang={current.code}
          dir={current.rtl ? 'rtl' : 'ltr'}
        >
          {current.nativeName}
        </p>
      </button>

      {open ? (
        <ul
          role="listbox"
          className="
            absolute bottom-full left-0 right-0 mb-2 z-30
            bg-bone border-[1.5px] border-aubergine rounded-xl
            shadow-clay-lg overflow-hidden p-1
          "
        >
          {LANGUAGES.map((l) => {
            const active = l.code === currentLang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => handlePick(l.code)}
                  className={`
                    w-full px-3 py-2 rounded-lg text-left text-sm
                    transition-colors flex items-center justify-between
                    ${
                      active
                        ? 'bg-aubergine text-bone'
                        : 'text-aubergine hover:bg-bone-deep'
                    }
                  `}
                  lang={l.code}
                  dir={l.rtl ? 'rtl' : 'ltr'}
                  aria-selected={active}
                >
                  <span className="font-semibold">{l.nativeName}</span>
                  {active ? (
                    <svg
                      className="h-4 w-4 text-saffron"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
