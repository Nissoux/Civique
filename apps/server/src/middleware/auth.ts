import { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthUser {
  id: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: AuthUser;
  }
}

export async function authGuard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const decoded = await request.jwtVerify<AuthUser>();
    request.currentUser = decoded;
  } catch {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}
