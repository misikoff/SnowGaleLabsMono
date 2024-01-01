DROP TABLE "profiles";--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "programs" DROP CONSTRAINT "programs_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "setGroups" DROP CONSTRAINT "setGroups_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "programs" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "setGroups" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "userId";