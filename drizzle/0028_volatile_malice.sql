CREATE TABLE IF NOT EXISTS "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"description" varchar(256),
	"user_id" integer
);
--> statement-breakpoint
DROP TABLE "posts";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" integer;