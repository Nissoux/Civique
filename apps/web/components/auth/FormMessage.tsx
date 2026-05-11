interface FormMessageProps {
  error?: string;
  message?: string;
  /** Optional id for aria-describedby/aria-errormessage linking from inputs. */
  id?: string;
}

export function FormMessage({ error, message, id }: FormMessageProps) {
  if (error) {
    return (
      <div
        id={id}
        role="alert"
        aria-live="assertive"
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
        id={id}
        role="status"
        aria-live="polite"
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
