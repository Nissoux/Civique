'use client';

import { useState, useTransition } from 'react';
import { EXAM_TYPES, type ExamTypeCode } from '@/lib/examType.types';
import { selectExamTypeAction } from '@/lib/actions/examType';

export function ExamTypeForm() {
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<ExamTypeCode | null>(null);

  function handleSelect(code: ExamTypeCode) {
    setSelected(code);
    startTransition(async () => {
      await selectExamTypeAction(code);
    });
  }

  return (
    <div className="grid gap-4 max-w-2xl mx-auto">
      {EXAM_TYPES.map((exam) => {
        const isSelected = selected === exam.code;
        return (
          <button
            key={exam.code}
            type="button"
            disabled={pending}
            onClick={() => handleSelect(exam.code)}
            className={`
              text-left rounded-2xl border-[1.5px] p-6
              transition-all cursor-pointer
              flex items-start gap-5
              ${
                isSelected
                  ? 'border-terracotta bg-bone shadow-warm-lift translate-y-[-2px]'
                  : 'border-aubergine bg-bone-deep hover:bg-bone hover:-translate-y-0.5 shadow-clay'
              }
              disabled:opacity-60 disabled:cursor-wait
            `}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div
              className="
                flex h-14 w-14 shrink-0 items-center justify-center
                rounded-2xl text-2xl
                shadow-[0_2px_0_rgb(45_27_46)]
              "
              style={{ backgroundColor: exam.color, color: '#fff' }}
              aria-hidden
            >
              {exam.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h3
                  className="font-display text-xl font-medium tracking-tight"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  {exam.label}
                </h3>
                <span className="pill !text-[0.65rem]">{exam.code.toUpperCase()}</span>
              </div>
              <p className="text-sm text-ink-mute leading-relaxed">{exam.description}</p>
              {isSelected && pending ? (
                <p className="mt-3 text-xs font-display italic text-terracotta">
                  Préparation de votre parcours…
                </p>
              ) : null}
            </div>
            <svg
              className={`
                h-6 w-6 shrink-0 mt-1 transition-all
                ${isSelected ? 'text-terracotta translate-x-1' : 'text-aubergine/40'}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        );
      })}
      <p className="text-center text-sm text-ink-mute font-display italic mt-4">
        Vous pourrez changer ce choix à tout moment depuis votre profil.
      </p>
    </div>
  );
}
