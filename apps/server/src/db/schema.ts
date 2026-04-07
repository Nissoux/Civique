import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  serial,
  uuid,
  jsonb,
  index,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export const languageEnum = pgEnum('language', ['fr', 'ar', 'fa', 'pt', 'es', 'hi']);
export const questionTypeEnum = pgEnum('question_type', ['knowledge', 'situational']);
export const choiceEnum = pgEnum('choice', ['a', 'b', 'c', 'd']);
export const examTypeEnum = pgEnum('exam_type', ['csp', 'cr', 'nat']);
export const friendshipStatusEnum = pgEnum('friendship_status', [
  'pending',
  'accepted',
  'declined',
]);
export const challengeStatusEnum = pgEnum('challenge_status', [
  'pending',
  'active',
  'completed',
  'declined',
]);

// ──────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    displayName: varchar('display_name', { length: 100 }).notNull(),
    avatarUrl: text('avatar_url'),
    preferredLang: languageEnum('preferred_lang').notNull().default('fr'),
    emailVerified: boolean('email_verified').notNull().default(false),
    isPremium: boolean('is_premium').notNull().default(false),
    premiumExpires: timestamp('premium_expires', { withTimezone: true }),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
    stripeCustomerIdx: index('users_stripe_customer_idx').on(table.stripeCustomerId),
  }),
);

// ──────────────────────────────────────────────
// Promo Codes
// ──────────────────────────────────────────────

export const promoCodes = pgTable(
  'promo_codes',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    type: varchar('type', { length: 20 }).notNull().default('lifetime'), // 'lifetime', '30days', '90days', '365days'
    durationDays: integer('duration_days'), // null = lifetime
    maxUses: integer('max_uses').notNull().default(1),
    currentUses: integer('current_uses').notNull().default(0),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    codeIdx: uniqueIndex('promo_codes_code_idx').on(table.code),
  }),
);

export const promoRedemptions = pgTable(
  'promo_redemptions',
  {
    id: serial('id').primaryKey(),
    codeId: integer('code_id').notNull().references(() => promoCodes.id),
    userId: uuid('user_id').notNull().references(() => users.id),
    redeemedAt: timestamp('redeemed_at', { withTimezone: true }).notNull().defaultNow(),
  },
);

export const promoCodesRelations = relations(promoCodes, ({ many }) => ({
  redemptions: many(promoRedemptions),
}));

export const promoRedemptionsRelations = relations(promoRedemptions, ({ one }) => ({
  code: one(promoCodes, { fields: [promoRedemptions.codeId], references: [promoCodes.id] }),
  user: one(users, { fields: [promoRedemptions.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  examSessions: many(examSessions),
  practiceAnswers: many(practiceAnswers),
  friendshipsRequested: many(friendships, { relationName: 'requester' }),
  friendshipsReceived: many(friendships, { relationName: 'addressee' }),
  challengesSent: many(challenges, { relationName: 'challenger' }),
  challengesReceived: many(challenges, { relationName: 'challenged' }),
  comments: many(comments),
}));

// ──────────────────────────────────────────────
// Themes
// ──────────────────────────────────────────────

export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  nameFr: varchar('name_fr', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  color: varchar('color', { length: 7 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});

export const themesRelations = relations(themes, ({ many }) => ({
  questions: many(questions),
  fiches: many(fiches),
  translations: many(themeTranslations),
}));

export const themeTranslations = pgTable(
  'theme_translations',
  {
    id: serial('id').primaryKey(),
    themeId: integer('theme_id')
      .notNull()
      .references(() => themes.id, { onDelete: 'cascade' }),
    lang: languageEnum('lang').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
  },
  (table) => ({
    themeLanguageIdx: index('theme_translations_theme_lang_idx').on(table.themeId, table.lang),
  }),
);

export const themeTranslationsRelations = relations(themeTranslations, ({ one }) => ({
  theme: one(themes, {
    fields: [themeTranslations.themeId],
    references: [themes.id],
  }),
}));

// ──────────────────────────────────────────────
// Questions
// ──────────────────────────────────────────────

export const questions = pgTable(
  'questions',
  {
    id: serial('id').primaryKey(),
    themeId: integer('theme_id')
      .notNull()
      .references(() => themes.id, { onDelete: 'cascade' }),
    type: questionTypeEnum('type').notNull().default('knowledge'),
    examTypes: text('exam_types').array().notNull().default(['csp', 'cr', 'nat']),
    difficulty: integer('difficulty').notNull().default(1),
    isPremium: boolean('is_premium').notNull().default(false),
    textFr: text('text_fr').notNull().unique(),
    explanationFr: text('explanation_fr'),
    choicesFr: jsonb('choices_fr').notNull().$type<
      { id: 'a' | 'b' | 'c' | 'd'; text: string }[]
    >(),
    correctChoice: choiceEnum('correct_choice').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    themeIdx: index('questions_theme_idx').on(table.themeId),
    difficultyIdx: index('questions_difficulty_idx').on(table.difficulty),
    premiumIdx: index('questions_premium_idx').on(table.isPremium),
    typeIdx: index('questions_type_idx').on(table.type),
  }),
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  theme: one(themes, {
    fields: [questions.themeId],
    references: [themes.id],
  }),
  translations: many(questionTranslations),
  examAnswers: many(examAnswers),
  practiceAnswers: many(practiceAnswers),
  comments: many(comments),
}));

export const questionTranslations = pgTable(
  'question_translations',
  {
    id: serial('id').primaryKey(),
    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    lang: languageEnum('lang').notNull(),
    text: text('text').notNull(),
    explanation: text('explanation'),
    choices: jsonb('choices').notNull().$type<{ id: 'a' | 'b' | 'c' | 'd'; text: string }[]>(),
  },
  (table) => ({
    questionLangUniq: uniqueIndex('question_translations_question_lang_uniq').on(
      table.questionId,
      table.lang,
    ),
  }),
);

export const questionTranslationsRelations = relations(questionTranslations, ({ one }) => ({
  question: one(questions, {
    fields: [questionTranslations.questionId],
    references: [questions.id],
  }),
}));

// ──────────────────────────────────────────────
// Fiches (revision sheets)
// ──────────────────────────────────────────────

export const fiches = pgTable(
  'fiches',
  {
    id: serial('id').primaryKey(),
    themeId: integer('theme_id')
      .notNull()
      .references(() => themes.id, { onDelete: 'cascade' }),
    titleFr: varchar('title_fr', { length: 255 }).notNull(),
    contentFr: text('content_fr').notNull(),
    displayOrder: integer('display_order').notNull().default(0),
    isPremium: boolean('is_premium').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    themeOrderUniq: uniqueIndex('fiches_theme_order_uniq').on(table.themeId, table.displayOrder),
    premiumIdx: index('fiches_premium_idx').on(table.isPremium),
  }),
);

export const fichesRelations = relations(fiches, ({ one, many }) => ({
  theme: one(themes, {
    fields: [fiches.themeId],
    references: [themes.id],
  }),
  translations: many(ficheTranslations),
}));

export const ficheTranslations = pgTable(
  'fiche_translations',
  {
    id: serial('id').primaryKey(),
    ficheId: integer('fiche_id')
      .notNull()
      .references(() => fiches.id, { onDelete: 'cascade' }),
    lang: languageEnum('lang').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
  },
  (table) => ({
    ficheLangUniq: uniqueIndex('fiche_translations_fiche_lang_uniq').on(table.ficheId, table.lang),
  }),
);

export const ficheTranslationsRelations = relations(ficheTranslations, ({ one }) => ({
  fiche: one(fiches, {
    fields: [ficheTranslations.ficheId],
    references: [fiches.id],
  }),
}));

// ──────────────────────────────────────────────
// Exam Sessions & Answers
// ──────────────────────────────────────────────

export const examSessions = pgTable(
  'exam_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    examType: examTypeEnum('exam_type').notNull().default('nat'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    timeLimitSec: integer('time_limit_sec').notNull().default(2700),
    score: integer('score'),
    totalQuestions: integer('total_questions').notNull().default(20),
    passed: boolean('passed'),
  },
  (table) => ({
    userIdx: index('exam_sessions_user_idx').on(table.userId),
    startedAtIdx: index('exam_sessions_started_at_idx').on(table.startedAt),
  }),
);

export const examSessionsRelations = relations(examSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [examSessions.userId],
    references: [users.id],
  }),
  answers: many(examAnswers),
}));

export const examAnswers = pgTable(
  'exam_answers',
  {
    id: serial('id').primaryKey(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => examSessions.id, { onDelete: 'cascade' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    selectedChoice: choiceEnum('selected_choice'),
    isCorrect: boolean('is_correct'),
    timeSpentMs: integer('time_spent_ms'),
  },
  (table) => ({
    sessionIdx: index('exam_answers_session_idx').on(table.sessionId),
    questionIdx: index('exam_answers_question_idx').on(table.questionId),
  }),
);

export const examAnswersRelations = relations(examAnswers, ({ one }) => ({
  session: one(examSessions, {
    fields: [examAnswers.sessionId],
    references: [examSessions.id],
  }),
  question: one(questions, {
    fields: [examAnswers.questionId],
    references: [questions.id],
  }),
}));

// ──────────────────────────────────────────────
// Practice Answers (free training mode)
// ──────────────────────────────────────────────

export const practiceAnswers = pgTable(
  'practice_answers',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    selectedChoice: choiceEnum('selected_choice').notNull(),
    isCorrect: boolean('is_correct').notNull(),
    timeSpentMs: integer('time_spent_ms'),
    answeredAt: timestamp('answered_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index('practice_answers_user_idx').on(table.userId),
    questionIdx: index('practice_answers_question_idx').on(table.questionId),
    userQuestionIdx: index('practice_answers_user_question_idx').on(
      table.userId,
      table.questionId,
    ),
  }),
);

export const practiceAnswersRelations = relations(practiceAnswers, ({ one }) => ({
  user: one(users, {
    fields: [practiceAnswers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [practiceAnswers.questionId],
    references: [questions.id],
  }),
}));

// ──────────────────────────────────────────────
// Social: Friendships
// ──────────────────────────────────────────────

export const friendships = pgTable(
  'friendships',
  {
    id: serial('id').primaryKey(),
    requesterId: uuid('requester_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    addresseeId: uuid('addressee_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: friendshipStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    requesterIdx: index('friendships_requester_idx').on(table.requesterId),
    addresseeIdx: index('friendships_addressee_idx').on(table.addresseeId),
    pairIdx: index('friendships_pair_idx').on(table.requesterId, table.addresseeId),
  }),
);

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  requester: one(users, {
    fields: [friendships.requesterId],
    references: [users.id],
    relationName: 'requester',
  }),
  addressee: one(users, {
    fields: [friendships.addresseeId],
    references: [users.id],
    relationName: 'addressee',
  }),
}));

// ──────────────────────────────────────────────
// Social: Challenges
// ──────────────────────────────────────────────

export const challenges = pgTable(
  'challenges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    challengerId: uuid('challenger_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    challengedId: uuid('challenged_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    themeId: integer('theme_id').references(() => themes.id, { onDelete: 'set null' }),
    questionCount: integer('question_count').notNull().default(10),
    status: challengeStatusEnum('status').notNull().default('pending'),
    challengerScore: integer('challenger_score'),
    challengedScore: integer('challenged_score'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
  },
  (table) => ({
    challengerIdx: index('challenges_challenger_idx').on(table.challengerId),
    challengedIdx: index('challenges_challenged_idx').on(table.challengedId),
    statusIdx: index('challenges_status_idx').on(table.status),
  }),
);

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  challenger: one(users, {
    fields: [challenges.challengerId],
    references: [users.id],
    relationName: 'challenger',
  }),
  challenged: one(users, {
    fields: [challenges.challengedId],
    references: [users.id],
    relationName: 'challenged',
  }),
  theme: one(themes, {
    fields: [challenges.themeId],
    references: [themes.id],
  }),
  answers: many(challengeAnswers),
}));

export const challengeAnswers = pgTable(
  'challenge_answers',
  {
    id: serial('id').primaryKey(),
    challengeId: uuid('challenge_id')
      .notNull()
      .references(() => challenges.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    selectedChoice: choiceEnum('selected_choice'),
    isCorrect: boolean('is_correct'),
    timeSpentMs: integer('time_spent_ms'),
  },
  (table) => ({
    challengeIdx: index('challenge_answers_challenge_idx').on(table.challengeId),
    userIdx: index('challenge_answers_user_idx').on(table.userId),
  }),
);

export const challengeAnswersRelations = relations(challengeAnswers, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeAnswers.challengeId],
    references: [challenges.id],
  }),
  user: one(users, {
    fields: [challengeAnswers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [challengeAnswers.questionId],
    references: [questions.id],
  }),
}));

// ──────────────────────────────────────────────
// Social: Comments
// ──────────────────────────────────────────────

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    parentId: integer('parent_id'),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index('comments_user_idx').on(table.userId),
    questionIdx: index('comments_question_idx').on(table.questionId),
    parentIdx: index('comments_parent_idx').on(table.parentId),
  }),
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [comments.questionId],
    references: [questions.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'replies',
  }),
  replies: many(comments, { relationName: 'replies' }),
}));
