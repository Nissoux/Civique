import { FastifyRequest, FastifyReply } from 'fastify';
import { eq, and, gte, sql } from 'drizzle-orm';
import { db } from '../config/database.js';
import { users, practiceAnswers, examSessions } from '../db/schema.js';

const FREE_DAILY_QUESTIONS = 10;
const FREE_WEEKLY_EXAMS = 1;

function isPremiumActive(user: { isPremium: boolean; premiumExpires: Date | null }): boolean {
  if (!user.isPremium) return false;
  if (!user.premiumExpires) return true;
  return new Date(user.premiumExpires) > new Date();
}

/**
 * Check if free user has reached daily practice limit (10 questions/day)
 */
export async function checkPracticeQuota(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.currentUser!.id;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { isPremium: true, premiumExpires: true },
  });

  if (!user || isPremiumActive(user)) return; // Premium = no limit

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [count] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(practiceAnswers)
    .where(
      and(
        eq(practiceAnswers.userId, userId),
        gte(practiceAnswers.answeredAt, todayStart),
      ),
    );

  if (count.count >= FREE_DAILY_QUESTIONS) {
    return reply.status(429).send({
      error: 'Limite quotidienne atteinte',
      message: `Vous avez atteint la limite de ${FREE_DAILY_QUESTIONS} questions gratuites par jour. Passez à Premium pour un accès illimité.`,
      limit: FREE_DAILY_QUESTIONS,
      used: count.count,
      resetsAt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }
}

/**
 * Check if free user has reached weekly exam limit (1 exam/week)
 */
export async function checkExamQuota(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.currentUser!.id;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { isPremium: true, premiumExpires: true },
  });

  if (!user || isPremiumActive(user)) return; // Premium = no limit

  // Start of current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const [count] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(examSessions)
    .where(
      and(
        eq(examSessions.userId, userId),
        gte(examSessions.startedAt, weekStart),
      ),
    );

  if (count.count >= FREE_WEEKLY_EXAMS) {
    // Next Monday
    const nextMonday = new Date(weekStart);
    nextMonday.setDate(weekStart.getDate() + 7);

    return reply.status(429).send({
      error: 'Limite hebdomadaire atteinte',
      message: `Vous avez atteint la limite de ${FREE_WEEKLY_EXAMS} examen(s) gratuit(s) par semaine. Passez à Premium pour des examens illimités.`,
      limit: FREE_WEEKLY_EXAMS,
      used: count.count,
      resetsAt: nextMonday.toISOString(),
    });
  }
}

/**
 * Get current quota status for a user
 */
export async function getQuotaStatus(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { isPremium: true, premiumExpires: true },
  });

  const premium = user ? isPremiumActive(user) : false;

  if (premium) {
    return { isPremium: true, daily: { limit: -1, used: 0 }, weekly: { limit: -1, used: 0 } };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [dailyCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(practiceAnswers)
    .where(and(eq(practiceAnswers.userId, userId), gte(practiceAnswers.answeredAt, todayStart)));

  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const [weeklyCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(examSessions)
    .where(and(eq(examSessions.userId, userId), gte(examSessions.startedAt, weekStart)));

  return {
    isPremium: false,
    daily: { limit: FREE_DAILY_QUESTIONS, used: dailyCount.count },
    weekly: { limit: FREE_WEEKLY_EXAMS, used: weeklyCount.count },
  };
}
