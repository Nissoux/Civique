import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { users } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

const createCheckoutSchema = z.object({
  plan: z.enum(['monthly', 'yearly']),
});

const PLAN_PRICES = {
  monthly: { amount: 999, label: 'Civique Premium Monthly' },
  yearly: { amount: 7999, label: 'Civique Premium Yearly' },
} as const;

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
  // Create a Stripe checkout session URL (mock for now)
  app.post('/create-checkout', { preHandler: authGuard }, async (request, reply) => {
    const userId = request.currentUser!.id;
    const body = createCheckoutSchema.parse(request.body);

    const plan = PLAN_PRICES[body.plan];

    // TODO: Replace with real Stripe integration
    // const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   customer: user.stripeCustomerId,
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   success_url: '...',
    //   cancel_url: '...',
    // });

    const mockSessionId = `cs_mock_${Date.now()}_${userId.slice(0, 8)}`;
    const mockUrl = `https://checkout.stripe.com/c/pay/${mockSessionId}`;

    return reply.status(201).send({
      data: {
        checkoutUrl: mockUrl,
        sessionId: mockSessionId,
        plan: body.plan,
        amount: plan.amount,
        label: plan.label,
        note: 'This is a mock checkout URL. Stripe integration pending.',
      },
    });
  });

  // ── POST /webhook/stripe ────────────────────────────────
  // Stripe webhook handler (no auth - Stripe calls this directly)
  app.post('/webhook/stripe', async (request, reply) => {
    // TODO: Validate Stripe signature
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

      if (userId) {
        const premiumExpires = new Date();
        premiumExpires.setFullYear(premiumExpires.getFullYear() + 1);

        await db
          .update(users)
          .set({
            isPremium: true,
            premiumExpires,
            stripeCustomerId: session.customer ?? undefined,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        app.log.info({ userId }, 'User upgraded to premium via Stripe');
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
}
