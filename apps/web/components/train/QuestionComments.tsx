'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import type { CommentWithUser } from '@/lib/server/social';
import {
  fetchQuestionCommentsAction,
  postCommentAction,
} from '@/lib/actions/social';

interface Props {
  questionId: number;
}

const VISIBLE_LIMIT = 5;
const PREVIEW_LIMIT = 3;

/**
 * Surfaces community comments inside the training feedback panel.
 * Loads lazily on mount, shows the latest few, and lets the user post.
 */
export function QuestionComments({ questionId }: Props) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [draft, setDraft] = useState('');
  const [postError, setPostError] = useState<string | null>(null);
  const [postPending, startPost] = useTransition();

  async function refresh() {
    const res = await fetchQuestionCommentsAction(questionId);
    if (res.ok && res.comments) {
      setComments(res.comments);
      setLoadError(null);
    } else {
      setLoadError(res.error ?? 'Impossible de charger les commentaires.');
    }
    setLoaded(true);
  }

  useEffect(() => {
    setLoaded(false);
    setComments([]);
    setLoadError(null);
    setDraft('');
    setPostError(null);
    void refresh();
    // Re-run when the question changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draft.trim();
    if (text.length === 0) {
      setPostError('Le commentaire ne peut pas être vide.');
      return;
    }
    setPostError(null);
    startPost(async () => {
      const res = await postCommentAction(questionId, text);
      if (!res.ok) {
        setPostError(res.error ?? 'Impossible de publier le commentaire.');
        return;
      }
      setDraft('');
      await refresh();
    });
  }

  // Top-level comments first, newest first.
  const sorted = [...comments].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const visible = sorted.slice(0, PREVIEW_LIMIT);
  const hasMore = sorted.length > visible.length;
  const total = sorted.length;

  return (
    <section className="mt-7" aria-labelledby={`comments-${questionId}-title`}>
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <p
          id={`comments-${questionId}-title`}
          className="eyebrow text-[0.7rem]"
        >
          — Commentaires{total > 0 ? ` · ${total}` : ''}
        </p>
        {hasMore ? (
          // TODO: build /app/comments/[questionId] full thread page —
          // out of scope for this PR.
          <Link
            href="#"
            className="text-xs font-medium text-terracotta hover:underline"
          >
            Voir les {total} commentaires
          </Link>
        ) : null}
      </header>

      {!loaded ? (
        <p className="text-sm italic text-ink-mute py-3">Chargement…</p>
      ) : loadError ? (
        <p
          role="alert"
          className="text-sm rounded-xl bg-error-bg border border-fr-red/30 px-3 py-2 text-fr-red"
        >
          {loadError}
        </p>
      ) : visible.length === 0 ? (
        <p className="text-sm italic text-ink-mute py-2">
          Soyez le premier à commenter cette question.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.slice(0, VISIBLE_LIMIT).map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
        <label htmlFor={`comment-input-${questionId}`} className="sr-only">
          Écrire un commentaire
        </label>
        <textarea
          id={`comment-input-${questionId}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Partagez une astuce, un repère mémo, une question…"
          maxLength={2000}
          rows={2}
          disabled={postPending}
          className="
            w-full resize-y rounded-2xl border-[1.5px] border-aubergine/20
            bg-bone px-4 py-3 text-sm leading-relaxed text-aubergine
            placeholder:text-ink-mute/70
            focus:outline-none focus:border-terracotta
            disabled:opacity-60
          "
        />
        {postError ? (
          <p role="alert" className="text-xs text-fr-red">
            {postError}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.7rem] text-ink-mute">
            {draft.length}/2000
          </span>
          <button
            type="submit"
            disabled={postPending || draft.trim().length === 0}
            className="
              inline-flex items-center gap-1.5 rounded-full
              bg-aubergine text-bone px-4 py-2 text-xs font-semibold
              shadow-[0_2px_0_rgb(45_27_46)]
              hover:-translate-y-0.5 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
            "
          >
            {postPending ? 'Envoi…' : 'Publier'}
          </button>
        </div>
      </form>
    </section>
  );
}

function CommentItem({ comment }: { comment: CommentWithUser }) {
  const when = formatRelative(comment.createdAt);
  return (
    <li className="rounded-2xl border border-aubergine/15 bg-bone px-4 py-3">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <p className="text-sm font-semibold text-aubergine truncate">
          {comment.displayName}
        </p>
        <p className="text-[0.7rem] text-ink-mute font-display italic shrink-0">
          {when}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-aubergine whitespace-pre-line break-words">
        {comment.body}
      </p>
    </li>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.max(1, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return `à l'instant`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `il y a ${weeks} sem`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  const years = Math.floor(days / 365);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
}
