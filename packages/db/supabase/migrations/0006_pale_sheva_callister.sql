ALTER TABLE "sets" RENAME COLUMN "excercise_id" TO "exercise_id";--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_excercise_id_exercises_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "set_exercise_id_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "set_exercise_id_idx" ON "sets" USING btree ("exercise_id");