ALTER TABLE "exercises" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "programs" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "programId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "setGroups" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "setGroups" ALTER COLUMN "sessionId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "setGroups" ALTER COLUMN "programId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "setGroups" ALTER COLUMN "exerciseId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sets" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sets" ALTER COLUMN "sessionId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sets" ALTER COLUMN "programId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sets" ALTER COLUMN "exerciseId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sets" ALTER COLUMN "setGroupId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "prescribedReps" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "prescribedRPE" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "prescribedRIR" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "prescribedWeight" real DEFAULT 0;