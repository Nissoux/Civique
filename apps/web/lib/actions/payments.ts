'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/server/api';
import {
  createCheckoutSession,
  redeemPromoCode,
  type SubscriptionPlan,
} from '@/lib/server/payments';
import type { FormState } from '@/lib/auth-types';

const VALID_PLANS = new Set<SubscriptionPlan>([
  'weekly',
  'monthlyLite',
  'monthly',
  'semiannual',
]);

// ── Start Stripe checkout ────────────────────────────────
// Form action: <form action={startCheckoutAction}><input name="plan" value="monthly" .../>
// Throws redirect() to the Stripe-hosted Checkout page (full external redirect).

export async function startCheckoutAction(formData: FormData): Promise<void> {
  const planRaw = formData.get('plan');
  if (typeof planRaw !== 'string' || !VALID_PLANS.has(planRaw as SubscriptionPlan)) {
    redirect('/app/settings/subscription?error=invalid-plan');
  }
  const plan = planRaw as SubscriptionPlan;

  let url: string;
  try {
    const result = await createCheckoutSession(plan);
    url = result.url;
  } catch (err) {
    const code =
      err instanceof ApiError && err.status === 503
        ? 'unavailable'
        : 'checkout-failed';
    redirect(`/app/settings/subscription?error=${code}`);
  }

  // Server Actions: redirect() throws — must be outside try/catch.
  redirect(url);
}

// ── Redeem promo code ────────────────────────────────────
// useFormState-compatible (prevState, formData).

export async function redeemPromoCodeAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const codeRaw = formData.get('code');
  if (typeof codeRaw !== 'string' || codeRaw.trim().length === 0) {
    return { error: 'Veuillez saisir un code promo.' };
  }

  try {
    await redeemPromoCode(codeRaw);
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.userMessage };
    }
    return { error: 'Code invalide.' };
  }

  // Premium status changed — invalidate cached pages that depend on it.
  revalidatePath('/app');
  revalidatePath('/app/settings/subscription');
  return { message: 'Code activé ! Votre accès Premium a été activé.' };
}

// ── Customer portal / cancel ─────────────────────────────
// TODO: backend (apps/server/src/routes/payments/index.ts) does not yet expose
// a Stripe Customer Portal session endpoint. When it does, add:
//
//   export async function openCustomerPortalAction(): Promise<void> { ... }
//
// Stripe portal URL would be created server-side via:
//   POST https://api.stripe.com/v1/billing_portal/sessions
//     customer=<stripeCustomerId>&return_url=<app/settings/subscription>
//
// Same for cancelSubscriptionAction — backend should call
//   POST /v1/subscriptions/{id}  cancel_at_period_end=true
// then return success. Until then, users manage cancellation via the receipt
// email they get from Stripe.
