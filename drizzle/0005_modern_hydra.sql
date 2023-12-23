ALTER TABLE "exercises" DROP CONSTRAINT "exercises_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "programs" DROP CONSTRAINT "programs_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_programId_programs_id_fk";
--> statement-breakpoint
ALTER TABLE "setGroups" DROP CONSTRAINT "setGroups_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "setGroups" DROP CONSTRAINT "setGroups_sessionId_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "setGroups" DROP CONSTRAINT "setGroups_programId_programs_id_fk";
--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_sessionId_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_programId_programs_id_fk";
--> statement-breakpoint
ALTER TABLE "sets" DROP CONSTRAINT "sets_exerciseId_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "programs" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "programId";--> statement-breakpoint
ALTER TABLE "setGroups" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "setGroups" DROP COLUMN IF EXISTS "sessionId";--> statement-breakpoint
ALTER TABLE "setGroups" DROP COLUMN IF EXISTS "programId";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "sessionId";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "programId";--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "exerciseId";