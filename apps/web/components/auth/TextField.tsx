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
  ...rest
}: TextFieldProps) {
  const inputId = id ?? name;
  return (
    <div className="flex flex-col">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <input id={inputId} name={name} className={`field-input ${className}`} {...rest} />
      {hint ? (
        <p className="text-xs text-ink-mute mt-2 font-display italic">{hint}</p>
      ) : null}
    </div>
  );
}
