ALTER TABLE "profiles" RENAME COLUMN "name" TO "first_name";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "last_name" text;