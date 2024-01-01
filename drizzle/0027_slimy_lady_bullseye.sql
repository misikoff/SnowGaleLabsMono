CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"author_id" integer
);
--> statement-breakpoint
DROP TABLE "profile_info";