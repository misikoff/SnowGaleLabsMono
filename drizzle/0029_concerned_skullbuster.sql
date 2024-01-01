CREATE TABLE IF NOT EXISTS "programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"description" varchar(256),
	"user_id" integer
);
