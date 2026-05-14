import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { users, promoCodes, promoRedemptions, stripeEventsProcessed } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';
import { env } from '../../config/env.js';

const createCheckoutSchema = z.object({
  plan: z.enum(['weekly', 'monthly', 'semiannual']),
});

// Prices: Weekly 3.99€, Monthly 10.99€, 6 months 39.99€.
// SAFETY: no hardcoded fallback price IDs — if the env var is missing,
// `/create-checkout` returns 503. The previous behaviour silently fell
// back to test-mode IDs, which would charge the wrong amount in
// production.
type Plan = 'weekly' | 'monthly' | 'semiannual';

// All three plans are subscription-mode. Earlier the semiannual was
// declared `payment` (one-time) but the actual Stripe price was created
// as a recurring 6-month price → Stripe rejected the checkout with
// "You specified `payment` mode but passed a recurring price." If we
// ever want a true one-time semiannual, create a non-recurring Stripe
// price and flip this back to 'payment'.
const STRIPE_PLAN_MODES: Record<Plan, 'subscription' | 'payment'> = {
  weekly: 'subscription',
  monthly: 'subscription',
  semiannual: 'subscription',
};

function getStripePriceConfig(
  plan: Plan,
): { priceId: string; mode: 'subscription' | 'payment' } | null {
  const envKey: Record<Plan, string> = {
    weekly: 'STRIPE_PRICE_WEEKLY',
    monthly: 'STRIPE_PRICE_MONTHLY',
    semiannual: 'STRIPE_PRICE_SEMIANNUAL',
  };
  const priceId = process.env[envKey[plan]];
  if (!priceId) return null;
  return { priceId, mode: STRIPE_PLAN_MODES[plan] };
}

export default async function paymentRoutes(app: FastifyInstance) {
  // ── GET /subscription ───────────────────────────────────
  // Returns current user's subscription status
  app.get('/subscription', { preHandler: authGuard }, async (request, reply) => {
    const userId = request.currentUser!.id;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        isPremium: true,
        premiumExpires: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const isActive =
      user.isPremium &&
      (!user.premiumExpires || new Date(user.premiumExpires) > new Date());

    return {
      data: {
        isPremium: isActive,
        premiumExpires: user.premiumExpires,
        hasStripeCustomer: !!user.stripeCustomerId,
      },
    };
  });

  // ── POST /create-checkout ───────────────────────────────
  // Create a Stripe Checkout Session
  app.post('/create-checkout', { preHandler: authGuard }, async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = createCheckoutSchema.parse(request.body);

    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return reply.status(503).send({ error: 'Paiement non configuré' });
    }

    const planConfig = getStripePriceConfig(body.plan);
    if (!planConfig) {
      // Env var missing for this plan — refuse rather than silently use the
      // wrong price ID. Operator must set STRIPE_PRICE_{WEEKLY,MONTHLY,SEMIANNUAL}.
      app.log.error(
        { plan: body.plan },
        `Stripe price env var missing for plan "${body.plan}" — refusing checkout`,
      );
      return reply.status(503).send({
        error: 'Paiement non configuré pour ce plan',
      });
    }

    // Create Stripe Checkout Session via API
    const params = new URLSearchParams();
    params.append('line_items[0][price]', planConfig.priceId);
    params.append('line_items[0][quantity]', '1');
    params.append('mode', planConfig.mode);
    params.append('success_url', `${env.WEB_BASE_URL}/app/settings/subscription?success=1`);
    params.append('cancel_url', `${env.WEB_BASE_URL}/app/settings/subscription?canceled=1`);
    params.append('client_reference_id', userId);
    params.append('metadata[userId]', userId);
    params.append('metadata[plan]', body.plan);

    // Stripe checkout creation can flake on transient network issues
    // (TLS handshake hiccup, momentary api.stripe.com 5xx, our outbound
    // path bouncing on the VPS). We saw 502s in production logs that
    // resolved on the user's retry click. Implement two layers of
    // resilience:
    //   1. 10s timeout via AbortController so we never hang the request
    //      forever and bubble a useful error to the user.
    //   2. One backoff retry on network errors / Stripe 5xx — does NOT
    //      retry on 4xx (config error, bad price ID), since retrying a
    //      semantically-wrong request just wastes time and shows the
    //      same error.
    let session: { id: string; url: string; error?: { message: string } } | null = null;
    let lastError: string | null = null;
    let attempt = 0;
    while (attempt < 2 && session === null) {
      attempt += 1;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      try {
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            // Stripe-Idempotency-Key prevents Stripe from billing twice
            // if we retry — keys must be stable per logical operation,
            // so we derive from userId+plan+attempt timestamp window.
            'Idempotency-Key': `chk_${userId}_${body.plan}_${Math.floor(Date.now() / 60_000)}`,
          },
          body: params.toString(),
          signal: controller.signal,
        });

        const json = (await response.json()) as {
          id?: string;
          url?: string;
          error?: { message: string; type?: string };
        };

        if (!response.ok) {
          lastError = json.error?.message ?? `Stripe ${response.status}`;
          app.log.warn(
            { status: response.status, error: json.error, attempt, userId, plan: body.plan },
            'Stripe checkout session failed',
          );
          // 4xx → semantic error, do not retry. 5xx → transient, retry once.
          if (response.status < 500) break;
          continue;
        }
        if (json.error || !json.id || !json.url) {
          lastError = json.error?.message ?? 'Stripe response missing session id/url';
          app.log.warn({ json, attempt, userId }, 'Stripe checkout malformed response');
          break;
        }
        session = { id: json.id, url: json.url };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const isAbort = err instanceof Error && err.name === 'AbortError';
        lastError = isAbort ? 'Stripe API timeout (10s)' : msg;
        app.log.warn(
          { err: msg, isAbort, attempt, userId, plan: body.plan },
          'Stripe checkout network error',
        );
        // Continue to retry once for any thrown network error / timeout.
      } finally {
        clearTimeout(timeout);
      }
    }

    if (session === null) {
      return reply.status(502).send({ error: lastError ?? 'Erreur Stripe' });
    }

    return reply.status(201).send({
      data: {
        checkoutUrl: session.url,
        sessionId: session.id,
        plan: body.plan,
      },
    });
  });

  // ── POST /webhook/stripe ────────────────────────────────
  // Stripe webhook handler (no auth - Stripe calls this directly)
  app.post('/webhook/stripe', async (request, reply) => {
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return reply.status(503).send({ error: 'Stripe webhook secret not configured' });
    }

    const signatureHeader = request.headers['stripe-signature'];
    if (!signatureHeader || typeof signatureHeader !== 'string') {
      return reply.status(400).send({ error: 'Missing stripe-signature header' });
    }

    const rawBody = request.rawBody;
    if (!rawBody) {
      app.log.warn('Stripe webhook received without rawBody — content type parser misconfigured');
      return reply.status(400).send({ error: 'Raw body unavailable' });
    }

    // Parse Stripe signature header: "t=<timestamp>,v1=<sig>[,v1=<sig>...]"
    const parts = signatureHeader.split(',').reduce<Record<string, string[]>>((acc, p) => {
      const [k, v] = p.split('=', 2);
      if (!k || !v) return acc;
      acc[k] = acc[k] ?? [];
      acc[k].push(v);
      return acc;
    }, {});

    const timestamp = parts['t']?.[0];
    const signatures = parts['v1'] ?? [];
    if (!timestamp || signatures.length === 0) {
      return reply.status(400).send({ error: 'Invalid stripe-signature header' });
    }

    // Reject signatures older than 5 minutes (replay protection)
    const tsSec = Number.parseInt(timestamp, 10);
    if (!Number.isFinite(tsSec) || Math.abs(Date.now() / 1000 - tsSec) > 300) {
      return reply.status(400).send({ error: 'Signature timestamp out of tolerance' });
    }

    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(`${timestamp}.${rawBody}`, 'utf8')
      .digest('hex');

    const expectedBuf = Buffer.from(expected, 'hex');
    const isMatch = signatures.some((sig) => {
      const sigBuf = Buffer.from(sig, 'hex');
      return (
        sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)
      );
    });

    if (!isMatch) {
      app.log.warn({ ip: request.ip }, 'Stripe webhook signature mismatch');
      return reply.status(400).send({ error: 'Invalid signature' });
    }

    const event = request.body as {
      id: string;
      type: string;
      data: {
        object: {
          customer?: string;
          client_reference_id?: string;
          metadata?: Record<string, string>;
        };
      };
    };

    app.log.info({ eventId: event.id, eventType: event.type }, 'Stripe webhook received');

    // ── Idempotency guard (P1-13) ───────────────────────
    // Stripe retries webhooks aggressively on timeout / non-2xx. Without
    // this, a retry of `checkout.session.completed` doubles the premium
    // duration (the handler simply re-adds 7/30/180 days). Insert the
    // event_id; if it's already there, the PK collision tells us we
    // already processed it and we short-circuit with 200.
    if (!event.id || typeof event.id !== 'string') {
      app.log.warn('Stripe webhook payload missing event id');
      return reply.status(400).send({ error: 'Missing event id' });
    }
    try {
      await db
        .insert(stripeEventsProcessed)
        .values({ eventId: event.id, eventType: event.type });
    } catch (err) {
      // Postgres unique violation = 23505. That's the "already processed"
      // signal — reply 200 so Stripe stops retrying. Any other DB error
      // we propagate as 500 so Stripe DOES retry (transient outage etc).
      const pgCode = (err as { code?: string } | undefined)?.code;
      if (pgCode === '23505') {
        app.log.info(
          { eventId: event.id, eventType: event.type },
          'Stripe webhook idempotent replay — skipping',
        );
        return reply.status(200).send({ received: true, idempotent: true });
      }
      app.log.error(
        { err, eventId: event.id, eventType: event.type },
        'Failed to record Stripe event for idempotency',
      );
      return reply.status(500).send({ error: 'Internal error' });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id ?? session.metadata?.userId;
      const plan = session.metadata?.plan || 'lifetime';

      if (userId) {
        // Set expiry based on plan
        let premiumExpires: Date | null;
        if (plan === 'semiannual') {
          premiumExpires = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 months
        } else if (plan === 'weekly') {
          premiumExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        } else {
          premiumExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }

        await db
          .update(users)
          .set({
            isPremium: true,
            premiumExpires,
            stripeCustomerId: session.customer ?? undefined,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        app.log.info({ userId, plan }, 'User upgraded to premium via Stripe');
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      if (customerId) {
        await db
          .update(users)
          .set({
            isPremium: false,
            updatedAt: new Date(),
          })
          .where(eq(users.stripeCustomerId, customerId));

        app.log.info({ customerId }, 'User premium cancelled via Stripe');
      }
    }

    return reply.status(200).send({ received: true });
  });

  // ── POST /webhook/revenuecat ────────────────────────────
  // RevenueCat webhook handler (no auth - RevenueCat calls this directly)
  app.post('/webhook/revenuecat', async (request, reply) => {
    const event = request.body as {
      event: {
        type: string;
        app_user_id?: string;
        expiration_at_ms?: number;
      };
    };

    app.log.info({ eventType: event.event?.type }, 'RevenueCat webhook received');

    const rcEvent = event.event;
    if (!rcEvent?.app_user_id) {
      return reply.status(200).send({ received: true });
    }

    const userId = rcEvent.app_user_id;

    switch (rcEvent.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'PRODUCT_CHANGE': {
        const premiumExpires = rcEvent.expiration_at_ms
          ? new Date(rcEvent.expiration_at_ms)
          : null;

        await db
          .update(users)
          .set({
            isPremium: true,
            premiumExpires,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        app.log.info({ userId, type: rcEvent.type }, 'User upgraded via RevenueCat');
        break;
      }

      case 'CANCELLATION':
      case 'EXPIRATION': {
        await db
          .update(users)
          .set({
            isPremium: false,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        app.log.info({ userId, type: rcEvent.type }, 'User premium expired via RevenueCat');
        break;
      }

      default:
        app.log.info({ type: rcEvent.type }, 'Unhandled RevenueCat event type');
    }

    return reply.status(200).send({ received: true });
  });

  // ── POST /customer-portal ───────────────────────────────
  // Crée une session Stripe Billing Portal pour gérer l'abonnement
  app.post('/customer-portal', { preHandler: authGuard }, async (request, reply) => {
    const userId = request.currentUser!.id;
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return reply.status(503).send({ error: 'Paiement non configuré' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { stripeCustomerId: true },
    });

    if (!user) {
      return reply.status(404).send({ error: 'Utilisateur non trouvé' });
    }
    if (!user.stripeCustomerId) {
      return reply.status(404).send({ error: 'Aucun abonnement Stripe associé à ce compte' });
    }

    const params = new URLSearchParams();
    params.append('customer', user.stripeCustomerId);
    params.append(
      'return_url',
      `${env.WEB_BASE_URL}/app/settings/subscription`,
    );

    const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = (await response.json()) as {
      url?: string;
      error?: { message: string };
    };

    if (!response.ok || !session.url) {
      return reply
        .status(502)
        .send({ error: session.error?.message || 'Erreur Stripe' });
    }

    return { data: { url: session.url } };
  });

  // ── POST /cancel ────────────────────────────────────────
  // Annule l'abonnement actif de l'utilisateur à la fin de la période en cours
  app.post('/cancel', { preHandler: authGuard }, async (request, reply) => {
    const userId = request.currentUser!.id;
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return reply.status(503).send({ error: 'Paiement non configuré' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { stripeCustomerId: true },
    });

    if (!user) {
      return reply.status(404).send({ error: 'Utilisateur non trouvé' });
    }
    if (!user.stripeCustomerId) {
      return reply.status(404).send({ error: 'Aucun abonnement Stripe associé à ce compte' });
    }

    // Récupère les abonnements actifs du client
    const listRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${encodeURIComponent(user.stripeCustomerId)}&status=active&limit=1`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${stripeKey}` },
      },
    );

    const listJson = (await listRes.json()) as {
      data?: Array<{ id: string }>;
      error?: { message: string };
    };

    if (!listRes.ok) {
      return reply
        .status(502)
        .send({ error: listJson.error?.message || 'Erreur Stripe' });
    }

    const sub = listJson.data?.[0];
    if (!sub) {
      return reply.status(404).send({ error: 'Aucun abonnement actif à annuler' });
    }

    // Met à jour l'abonnement pour annulation à la fin de période
    const updateParams = new URLSearchParams();
    updateParams.append('cancel_at_period_end', 'true');

    const updateRes = await fetch(
      `https://api.stripe.com/v1/subscriptions/${encodeURIComponent(sub.id)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: updateParams.toString(),
      },
    );

    const updated = (await updateRes.json()) as {
      id: string;
      cancel_at: number | null;
      canceled_at: number | null;
      current_period_end: number;
      error?: { message: string };
    };

    if (!updateRes.ok) {
      return reply
        .status(502)
        .send({ error: updated.error?.message || 'Erreur Stripe' });
    }

    const periodEnd = updated.current_period_end
      ? new Date(updated.current_period_end * 1000).toISOString()
      : null;
    const canceledAt = updated.canceled_at
      ? new Date(updated.canceled_at * 1000).toISOString()
      : new Date().toISOString();

    return { data: { canceledAt, periodEnd } };
  });

  // ── POST /redeem-code ─────────────────────────────────
  // Redeem a promo code to get premium access
  const redeemSchema = z.object({
    code: z.string().min(1).max(50).transform((v) => v.toUpperCase().trim()),
  });

  app.post('/redeem-code', { preHandler: authGuard }, async (request, reply) => {
    const userId = request.currentUser!.id;
    const { code } = redeemSchema.parse(request.body);

    // Find code
    const promo = await db.query.promoCodes.findFirst({
      where: eq(promoCodes.code, code),
    });

    if (!promo) {
      return reply.status(404).send({ error: 'Code invalide' });
    }

    // Check expiry
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return reply.status(410).send({ error: 'Ce code a expiré' });
    }

    // Check uses
    if (promo.currentUses >= promo.maxUses) {
      return reply.status(410).send({ error: 'Ce code a déjà été utilisé le nombre maximum de fois' });
    }

    // Check if user already redeemed this code
    const existing = await db.query.promoRedemptions.findFirst({
      where: and(
        eq(promoRedemptions.codeId, promo.id),
        eq(promoRedemptions.userId, userId),
      ),
    });

    if (existing) {
      return reply.status(409).send({ error: 'Vous avez déjà utilisé ce code' });
    }

    // Apply premium
    const premiumExpires = promo.durationDays
      ? new Date(Date.now() + promo.durationDays * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 months default

    await db.update(users).set({
      isPremium: true,
      premiumExpires,
    }).where(eq(users.id, userId));

    // Record redemption
    await db.insert(promoRedemptions).values({
      codeId: promo.id,
      userId,
    });

    // Increment uses
    await db.update(promoCodes).set({
      currentUses: promo.currentUses + 1,
    }).where(eq(promoCodes.id, promo.id));

    return reply.status(200).send({
      data: {
        message: 'Code activé avec succès !',
        type: promo.type,
        premiumExpires: premiumExpires.toISOString(),
      },
    });
  });

  // ── POST /admin/create-code ───────────────────────────
  // Create promo codes (admin only, protected by secret)
  const createCodeSchema = z.object({
    code: z.string().min(3).max(50).transform((v) => v.toUpperCase().trim()),
    type: z.enum(['lifetime', '30days', '90days', '365days']).default('lifetime'),
    maxUses: z.number().min(1).default(1),
    expiresAt: z.string().optional(), // ISO date
    adminSecret: z.string(),
  });

  app.post('/admin/create-code', async (request, reply) => {
    const body = createCodeSchema.parse(request.body);

    // Verify admin secret
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return reply.status(503).send({ error: 'Admin endpoint not configured' });
    }
    if (body.adminSecret !== adminSecret) {
      return reply.status(403).send({ error: 'Accès refusé' });
    }

    const durationMap: Record<string, number | null> = {
      lifetime: null,
      '30days': 30,
      '90days': 90,
      '365days': 365,
    };

    const [created] = await db.insert(promoCodes).values({
      code: body.code,
      type: body.type,
      durationDays: durationMap[body.type] ?? null,
      maxUses: body.maxUses,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    }).returning();

    return reply.status(201).send({ data: created });
  });
}
