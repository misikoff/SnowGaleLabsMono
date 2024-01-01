CREATE TABLE IF NOT EXISTS "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"user_id" integer,
	"programs_id" integer,
	"order" integer
);
