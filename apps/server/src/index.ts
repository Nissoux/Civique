import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
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

  // Plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
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
