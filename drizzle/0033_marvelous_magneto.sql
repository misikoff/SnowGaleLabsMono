CREATE TABLE IF NOT EXISTS "sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"session_id" integer,
	"program_id" integer,
	"excercise_id" integer,
	"set_group_id" integer,
	"prescribedReps" integer DEFAULT 0,
	"prescribedRPE" real DEFAULT 0,
	"prescribedRIR" real DEFAULT 0,
	"prescribedWeight" real DEFAULT 0,
	"reps" integer DEFAULT 0,
	"RPE" real DEFAULT 0,
	"RIR" integer DEFAULT 0,
	"weight" real DEFAULT 0,
	"order" integer
);
