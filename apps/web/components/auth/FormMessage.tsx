interface FormMessageProps {
  error?: string;
  message?: string;
}

export function FormMessage({ error, message }: FormMessageProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="
          rounded-xl bg-error-bg border-[1.5px] border-fr-red/40
          px-4 py-3 text-sm text-fr-red font-medium
        "
      >
        {error}
      </div>
    );
  }
  if (message) {
    return (
      <div
        role="status"
        className="
          rounded-xl bg-success-bg border-[1.5px] border-success/40
          px-4 py-3 text-sm text-success font-medium
        "
      >
        {message}
      </div>
    );
  }
  return null;
}
