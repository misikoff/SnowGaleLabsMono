CREATE TABLE IF NOT EXISTS "microcycles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"order" integer,
	"user_id" integer,
	"program_id" integer
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "microcycle_id" integer;