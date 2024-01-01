CREATE TABLE IF NOT EXISTS "profile_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"metadata" text
);
--> statement-breakpoint
DROP TABLE "posts";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_info" ADD CONSTRAINT "profile_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
