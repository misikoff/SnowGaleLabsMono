ALTER TABLE "profiles" ADD COLUMN "current_split_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_current_split_id_splits_id_fk" FOREIGN KEY ("current_split_id") REFERENCES "public"."splits"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
