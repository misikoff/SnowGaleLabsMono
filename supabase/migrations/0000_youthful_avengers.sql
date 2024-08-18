CREATE TABLE IF NOT EXISTS "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"is_main_exercise" boolean DEFAULT false,
	"main_exercise_id" uuid,
	"name" text,
	"description" text,
	"equipment_type" text,
	"default_rep_range" text DEFAULT 'medium',
	"weight_increment" real DEFAULT 5,
	"weight_units" text DEFAULT 'lbs',
	"use_weight" boolean DEFAULT true,
	"use_Distance" boolean DEFAULT false,
	"distance_increment" real DEFAULT 5,
	"distance_units" text DEFAULT 'yards',
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "macrocycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"program_id" uuid,
	"name" text,
	"order" smallint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "microcycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"program_id" uuid,
	"macrocycle_id" uuid,
	"name" text,
	"order" smallint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text,
	"program_id" uuid,
	"macrocycle_id" uuid,
	"microcycle_id" uuid,
	"order" smallint,
	"completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "setGroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" uuid,
	"microcycle_id" uuid,
	"program_id" uuid,
	"type" text DEFAULT 'normal',
	"exercise_id" uuid,
	"order" smallint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" uuid NOT NULL,
	"microcycle_id" uuid,
	"program_id" uuid,
	"excercise_id" uuid NOT NULL,
	"set_group_id" uuid NOT NULL,
	"prescribed_reps" integer DEFAULT 0,
	"prescribed_RPE" real DEFAULT 0,
	"prescribed_RIR" real DEFAULT 0,
	"prescribed_weight" real DEFAULT 0,
	"reps" integer DEFAULT 0,
	"RPE" real DEFAULT 0,
	"RIR" integer DEFAULT 0,
	"weight" real DEFAULT 0,
	"order" smallint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"clerk_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "macrocycles" ADD CONSTRAINT "macrocycles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "macrocycles" ADD CONSTRAINT "macrocycles_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "microcycles" ADD CONSTRAINT "microcycles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "microcycles" ADD CONSTRAINT "microcycles_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "microcycles" ADD CONSTRAINT "microcycles_macrocycle_id_macrocycles_id_fk" FOREIGN KEY ("macrocycle_id") REFERENCES "public"."macrocycles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "programs" ADD CONSTRAINT "programs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_macrocycle_id_macrocycles_id_fk" FOREIGN KEY ("macrocycle_id") REFERENCES "public"."macrocycles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_microcycle_id_microcycles_id_fk" FOREIGN KEY ("microcycle_id") REFERENCES "public"."microcycles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_microcycle_id_microcycles_id_fk" FOREIGN KEY ("microcycle_id") REFERENCES "public"."microcycles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setGroups" ADD CONSTRAINT "setGroups_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_microcycle_id_microcycles_id_fk" FOREIGN KEY ("microcycle_id") REFERENCES "public"."microcycles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_excercise_id_exercises_id_fk" FOREIGN KEY ("excercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_set_group_id_setGroups_id_fk" FOREIGN KEY ("set_group_id") REFERENCES "public"."setGroups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_main_exercise_idx" ON "exercises" USING btree ("is_main_exercise");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "exercises" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "macro_cycle_user_id_idx" ON "macrocycles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "microcyle_user_id_idx" ON "microcycles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "program_user_id_idx" ON "programs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "set_group_user_id_idx" ON "setGroups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "set_group_session_id_idx" ON "setGroups" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "set_user_id_idx" ON "sets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "set_session_id_idx" ON "sets" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "set_exercise_id_idx" ON "sets" USING btree ("excercise_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "set_set_group_id_idx" ON "sets" USING btree ("set_group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_id_idx" ON "users" USING btree ("clerk_id");