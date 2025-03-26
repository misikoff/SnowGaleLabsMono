ALTER TABLE "session_muscle_groups" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Only Users can do anything" ON "session_muscle_groups" CASCADE;--> statement-breakpoint
DROP TABLE "session_muscle_groups" CASCADE;--> statement-breakpoint
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_muscle_group_id_muscle_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_current_split_id_splits_id_fk";
--> statement-breakpoint
ALTER TABLE "session_exercises" DROP CONSTRAINT "session_exercises_session_id_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "session_exercises" DROP CONSTRAINT "session_exercises_exercise_id_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "session_exercises" DROP CONSTRAINT "session_exercises_muscle_group_id_muscle_groups_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "usersClerkIdIndex";--> statement-breakpoint
ALTER TABLE "session_exercises" ALTER COLUMN "exercise_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_current_split_id_splits_id_fk" FOREIGN KEY ("current_split_id") REFERENCES "public"."splits"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
