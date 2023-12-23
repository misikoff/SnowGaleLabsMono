ALTER TABLE "exercises" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "programId" uuid;--> statement-breakpoint
ALTER TABLE "setGroups" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "setGroups" ADD COLUMN "sessionId" uuid;--> statement-breakpoint
ALTER TABLE "setGroups" ADD COLUMN "programId" uuid;--> statement-breakpoint
ALTER TABLE "setGroups" ADD COLUMN "exerciseId" uuid;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "userId" uuid;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "sessionId" uuid;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "programId" uuid;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "exerciseId" uuid;--> statement-breakpoint
ALTER TABLE "sets" ADD COLUMN "setGroupId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "programs" ADD CONSTRAINT "programs_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_programId_programs_id_fk" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_programId_programs_id_fk" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_exerciseId_exercises_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_programId_programs_id_fk" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_exerciseId_exercises_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_setGroupId_setGroups_id_fk" FOREIGN KEY ("setGroupId") REFERENCES "setGroups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
