ALTER TABLE "exercises" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "muscle_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "quotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "splits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "training_days" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "set_groups" ALTER COLUMN "user_id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "sets" ALTER COLUMN "user_id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "splits" ALTER COLUMN "user_id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "user_id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "training_days" ALTER COLUMN "user_id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER POLICY "policy" ON "set_groups" RENAME TO "Only Users can do anything";--> statement-breakpoint
CREATE POLICY "Read Only Policy" ON "exercises" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Read Only Policy" ON "muscle_groups" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Only Users can do anything" ON "profiles" AS PERMISSIVE FOR ALL TO "authenticated" USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Read Only Policy" ON "quotes" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Only Users can do anything" ON "sessions" AS PERMISSIVE FOR ALL TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Only Users can do anything" ON "sets" AS PERMISSIVE FOR ALL TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Only Users can do anything" ON "splits" AS PERMISSIVE FOR ALL TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Only Users can do anything" ON "templates" AS PERMISSIVE FOR ALL TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Only Users can do anything" ON "training_days" AS PERMISSIVE FOR ALL TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (true);