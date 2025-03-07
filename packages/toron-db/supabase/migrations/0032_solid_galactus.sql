ALTER TABLE "training_day_muscle_groups" RENAME TO "session_muscle_groups";--> statement-breakpoint
ALTER TABLE "session_muscle_groups" RENAME COLUMN "training_day_id" TO "session_id";--> statement-breakpoint
ALTER TABLE "session_muscle_groups" DROP CONSTRAINT "training_day_muscle_groups_training_day_id_training_days_id_fk";
--> statement-breakpoint
ALTER TABLE "session_muscle_groups" DROP CONSTRAINT "training_day_muscle_groups_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "session_muscle_groups" DROP CONSTRAINT "training_day_muscle_groups_muscle_group_id_muscle_groups_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_muscle_groups" ADD CONSTRAINT "session_muscle_groups_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_muscle_groups" ADD CONSTRAINT "session_muscle_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_muscle_groups" ADD CONSTRAINT "session_muscle_groups_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
