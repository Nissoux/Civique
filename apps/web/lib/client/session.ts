/**
 * Client-side session probe, deduped at module level: every component
 * on a page shares one GET /api/session per page load, whichever
 * mounts first wins the fetch.
 */
let promise: Promise<boolean> | null = null;

export function fetchAuthed(): Promise<boolean> {
  promise ??= fetch('/api/session', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : { authed: false }))
    .then((d: { authed?: boolean }) => Boolean(d.authed))
    .catch(() => false);
  return promise;
}
