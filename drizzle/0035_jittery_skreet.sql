CREATE TABLE IF NOT EXISTS "exercise_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"excercise_id" integer,
	"notes" varchar(256),
	"rep_range" varchar(256),
	"weight_increment" real
);
