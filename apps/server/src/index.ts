import Fastify from 'fastify';
import cors from '@fastify/cors';
// import helmet from '@fastify/helmet'; // TODO: install and enable in production
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

  // CORS
  await app.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://api.integrafle.fr',
      'https://integrafle.fr',
      'http://localhost:8081',
      'http://localhost:3000',
    ],
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

  // Legal pages (required by App Store / Google Play)
  app.get('/legal/privacy', async (_request, reply) => {
    const fs = await import('fs');
    const path = await import('path');
    try {
      const md = fs.readFileSync(path.resolve(process.cwd(), '../../store/politique-confidentialite.md'), 'utf-8');
      const html = md
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^---$/gm, '<hr>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
      return reply.type('text/html; charset=utf-8').send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Politique de confidentialité - Civique</title><style>body{font-family:-apple-system,sans-serif;max-width:700px;margin:0 auto;padding:20px;background:#0A0E1A;color:#E0E0E0;line-height:1.6}h1,h2{color:#4D7CFF}h3{color:#AAB}hr{border-color:#333}a{color:#4D7CFF}</style></head><body><p>${html}</p></body></html>`);
    } catch {
      return reply.type('text/html; charset=utf-8').send('<h1>Politique de confidentialité</h1><p>Contactez support@integrafle.fr</p>');
    }
  });

  app.get('/legal/terms', async (_request, reply) => {
    const fs = await import('fs');
    const path = await import('path');
    try {
      const md = fs.readFileSync(path.resolve(process.cwd(), '../../store/conditions-utilisation.md'), 'utf-8');
      const html = md
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^---$/gm, '<hr>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
      return reply.type('text/html; charset=utf-8').send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Conditions d'utilisation - Civique</title><style>body{font-family:-apple-system,sans-serif;max-width:700px;margin:0 auto;padding:20px;background:#0A0E1A;color:#E0E0E0;line-height:1.6}h1,h2{color:#4D7CFF}h3{color:#AAB}hr{border-color:#333}a{color:#4D7CFF}</style></head><body><p>${html}</p></body></html>`);
    } catch {
      return reply.type('text/html; charset=utf-8').send('<h1>Conditions d\'utilisation</h1><p>Contactez support@integrafle.fr</p>');
    }
  });

  // Payment redirect pages
  app.get('/payment-success', async (_request, reply) => {
    return reply.type('text/html; charset=utf-8').send(`
      <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paiement réussi</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#0A0E1A;color:white">
        <h1 style="color:#4CAF50">✅ Paiement réussi !</h1>
        <p>Votre compte Civique Premium est maintenant actif.</p>
        <p>Retournez dans l'application pour en profiter.</p>
        <p style="margin-top:40px;color:#888">Vous pouvez fermer cette page.</p>
      </body></html>
    `);
  });

  app.get('/payment-cancel', async (_request, reply) => {
    return reply.type('text/html; charset=utf-8').send(`
      <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paiement annulé</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#0A0E1A;color:white">
        <h1>Paiement annulé</h1>
        <p>Aucun montant n'a été débité.</p>
        <p>Retournez dans l'application pour réessayer.</p>
      </body></html>
    `);
  });

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
