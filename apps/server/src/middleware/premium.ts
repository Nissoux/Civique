import { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { users } from '../db/schema.js';

export async function premiumGuard(request: FastifyRequest, reply: FastifyReply) {
  if (!request.currentUser) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, request.currentUser.id),
    columns: { isPremium: true, premiumExpires: true },
  });

  if (!user) {
    return reply.status(401).send({ error: 'User not found' });
  }

  if (!user.isPremium) {
    return reply.status(403).send({ error: 'Premium subscription required' });
  }

  if (user.premiumExpires && new Date(user.premiumExpires) < new Date()) {
    return reply.status(403).send({ error: 'Premium subscription expired' });
  }
}
