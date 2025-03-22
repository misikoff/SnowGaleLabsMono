ALTER TABLE "session_muscle_groups" DROP CONSTRAINT "session_muscle_groups_session_id_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "session_muscle_groups" DROP CONSTRAINT "session_muscle_groups_muscle_group_id_muscle_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "session_muscle_groups" ALTER COLUMN "muscle_group_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_muscle_groups" ADD CONSTRAINT "session_muscle_groups_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_muscle_groups" ADD CONSTRAINT "session_muscle_groups_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
