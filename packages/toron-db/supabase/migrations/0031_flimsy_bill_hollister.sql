ALTER TABLE "templates" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Only Users can do anything" ON "templates" CASCADE;--> statement-breakpoint
DROP TABLE "templates" CASCADE;--> statement-breakpoint
ALTER TABLE "template_exercises" RENAME TO "session_exercises";--> statement-breakpoint
ALTER TABLE "session_exercises" RENAME COLUMN "template_id" TO "session_id";--> statement-breakpoint
-- ALTER TABLE "sessions" DROP CONSTRAINT "sessions_template_id_templates_id_fk";
--> statement-breakpoint
-- ALTER TABLE "session_exercises" DROP CONSTRAINT "template_exercises_template_id_templates_id_fk";
--> statement-breakpoint
-- ALTER TABLE "session_exercises" DROP CONSTRAINT "template_exercises_exercise_id_exercises_id_fk";
--> statement-breakpoint
-- ALTER TABLE "session_exercises" DROP CONSTRAINT "template_exercises_muscle_group_id_muscle_groups_id_fk";
--> statement-breakpoint
-- ALTER TABLE "session_exercises" DROP CONSTRAINT "template_exercises_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "split_id" uuid;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "training_day_id" uuid;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "is_template" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_split_id_splits_id_fk" FOREIGN KEY ("split_id") REFERENCES "public"."splits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_training_day_id_training_days_id_fk" FOREIGN KEY ("training_day_id") REFERENCES "public"."training_days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessionsSplitIdIndex" ON "sessions" USING btree ("split_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessionsTrainingDayIdIndex" ON "sessions" USING btree ("training_day_id");--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "template_id";
