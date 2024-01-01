ALTER TABLE "users" DROP CONSTRAINT "users_profileId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "profileId";