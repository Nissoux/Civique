import { FastifyInstance } from 'fastify';
import { authGuard } from '../../middleware/auth.js';

export default async function paymentRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authGuard);

  app.post('/create-checkout', async (request, reply) => {
    // Stripe checkout session creation will be implemented here
    // Uses env.STRIPE_SECRET_KEY to initialize Stripe client
    return reply.status(501).send({
      error: 'Not implemented',
      message: 'Stripe checkout integration pending',
    });
  });

  app.post('/webhook', async (request, reply) => {
    // Stripe webhook handler for subscription events
    // Validates signature using env.STRIPE_WEBHOOK_SECRET
    return reply.status(501).send({
      error: 'Not implemented',
      message: 'Stripe webhook handler pending',
    });
  });

  app.get('/subscription', async (request) => {
    // Returns current user's subscription status
    const userId = request.currentUser!.id;
    return {
      data: {
        userId,
        isPremium: false,
        message: 'Subscription check pending Stripe integration',
      },
    };
  });
}
