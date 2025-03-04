CREATE TABLE IF NOT EXISTS "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"program_id" uuid,
	"name" text,
	"description" text,
	"order" smallint DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "macrocycles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "microcycles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_macrocycle_id_macrocycles_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_microcycle_id_microcycles_id_fk";
--> statement-breakpoint
ALTER TABLE "setGroups" DROP CONSTRAINT "setGroups_microcycle_id_microcycles_id_fk";
--> statement-breakpoint
ALTER TABLE "setGroups" DROP CONSTRAINT "setGroups_program_id_programs_id_fk";
--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_microcycle_id_microcycles_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "exercisesIsMainExerciseIndex";--> statement-breakpoint
ALTER TABLE "sets" ALTER COLUMN "reps" SET DATA TYPE smallint;--> statement-breakpoint
ALTER TABLE "sets" ALTER COLUMN "rir" SET DATA TYPE smallint;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "rir_target" smallint DEFAULT 0;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "template_id" uuid;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "template_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "templates" ADD CONSTRAINT "templates_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "templatesUserIdIndex" ON "templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "templatesProgramIdIndex" ON "templates" USING btree ("program_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "is_main_exercise";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "default_rep_range";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "use_weight";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "use_distance";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "distance_increment";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "distance_units";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "macrocycle_id";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "microcycle_id";--> statement-breakpoint
ALTER TABLE "setGroups" DROP COLUMN IF EXISTS "microcycle_id";--> statement-breakpoint
ALTER TABLE "setGroups" DROP COLUMN IF EXISTS "program_id";--> statement-breakpoint
ALTER TABLE "setGroups" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "microcycle_id";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "prescribed_reps";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "prescribed_rpe";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "prescribed_rir";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "prescribed_weight";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "rpe";
