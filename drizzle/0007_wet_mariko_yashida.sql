ALTER TABLE "sets" DROP CONSTRAINT "sets_setGroupId_setGroups_id_fk";
--> statement-breakpoint
ALTER TABLE "sets" DROP COLUMN IF EXISTS "setGroupId";