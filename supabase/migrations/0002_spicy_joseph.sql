ALTER TABLE "setGroups" DROP CONSTRAINT "setGroups_session_id_sessions_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
