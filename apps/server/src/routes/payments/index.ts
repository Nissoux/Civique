import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { users, promoCodes, promoRedemptions } from '../../db/schema.js';
import { authGuard } from '../../middleware/auth.js';

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
      },
    };
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
