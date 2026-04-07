import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { users, promoCodes, promoRedemptions } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';
import { env } from '../../config/env.js';

const createCheckoutSchema = z.object({
  plan: z.enum(['weekly', 'monthly', 'semiannual']),
});

// Prices: Weekly 2.99€, Monthly 7.99€, 6 months 29.99€
const STRIPE_PRICES: Record<string, { priceId: string; mode: 'subscription' | 'payment' }> = {
  weekly: { priceId: process.env.STRIPE_PRICE_WEEKLY || 'price_1TG5ueQ2N6UyO2vPxFEV6yqN', mode: 'subscription' },
  monthly: { priceId: process.env.STRIPE_PRICE_MONTHLY || 'price_1TG5ufQ2N6UyO2vP2vmSmaTX', mode: 'subscription' },
  semiannual: { priceId: process.env.STRIPE_PRICE_SEMIANNUAL || 'price_1TG5ufQ2N6UyO2vPSuxsRTnj', mode: 'payment' },
};

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

    const planConfig = STRIPE_PRICES[body.plan];
    if (!planConfig) {
      return reply.status(400).send({ error: 'Plan invalide' });
    }

    // Create Stripe Checkout Session via API
    const params = new URLSearchParams();
    params.append('line_items[0][price]', planConfig.priceId);
    params.append('line_items[0][quantity]', '1');
    params.append('mode', planConfig.mode);
    params.append('success_url', 'https://api.integrafle.fr/payment-success');
    params.append('cancel_url', 'https://api.integrafle.fr/payment-cancel');
    params.append('client_reference_id', userId);
    params.append('metadata[userId]', userId);
    params.append('metadata[plan]', body.plan);

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await response.json() as { id: string; url: string; error?: { message: string } };

    if (!response.ok || session.error) {
      return reply.status(502).send({ error: session.error?.message || 'Erreur Stripe' });
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
    // Stripe signature validation — enable when Stripe is configured
    // const sig = request.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(request.rawBody, sig, env.STRIPE_WEBHOOK_SECRET);

    const event = request.body as {
      type: string;
      data: {
        object: {
          customer?: string;
          client_reference_id?: string;
          metadata?: Record<string, string>;
        };
      };
    };

    app.log.info({ eventType: event.type }, 'Stripe webhook received');

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
