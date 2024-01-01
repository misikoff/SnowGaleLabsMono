CREATE TABLE IF NOT EXISTS "setGroups" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer,
	"program_id" integer,
	"excercise_id" integer,
	"order" integer
);
--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "programs_id" TO "program_id";