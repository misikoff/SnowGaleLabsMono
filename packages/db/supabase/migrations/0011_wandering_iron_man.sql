DROP INDEX IF EXISTS "exercise_is_main_exercise_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "exercise_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "exercise_cloned_from_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "macro_cycle_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "microcyle_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "program_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "session_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "set_group_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "set_group_session_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "set_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "set_session_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "set_exercise_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "set_set_group_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "clerk_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercises_is_main_exercise_index" ON "exercises" USING btree ("is_main_exercise");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercises_user_id_index" ON "exercises" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercises_cloned_from_id_index" ON "exercises" USING btree ("cloned_from_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "macrocycles_user_id_index" ON "macrocycles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "microcycles_user_id_index" ON "microcycles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "programs_user_id_index" ON "programs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_id_index" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setGroups_user_id_index" ON "setGroups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setGroups_session_id_index" ON "setGroups" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sets_user_id_index" ON "sets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sets_session_id_index" ON "sets" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sets_exercise_id_index" ON "sets" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sets_set_group_id_index" ON "sets" USING btree ("set_group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_clerk_id_index" ON "users" USING btree ("clerk_id");