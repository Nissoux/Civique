import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import authRoutes from './routes/auth/index.js';
import questionRoutes from './routes/questions/index.js';
import examRoutes from './routes/exams/index.js';
import ficheRoutes from './routes/fiches/index.js';
import statsRoutes from './routes/stats/index.js';
import socialRoutes from './routes/social/index.js';
import paymentRoutes from './routes/payments/index.js';

async function main() {
  const app = Fastify({
    logger: true,
  });

  // Rate limiting: 100 requests per minute per IP
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      error: 'Trop de requêtes',
      message: 'Veuillez patienter avant de réessayer.',
    }),
  });

  // Helmet security headers
  await app.register(helmet, {
    contentSecurityPolicy: false, // Disabled for API server
  });

  // CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://api.integrafle.fr',
    'https://integrafle.fr',
  ];
  await app.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Global error handler for Zod validation errors
  app.setErrorHandler((error: Error & { statusCode?: number; validation?: unknown }, _request, reply) => {
    if (error instanceof ZodError) {
      // Sanitize: strip "received" values from Zod messages to avoid reflecting user input
      const sanitized = error.errors.map((e) => {
        const msg = e.message.replace(/,\s*received\s+['"]?.*['"]?$/i, '');
        return msg;
      }).join(', ');
      return reply.status(400).send({
        error: 'Validation Error',
        message: sanitized,
      });
    }
    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
      });
    }
    app.log.error(error);
    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send({
        error: error.message || 'Erreur de requête',
      });
    }
    return reply.status(500).send({
      error: 'Internal Server Error',
    });
  });

  // Routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(questionRoutes, { prefix: '/api/questions' });
  await app.register(examRoutes, { prefix: '/api/exams' });
  await app.register(ficheRoutes, { prefix: '/api/fiches' });
  await app.register(statsRoutes, { prefix: '/api/stats' });
  await app.register(socialRoutes, { prefix: '/api/social' });
  await app.register(paymentRoutes, { prefix: '/api/payments' });

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Payment redirect pages
  app.get('/payment-success', async (_request, reply) => {
    return reply.type('text/html').send(`
      <html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paiement réussi</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#0A0E1A;color:white">
        <h1 style="color:#4CAF50">✅ Paiement réussi !</h1>
        <p>Votre compte Civique Premium est maintenant actif.</p>
        <p>Retournez dans l'application pour en profiter.</p>
        <p style="margin-top:40px;color:#888">Vous pouvez fermer cette page.</p>
      </body></html>
    `);
  });

  app.get('/payment-cancel', async (_request, reply) => {
    return reply.type('text/html').send(`
      <html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paiement annulé</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#0A0E1A;color:white">
        <h1>Paiement annulé</h1>
        <p>Aucun montant n'a été débité.</p>
        <p>Retournez dans l'application pour réessayer.</p>
      </body></html>
    `);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received, shutting down gracefully...`);
    await app.close();
    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Start
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`Server running on http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
