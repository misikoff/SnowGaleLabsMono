CREATE TABLE IF NOT EXISTS "muscle_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "muscle_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "splits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text,
	"description" text,
	"rir_target" smallint DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "template_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"muscle_group_id" uuid NOT NULL,
	"order" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "training_day_muscle_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"training_day_id" uuid NOT NULL,
	"muscle_group_id" uuid NOT NULL,
	"order" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "traingDays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"split_id" uuid,
	"name" text,
	"description" text,
	"order" smallint DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_program_id_programs_id_fk";
ALTER TABLE "sets" DROP CONSTRAINT "sets_program_id_programs_id_fk";
ALTER TABLE "programs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "templates" DROP CONSTRAINT "templates_program_id_programs_id_fk";
DROP TABLE "programs" CASCADE;--> statement-breakpoint
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_cloned_from_id_exercises_id_fk";
--> statement-breakpoint
--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_template_id_templates_id_fk";
--> statement-breakpoint
ALTER TABLE "templates" DROP CONSTRAINT "templates_user_id_users_id_fk";
--> statement-breakpoint
--> statement-breakpoint
DROP INDEX IF EXISTS "exercisesUserIdIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "exercisesClonedFromIdIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "templatesUserIdIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "templatesProgramIdIndex";--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "muscle_group_id" uuid;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "training_day_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "splits" ADD CONSTRAINT "splits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "template_exercises" ADD CONSTRAINT "template_exercises_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "template_exercises" ADD CONSTRAINT "template_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "template_exercises" ADD CONSTRAINT "template_exercises_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_day_muscle_groups" ADD CONSTRAINT "training_day_muscle_groups_training_day_id_traingDays_id_fk" FOREIGN KEY ("training_day_id") REFERENCES "public"."traingDays"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_day_muscle_groups" ADD CONSTRAINT "training_day_muscle_groups_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "traingDays" ADD CONSTRAINT "traingDays_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "traingDays" ADD CONSTRAINT "traingDays_split_id_splits_id_fk" FOREIGN KEY ("split_id") REFERENCES "public"."splits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "programsUserIdIndex" ON "splits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trainingDaysUserIdIndex" ON "traingDays" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trainingDaysSplitIdIndex" ON "traingDays" USING btree ("split_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "templates" ADD CONSTRAINT "templates_training_day_id_traingDays_id_fk" FOREIGN KEY ("training_day_id") REFERENCES "public"."traingDays"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercisesMuscleGroupIdIndex" ON "exercises" USING btree ("muscle_group_id");--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "cloned_from_id";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "program_id";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "program_id";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "template_id";--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN IF EXISTS "program_id";
