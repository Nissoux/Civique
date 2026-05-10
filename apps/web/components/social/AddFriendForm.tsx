'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from 'react';
import { FormMessage } from '@/components/auth/FormMessage';
import { Avatar } from '@/components/social/Avatar';
import {
  requestFriendAction,
  searchUsersAction,
} from '@/lib/actions/social';
import type { UserSearchResult } from '@/lib/server/social';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

type InviteState =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'sent' }
  | { kind: 'already-friends' }
  | { kind: 'error'; message: string };

/**
 * Heuristic: detect the "already friends / request pending" 409 case from
 * the server's French error message. The action contract returns a single
 * `error` string, so we sniff for the relevant tokens.
 */
function looksLikeAlreadyFriends(error: string): boolean {
  const e = error.toLowerCase();
  return (
    e.includes('déjà') ||
    e.includes('deja') ||
    e.includes('existe') ||
    e.includes('already')
  );
}

export function AddFriendForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searchPending, startSearch] = useTransition();
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Per-row invite status, keyed by user id. Session-only — not persisted
  // to localStorage, because (a) the user can reload to re-check authoritative
  // friendship state from the server, and (b) "already invited" doesn't need
  // to survive across devices.
  const [invites, setInvites] = useState<Record<string, InviteState>>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestSeqRef = useRef(0);

  // Debounced search: schedule a server action call 300ms after the last
  // keystroke. Each call carries a monotonically increasing seq number so
  // stale responses are dropped.
  const scheduleSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = q.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setSearchError(null);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const seq = ++requestSeqRef.current;
      startSearch(async () => {
        const result = await searchUsersAction(trimmed);
        // Ignore out-of-order responses.
        if (seq !== requestSeqRef.current) return;
        setHasSearched(true);
        if (result.ok) {
          setResults(result.results);
          setSearchError(null);
        } else {
          setResults([]);
          setSearchError(result.error);
        }
      });
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function onQueryChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setQuery(next);
    scheduleSearch(next);
  }

  async function invite(id: string) {
    setInvites((s) => ({ ...s, [id]: { kind: 'pending' } }));
    const res = await requestFriendAction(id);
    setInvites((s) => {
      if (res.ok) return { ...s, [id]: { kind: 'sent' } };
      const msg = res.error ?? "Impossible d'envoyer la demande.";
      if (looksLikeAlreadyFriends(msg)) {
        return { ...s, [id]: { kind: 'already-friends' } };
      }
      return { ...s, [id]: { kind: 'error', message: msg } };
    });
  }

  const trimmed = query.trim();
  const showEmpty =
    trimmed.length >= MIN_QUERY_LENGTH &&
    !searchPending &&
    hasSearched &&
    results.length === 0 &&
    !searchError;

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="friend-search" className="field-label">
          Rechercher un ami par email ou nom
        </label>
        <div className="relative">
          <input
            id="friend-search"
            name="friend-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="Tapez au moins 2 caractères…"
            value={query}
            onChange={onQueryChange}
            className="field-input pr-10"
            aria-describedby="friend-search-hint"
            aria-busy={searchPending}
          />
          {searchPending ? (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute"
              aria-hidden
            >
              <Spinner />
            </span>
          ) : null}
        </div>
        <p
          id="friend-search-hint"
          className="text-xs text-ink-mute mt-2 font-display italic"
        >
          La recherche démarre après {MIN_QUERY_LENGTH} caractères.
        </p>
      </div>

      {searchError ? <FormMessage error={searchError} /> : null}

      {showEmpty ? (
        <p
          role="status"
          className="text-sm text-ink-mute font-display italic px-1"
        >
          Aucun utilisateur trouvé.
        </p>
      ) : null}

      {results.length > 0 ? (
        <ul
          role="list"
          className="
            divide-y divide-aubergine/10
            rounded-2xl border border-aubergine/15 bg-bone
            max-h-80 overflow-y-auto
          "
        >
          {results.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              state={invites[u.id] ?? { kind: 'idle' }}
              onInvite={() => invite(u.id)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

interface UserRowProps {
  user: UserSearchResult;
  state: InviteState;
  onInvite: () => void;
}

function UserRow({ user, state, onInvite }: UserRowProps) {
  const isPending = state.kind === 'pending';
  const isSent = state.kind === 'sent';
  const isAlready = state.kind === 'already-friends';
  const isError = state.kind === 'error';
  const disabled = isPending || isSent || isAlready;

  return (
    <li
      aria-busy={isPending || undefined}
      className="flex items-center gap-3 px-3 sm:px-4 py-3"
    >
      <Avatar
        displayName={user.displayName}
        avatarUrl={user.avatarUrl}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <p className="font-display text-base font-medium text-aubergine truncate">
          {user.displayName}
        </p>
        <p className="text-xs text-ink-mute truncate" title={user.email}>
          {user.email}
        </p>
        {isError ? (
          <p
            role="alert"
            className="text-[0.7rem] text-fr-red mt-1"
          >
            {state.message}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onInvite}
        disabled={disabled}
        aria-label={
          isSent
            ? 'Demande déjà envoyée'
            : isAlready
              ? 'Déjà ami'
              : `Inviter ${user.displayName}`
        }
        className="
          inline-flex shrink-0 items-center justify-center
          rounded-full px-3.5 py-1.5 text-sm font-semibold
          transition-all
          disabled:cursor-not-allowed
          enabled:bg-terracotta enabled:text-bone
          enabled:shadow-[0_2px_0_rgb(45_27_46)]
          enabled:hover:-translate-y-0.5
          enabled:hover:shadow-[0_3px_0_rgb(45_27_46)]
          disabled:bg-bone-deep disabled:text-ink-mute
        "
      >
        {isPending
          ? 'Envoi…'
          : isSent
            ? '✓ Demande envoyée'
            : isAlready
              ? 'Déjà ami'
              : 'Inviter'}
      </button>
    </li>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
