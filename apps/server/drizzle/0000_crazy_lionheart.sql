CREATE TYPE "public"."challenge_status" AS ENUM('pending', 'active', 'completed', 'declined');--> statement-breakpoint
CREATE TYPE "public"."choice" AS ENUM('a', 'b', 'c', 'd');--> statement-breakpoint
CREATE TYPE "public"."exam_type" AS ENUM('csp', 'cr', 'nat');--> statement-breakpoint
CREATE TYPE "public"."friendship_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('fr', 'ar', 'fa', 'pt', 'es', 'hi');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('knowledge', 'situational');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenge_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"question_id" integer NOT NULL,
	"selected_choice" "choice",
	"is_correct" boolean,
	"time_spent_ms" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenger_id" uuid NOT NULL,
	"challenged_id" uuid NOT NULL,
	"theme_id" integer,
	"question_count" integer DEFAULT 10 NOT NULL,
	"status" "challenge_status" DEFAULT 'pending' NOT NULL,
	"challenger_score" integer,
	"challenged_score" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"question_id" integer NOT NULL,
	"parent_id" integer,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exam_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" integer NOT NULL,
	"selected_choice" "choice",
	"is_correct" boolean,
	"time_spent_ms" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exam_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"exam_type" "exam_type" DEFAULT 'nat' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"time_limit_sec" integer DEFAULT 2700 NOT NULL,
	"score" integer,
	"total_questions" integer DEFAULT 20 NOT NULL,
	"passed" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fiche_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"fiche_id" integer NOT NULL,
	"lang" "language" NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fiches" (
	"id" serial PRIMARY KEY NOT NULL,
	"theme_id" integer NOT NULL,
	"title_fr" varchar(255) NOT NULL,
	"content_fr" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "friendships" (
	"id" serial PRIMARY KEY NOT NULL,
	"requester_id" uuid NOT NULL,
	"addressee_id" uuid NOT NULL,
	"status" "friendship_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "practice_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"question_id" integer NOT NULL,
	"selected_choice" "choice" NOT NULL,
	"is_correct" boolean NOT NULL,
	"time_spent_ms" integer,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"lang" "language" NOT NULL,
	"text" text NOT NULL,
	"explanation" text,
	"choices" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"theme_id" integer NOT NULL,
	"type" "question_type" DEFAULT 'knowledge' NOT NULL,
	"exam_types" text[] DEFAULT '{"csp","cr","nat"}' NOT NULL,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"text_fr" text NOT NULL,
	"explanation_fr" text,
	"choices_fr" jsonb NOT NULL,
	"correct_choice" "choice" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "questions_text_fr_unique" UNIQUE("text_fr")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "theme_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"theme_id" integer NOT NULL,
	"lang" "language" NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "themes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(100) NOT NULL,
	"name_fr" varchar(255) NOT NULL,
	"icon" varchar(50) NOT NULL,
	"color" varchar(7) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "themes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"avatar_url" text,
	"preferred_lang" "language" DEFAULT 'fr' NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"premium_expires" timestamp with time zone,
	"stripe_customer_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge_answers" ADD CONSTRAINT "challenge_answers_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge_answers" ADD CONSTRAINT "challenge_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge_answers" ADD CONSTRAINT "challenge_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenges" ADD CONSTRAINT "challenges_challenger_id_users_id_fk" FOREIGN KEY ("challenger_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenges" ADD CONSTRAINT "challenges_challenged_id_users_id_fk" FOREIGN KEY ("challenged_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenges" ADD CONSTRAINT "challenges_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_session_id_exam_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."exam_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_sessions" ADD CONSTRAINT "exam_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fiche_translations" ADD CONSTRAINT "fiche_translations_fiche_id_fiches_id_fk" FOREIGN KEY ("fiche_id") REFERENCES "public"."fiches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fiches" ADD CONSTRAINT "fiches_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friendships" ADD CONSTRAINT "friendships_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friendships" ADD CONSTRAINT "friendships_addressee_id_users_id_fk" FOREIGN KEY ("addressee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "practice_answers" ADD CONSTRAINT "practice_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "practice_answers" ADD CONSTRAINT "practice_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_translations" ADD CONSTRAINT "question_translations_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "theme_translations" ADD CONSTRAINT "theme_translations_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenge_answers_challenge_idx" ON "challenge_answers" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenge_answers_user_idx" ON "challenge_answers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_challenger_idx" ON "challenges" USING btree ("challenger_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_challenged_idx" ON "challenges" USING btree ("challenged_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenges_status_idx" ON "challenges" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_user_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_question_idx" ON "comments" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_parent_idx" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exam_answers_session_idx" ON "exam_answers" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exam_answers_question_idx" ON "exam_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exam_sessions_user_idx" ON "exam_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exam_sessions_started_at_idx" ON "exam_sessions" USING btree ("started_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "fiche_translations_fiche_lang_uniq" ON "fiche_translations" USING btree ("fiche_id","lang");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "fiches_theme_order_uniq" ON "fiches" USING btree ("theme_id","display_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fiches_premium_idx" ON "fiches" USING btree ("is_premium");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friendships_requester_idx" ON "friendships" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friendships_addressee_idx" ON "friendships" USING btree ("addressee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friendships_pair_idx" ON "friendships" USING btree ("requester_id","addressee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "practice_answers_user_idx" ON "practice_answers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "practice_answers_question_idx" ON "practice_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "practice_answers_user_question_idx" ON "practice_answers" USING btree ("user_id","question_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "question_translations_question_lang_uniq" ON "question_translations" USING btree ("question_id","lang");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "questions_theme_idx" ON "questions" USING btree ("theme_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "questions_difficulty_idx" ON "questions" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "questions_premium_idx" ON "questions" USING btree ("is_premium");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "questions_type_idx" ON "questions" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "theme_translations_theme_lang_idx" ON "theme_translations" USING btree ("theme_id","lang");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_stripe_customer_idx" ON "users" USING btree ("stripe_customer_id");