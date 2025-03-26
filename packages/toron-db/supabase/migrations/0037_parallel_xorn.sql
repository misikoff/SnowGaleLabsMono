ALTER TABLE "profiles" ADD COLUMN "active_session_id" uuid;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "cloned_from_session_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_active_session_id_sessions_id_fk" FOREIGN KEY ("active_session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_cloned_from_session_id_sessions_id_fk" FOREIGN KEY ("cloned_from_session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
