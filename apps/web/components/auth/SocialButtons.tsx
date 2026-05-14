// Social sign-in cluster shown below the email/password block on
// register and login pages.
//
//   - Google: live, via Google Identity Services. Google paints its own
//     button (terms require it), we just slot it into our layout.
//   - Apple:  still a placeholder. Will go live once the Apple Developer
//     Service ID for civique.integrafle.fr is provisioned. Until then we
//     keep the button visible-but-disabled so users see the feature is
//     coming.

import { GoogleSignInButton } from './GoogleSignInButton';

interface Props {
  /** Post-login destination. Forwarded to the Google action; sanitized
   * server-side. */
  next?: string;
  /** Drives Google's button text ("Sign in" vs "Sign up") and is purely
   * cosmetic. */
  intent?: 'signin' | 'signup';
}

export function SocialButtons({ next = '/app', intent = 'signin' }: Props) {
  return (
    <div className="space-y-3">
      <GoogleSignInButton next={next} intent={intent} />
      <div className="flex justify-center">
        <AppleButtonStub />
      </div>
      <p className="text-xs text-center text-ink-mute font-display italic">
        Connexion Apple bientôt disponible sur le web
      </p>
    </div>
  );
}

function AppleButtonStub() {
  return (
    <button
      type="button"
      disabled
      aria-label="Connexion Apple (bientôt disponible)"
      className="
        inline-flex items-center justify-center gap-2.5
        rounded-full border-[1.5px] border-aubergine bg-bone
        px-6 py-2.5 text-sm font-semibold text-aubergine
        transition-all hover:-translate-y-0.5 hover:bg-bone-warm
        disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
        focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone
        min-w-[200px]
      "
    >
      <AppleIcon />
      Continuer avec Apple
    </button>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
