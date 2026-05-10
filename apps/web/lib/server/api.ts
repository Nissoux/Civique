import 'server-only';
import { env } from '../env';
import { getAccessToken } from './session';

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message ?? `API ${status}`);
    this.name = 'ApiError';
  }

  /** Best-effort error message extracted from Fastify response. */
  get userMessage(): string {
    if (
      this.body &&
      typeof this.body === 'object' &&
      'error' in this.body &&
      typeof (this.body as { error: unknown }).error === 'string'
    ) {
      return (this.body as { error: string }).error;
    }
    return this.message;
  }
}

interface FetchOpts {
  /** Attach `Authorization: Bearer <access>` from cookies. */
  auth?: boolean;
}

/**
 * Server-side fetch wrapper for the Fastify API.
 * Always uses `cache: 'no-store'` — auth-bearing requests must never be cached.
 */
export async function fastifyFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
  opts: FetchOpts = {},
): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`;
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (opts.auth) {
    const token = await getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...init, headers, cache: 'no-store' });
  const text = await res.text();
  const body: unknown = text ? safeJson(text) : null;

  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
