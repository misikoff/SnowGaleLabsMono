ALTER TABLE "exercise_preferences" ADD COLUMN "rep_range" "rep_style";--> statement-breakpoint
ALTER TABLE "exercise_preferences" ADD COLUMN "weight_increment" real;--> statement-breakpoint
ALTER TABLE "exercise_preferences" ADD COLUMN "weight_units" "weight_units";--> statement-breakpoint
ALTER TABLE "exercise_preferences" ADD COLUMN "distance_increment" real;--> statement-breakpoint
ALTER TABLE "exercise_preferences" ADD COLUMN "distance_units" "distance_units";--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_rep_range" "rep_style" DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_weight_increment" real DEFAULT 5;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_weight_units" "weight_units" DEFAULT 'lbs';--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_distance_increment" real DEFAULT 5;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "default_distance_units" "distance_units" DEFAULT 'yards';