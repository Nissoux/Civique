'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { googleSignInAction } from '@/app/(auth)/oauth-actions';

/**
 * Google Identity Services (GIS) sign-in button, rendered by Google itself
 * via `google.accounts.id.renderButton`.
 *
 * Why not a fully-custom button?
 * ------------------------------
 * Google's terms now require their pixel-perfect button (logo + word-mark)
 * for any UI that mints a Google credential. Going custom triggers a policy
 * violation that can disable the OAuth client. The wrapper here keeps our
 * layout (full-width, grid-friendly) while letting Google paint the actual
 * surface.
 *
 * Flow
 * ----
 *   1. We load https://accounts.google.com/gsi/client (`Script` from next/script,
 *      defer + async, only on this route).
 *   2. On `onLoad`, we call `google.accounts.id.initialize` with our public
 *      client_id and a callback. The callback fires when the user picks an
 *      account in the One Tap UI / popup.
 *   3. Google hands us a `credential` (the signed ID token). We pass it to
 *      `googleSignInAction`, which forwards it to the Fastify backend, gets
 *      our own JWT pair back, sets the httpOnly cookies, and returns
 *      `{ ok: true, next }`. Then we `router.push(next)`.
 *   4. We `router.refresh()` after push so server components re-fetch the
 *      now-authenticated user.
 *
 * The `next` prop is sanitized by the server action — we just forward
 * whatever was on the URL.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'small' | 'medium' | 'large';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
              locale?: string;
            },
          ) => void;
        };
      };
    };
  }
}

interface Props {
  /** Where to land after a successful sign-in. Defaults to `/app`. */
  next?: string;
  /** Visual hint — switches Google's text between "Sign in with" and
   * "Sign up with" on the rendered button. */
  intent?: 'signin' | 'signup';
  /** Optional CSS classes wrapping the Google-painted button. */
  className?: string;
}

const CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  // Same fallback as the backend — keeps a working dev experience even if
  // the env var is missing locally.
  '593427095159-ccfousaqelr1rj1mk9ojhifbo87levud.apps.googleusercontent.com';

export function GoogleSignInButton({ next = '/app', intent = 'signin', className }: Props) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Re-render the Google button whenever the script tag finishes loading,
  // and re-initialize if the `next` prop changes (because the callback
  // closes over it). We track this via a `ready` flag set in onLoad.
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady) return;
    if (!buttonRef.current) return;
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async (response) => {
        if (!response.credential) {
          setError('Aucune information reçue de Google. Réessayez.');
          return;
        }
        setError(null);
        setSubmitting(true);
        try {
          const result = await googleSignInAction({
            idToken: response.credential,
            next,
          });
          if (!result.ok) {
            setError(result.error);
            setSubmitting(false);
            return;
          }
          // Cookies are set by the server action; navigate and ask Next to
          // re-render server components with the fresh session.
          router.push(result.next);
          router.refresh();
        } catch (err) {
          // Network blip / action throwing. Surface generic text so the user
          // can retry.
          setError(
            err instanceof Error
              ? err.message
              : 'Connexion impossible. Réessayez.',
          );
          setSubmitting(false);
        }
      },
      // FedCM is the future of browser-mediated identity; opting in keeps us
      // forward-compatible with Chrome's third-party cookie phase-out.
      use_fedcm_for_prompt: true,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render Google's official button into our container.
    buttonRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: intent === 'signup' ? 'signup_with' : 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
      width: 320,
      locale: 'fr',
    });
  }, [scriptReady, next, intent, router]);

  return (
    <div className={className}>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="flex justify-center">
        <div
          ref={buttonRef}
          // While the script is loading, keep a placeholder of the same size
          // so the page doesn't reflow when the real button paints.
          className={`min-h-[44px] flex items-center justify-center ${submitting ? 'opacity-50 pointer-events-none' : ''}`}
          aria-label="Connexion Google"
        >
          {!scriptReady ? (
            <span className="text-sm text-ink-mute italic font-display">
              — Chargement Google…
            </span>
          ) : null}
        </div>
      </div>
      {error ? (
        <p
          role="alert"
          className="mt-2 text-sm text-terracotta text-center font-display italic"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
