ALTER TABLE "auth.users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "auth.users" CASCADE;--> statement-breakpoint
-- ALTER TABLE "profiles" DROP CONSTRAINT "profiles_id_auth.users_id_fk";
--> statement-breakpoint
-- ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_auth.users_id_fk";
--> statement-breakpoint
-- ALTER TABLE "set_groups" DROP CONSTRAINT "set_groups_user_id_auth.users_id_fk";
--> statement-breakpoint
-- ALTER TABLE "sets" DROP CONSTRAINT "sets_user_id_auth.users_id_fk";
--> statement-breakpoint
-- ALTER TABLE "splits" DROP CONSTRAINT "splits_user_id_auth.users_id_fk";
--> statement-breakpoint
-- ALTER TABLE "templates" DROP CONSTRAINT "templates_user_id_auth.users_id_fk";
--> statement-breakpoint
-- ALTER TABLE "training_days" DROP CONSTRAINT "training_days_user_id_auth.users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "authUsersClerkIdIndex";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set_groups" ADD CONSTRAINT "set_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "splits" ADD CONSTRAINT "splits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_days" ADD CONSTRAINT "training_days_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "usersClerkIdIndex" ON "profiles" USING btree ("id");
