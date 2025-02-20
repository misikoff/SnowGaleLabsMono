DROP INDEX IF EXISTS "is_main_exercise_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_id_idx";--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "cloned_from_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_cloned_from_id_exercises_id_fk" FOREIGN KEY ("cloned_from_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercise_is_main_exercise_idx" ON "exercises" USING btree ("is_main_exercise");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercise_user_id_idx" ON "exercises" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercise_cloned_from_id_idx" ON "exercises" USING btree ("cloned_from_id");--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "main_exercise_id";