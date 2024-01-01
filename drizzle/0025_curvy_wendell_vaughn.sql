DROP TABLE "profiles";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "invited_by" integer;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "full_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "phone";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "address";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "score";