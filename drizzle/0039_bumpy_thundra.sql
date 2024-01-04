DO $$ BEGIN
 CREATE TYPE "distance_units" AS ENUM('yards', 'meters');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "equipment" AS ENUM('barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'band', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "weight_units" AS ENUM('lbs', 'kg');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "exercise_preferences" RENAME COLUMN "units" TO "weight_units";--> statement-breakpoint
ALTER TABLE "exercises" RENAME COLUMN "default_units" TO "default_weight_units";--> statement-breakpoint
ALTER TABLE "exercise_preferences" ALTER COLUMN "weight_units" SET DATA TYPE weight_units;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "default_rep_range" SET DATA TYPE rep_style;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "default_weight_units" SET DATA TYPE weight_units;--> statement-breakpoint
ALTER TABLE "exercise_preferences" ADD COLUMN "distance_increment" real;--> statement-breakpoint
ALTER TABLE "exercise_preferences" ADD COLUMN "distance_units" "distance_units";--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_distance_increment" real DEFAULT 5;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_distance_units" "distance_units" DEFAULT 'yards';