import 'server-only';
import { fastifyFetch } from './api';

/**
 * Web subscription / Stripe service.
 * Mobile uses RevenueCat; web uses Stripe Checkout (hosted page).
 *
 * The Fastify backend (apps/server/src/routes/payments) exposes:
 *   GET  /payments/subscription          → current subscription status
 *   POST /payments/create-checkout       → Stripe Checkout session URL
 *   POST /payments/redeem-code           → promo code redemption
 *   POST /payments/webhook/stripe        → Stripe webhook (server handles)
 *
 * It does NOT (yet) expose customer portal / cancel endpoints — see TODOs
 * in apps/web/app/app/settings/subscription/page.tsx.
 */

export type SubscriptionPlan = 'weekly' | 'monthly' | 'semiannual';

export interface SubscriptionInfo {
  isPremium: boolean;
  premiumExpires?: string | null;
  hasStripeCustomer?: boolean;
}

export interface CheckoutResult {
  /** Stripe-hosted Checkout page — caller redirects the browser here. */
  url: string;
  sessionId: string;
  plan: SubscriptionPlan;
}

export interface RedeemCodeResult {
  message: string;
  type: string;
  premiumExpires: string | null;
}

// ── GET subscription ─────────────────────────────────────

export async function getSubscription(): Promise<SubscriptionInfo> {
  const res = await fastifyFetch<{ data: SubscriptionInfo }>(
    '/payments/subscription',
    { method: 'GET' },
    { auth: true },
  );
  return res.data;
}

// ── POST create-checkout ─────────────────────────────────

export async function createCheckoutSession(
  plan: SubscriptionPlan,
): Promise<CheckoutResult> {
  const res = await fastifyFetch<{
    data: { checkoutUrl: string; sessionId: string; plan: SubscriptionPlan };
  }>(
    '/payments/create-checkout',
    { method: 'POST', body: JSON.stringify({ plan }) },
    { auth: true },
  );
  return {
    url: res.data.checkoutUrl,
    sessionId: res.data.sessionId,
    plan: res.data.plan,
  };
}

// ── POST redeem-code ─────────────────────────────────────

export async function redeemPromoCode(code: string): Promise<RedeemCodeResult> {
  const res = await fastifyFetch<{ data: RedeemCodeResult }>(
    '/payments/redeem-code',
    { method: 'POST', body: JSON.stringify({ code: code.trim().toUpperCase() }) },
    { auth: true },
  );
  return res.data;
}
