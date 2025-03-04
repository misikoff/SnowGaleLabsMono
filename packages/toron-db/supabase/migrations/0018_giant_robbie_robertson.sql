ALTER TABLE "setGroups" RENAME TO "set_groups";--> statement-breakpoint
ALTER TABLE "traingDays" RENAME TO "training_days";--> statement-breakpoint
ALTER TABLE "set_groups" DROP CONSTRAINT "setGroups_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "set_groups" DROP CONSTRAINT "setGroups_session_id_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "set_groups" DROP CONSTRAINT "setGroups_exercise_id_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_set_group_id_setGroups_id_fk";
--> statement-breakpoint
ALTER TABLE "templates" DROP CONSTRAINT "templates_training_day_id_traingDays_id_fk";
--> statement-breakpoint
ALTER TABLE "training_day_muscle_groups" DROP CONSTRAINT "training_day_muscle_groups_training_day_id_traingDays_id_fk";
--> statement-breakpoint
ALTER TABLE "training_days" DROP CONSTRAINT "traingDays_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "training_days" DROP CONSTRAINT "traingDays_split_id_splits_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set_groups" ADD CONSTRAINT "set_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set_groups" ADD CONSTRAINT "set_groups_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set_groups" ADD CONSTRAINT "set_groups_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_set_group_id_set_groups_id_fk" FOREIGN KEY ("set_group_id") REFERENCES "public"."set_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "templates" ADD CONSTRAINT "templates_training_day_id_training_days_id_fk" FOREIGN KEY ("training_day_id") REFERENCES "public"."training_days"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_day_muscle_groups" ADD CONSTRAINT "training_day_muscle_groups_training_day_id_training_days_id_fk" FOREIGN KEY ("training_day_id") REFERENCES "public"."training_days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_days" ADD CONSTRAINT "training_days_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_days" ADD CONSTRAINT "training_days_split_id_splits_id_fk" FOREIGN KEY ("split_id") REFERENCES "public"."splits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
