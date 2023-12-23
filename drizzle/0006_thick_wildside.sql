ALTER TABLE "setGroups" DROP CONSTRAINT "setGroups_exerciseId_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "setGroups" DROP COLUMN IF EXISTS "exerciseId";