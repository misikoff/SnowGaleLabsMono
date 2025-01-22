DROP INDEX IF EXISTS "exercises_is_main_exercise_index";--> statement-breakpoint
DROP INDEX IF EXISTS "exercises_user_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "exercises_cloned_from_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "macrocycles_user_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "microcycles_user_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "programs_user_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "sessions_user_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "setGroups_user_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "setGroups_session_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "sets_user_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "sets_session_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "sets_exercise_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "sets_set_group_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "users_clerk_id_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercisesIsMainExerciseIndex" ON "exercises" USING btree ("is_main_exercise");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercisesUserIdIndex" ON "exercises" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercisesClonedFromIdIndex" ON "exercises" USING btree ("cloned_from_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "macrocyclesUserIdIndex" ON "macrocycles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "microcyclesUserIdIndex" ON "microcycles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "programsUserIdIndex" ON "programs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessionsUserIdIndex" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setGroupsUserIdIndex" ON "setGroups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setGroupsSessionIdIndex" ON "setGroups" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setsUserIdIndex" ON "sets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setsSessionIdIndex" ON "sets" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setsExerciseIdIndex" ON "sets" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "setsSetGroupIdIndex" ON "sets" USING btree ("set_group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "usersClerkIdIndex" ON "users" USING btree ("id");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "clerk_id";