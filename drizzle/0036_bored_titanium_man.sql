DO $$ BEGIN
 CREATE TYPE "rep_style" AS ENUM('high', 'medium', 'low');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "units" AS ENUM('lbs', 'kg');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "exercise_preferences" ALTER COLUMN "rep_range" SET DATA TYPE rep_style;--> statement-breakpoint
ALTER TABLE "exercise_preferences" ADD COLUMN "units" "units";--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_rep_range" varchar(256);--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_weight_increment" real DEFAULT 5;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_units" "units" DEFAULT 'lbs';