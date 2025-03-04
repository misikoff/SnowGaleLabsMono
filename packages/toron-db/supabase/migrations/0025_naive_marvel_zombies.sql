ALTER TABLE "template_exercises" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "training_day_muscle_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "template_exercises" ADD COLUMN "user_id" uuid DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "training_day_muscle_groups" ADD COLUMN "user_id" uuid DEFAULT auth.uid();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "template_exercises" ADD CONSTRAINT "template_exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_day_muscle_groups" ADD CONSTRAINT "training_day_muscle_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE POLICY "Only Users can do anything" ON "template_exercises" AS PERMISSIVE FOR ALL TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Only Users can do anything" ON "training_day_muscle_groups" AS PERMISSIVE FOR ALL TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (true);