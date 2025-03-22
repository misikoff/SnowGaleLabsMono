ALTER TABLE "sets" DROP CONSTRAINT "sets_set_group_id_set_groups_id_fk";
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_training_day_id_training_days_id_fk";
ALTER TABLE "set_groups" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "training_days" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Only Users can do anything" ON "set_groups" CASCADE;--> statement-breakpoint
DROP TABLE "set_groups" CASCADE;--> statement-breakpoint
DROP POLICY "Only Users can do anything" ON "training_days" CASCADE;--> statement-breakpoint
DROP TABLE "training_days" CASCADE;--> statement-breakpoint
--> statement-breakpoint
--> statement-breakpoint
DROP INDEX IF EXISTS "sessionsTrainingDayIdIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "setsSetGroupIdIndex";--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "order" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "split_template_id" uuid;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "session_exercise_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_split_template_id_splits_id_fk" FOREIGN KEY ("split_template_id") REFERENCES "public"."splits"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_session_exercise_id_session_exercises_id_fk" FOREIGN KEY ("session_exercise_id") REFERENCES "public"."session_exercises"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessionsSplitTemplateIdIndex" ON "sessions" USING btree ("split_template_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setsSessionExerciseIdIndex" ON "sets" USING btree ("session_exercise_id");--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "training_day_id";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "is_template";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "set_group_id";
