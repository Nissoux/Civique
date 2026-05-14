// Social sign-in cluster shown below the email/password block on the
// register and login pages.
//
// PO decision (May 2026): web is email/password + Google only. Apple Sign
// In stays mobile-exclusive — the iOS app uses the native Apple flow, and
// we keep the backend `POST /api/auth/apple` route alive for that, but the
// web layer no longer surfaces an Apple button (avoids the "bientôt
// disponible" placeholder that aged into a UX smell, and keeps the social
// area visually balanced around the Google pill).
//
// Re-introducing Apple on web later is a 30-line revert + the Apple
// Developer Service ID provisioning — nothing here forecloses that.

import { GoogleSignInButton } from './GoogleSignInButton';

interface Props {
  /** Post-login destination. Forwarded to the Google action; sanitized
   * server-side against open-redirects. */
  next?: string;
  /** Switches Google's button text between "Sign in with" and "Sign up
   * with". Cosmetic only. */
  intent?: 'signin' | 'signup';
}

export function SocialButtons({ next = '/app', intent = 'signin' }: Props) {
  return <GoogleSignInButton next={next} intent={intent} />;
}
