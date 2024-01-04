ALTER TABLE "exercise_preferences" DROP COLUMN IF EXISTS "rep_range";--> statement-breakpoint
ALTER TABLE "exercise_preferences" DROP COLUMN IF EXISTS "weight_increment";--> statement-breakpoint
ALTER TABLE "exercise_preferences" DROP COLUMN IF EXISTS "distance_increment";--> statement-breakpoint
ALTER TABLE "exercise_preferences" DROP COLUMN IF EXISTS "distance_units";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "default_rep_range";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "default_weight_increment";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "default_distance_increment";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "default_distance_units";