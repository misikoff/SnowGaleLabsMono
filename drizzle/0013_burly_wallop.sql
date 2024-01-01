CREATE TABLE IF NOT EXISTS "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"bio" varchar(256),
	"user_id" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "score" integer;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
