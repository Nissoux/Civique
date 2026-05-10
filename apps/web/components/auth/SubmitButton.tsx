'use client';

import { useFormStatus } from 'react-dom';
import { type ReactNode } from 'react';

interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel?: string;
  variant?: 'primary' | 'brand';
  full?: boolean;
}

export function SubmitButton({
  children,
  pendingLabel,
  variant = 'primary',
  full = true,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const cls = variant === 'brand' ? 'btn-brand' : 'btn-primary';
  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        ${cls}
        ${full ? 'w-full' : ''}
        disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-warm
      `}
    >
      {pending ? (
        <>
          <Spinner />
          <span>{pendingLabel ?? 'Traitement…'}</span>
        </>
      ) : (
        <span className="inline-flex items-center gap-2">{children}</span>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
