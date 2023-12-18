CREATE TABLE IF NOT EXISTS "playing_with_neon" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"value" real
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "playing_with_neon" ("name");