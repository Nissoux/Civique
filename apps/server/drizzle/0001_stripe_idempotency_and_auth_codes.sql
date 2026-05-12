CREATE TABLE IF NOT EXISTS "stripe_events_processed" (
	"event_id" varchar(255) PRIMARY KEY NOT NULL,
	"event_type" varchar(255) NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_codes" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"user_id" uuid NOT NULL,
	"payload" jsonb,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_codes_type_check" CHECK ("type" IN ('email_verify', 'password_reset'))
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_codes" ADD CONSTRAINT "auth_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_codes_expires_idx" ON "auth_codes" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_codes_user_idx" ON "auth_codes" USING btree ("user_id");
