import { type InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({
  label,
  hint,
  id,
  name,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextFieldProps) {
  const inputId = id ?? name;
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;
  // Merge caller-supplied aria-describedby (e.g. error message id) with the
  // hint id so screen readers announce both.
  const describedBy =
    [ariaDescribedBy, hintId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="flex flex-col">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={`field-input ${className}`}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint ? (
        <p
          id={hintId}
          className="text-xs text-ink-mute mt-2 font-display italic"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
