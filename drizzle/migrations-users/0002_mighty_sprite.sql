CREATE TABLE `exercise_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`excercise_id` integer,
	`notes` text(256),
	`rep_range` text,
	`weight_increment` real,
	`weight_units` text,
	`distance_increment` real,
	`distance_units` text
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(256),
	`description` text(256),
	`equipment_type` text,
	`default_rep_range` text DEFAULT 'medium',
	`default_weight_increment` real DEFAULT 5,
	`default_weight_units` text DEFAULT 'lbs',
	`use_weight` integer DEFAULT true,
	`use_Distance` integer DEFAULT false,
	`default_distance_increment` real DEFAULT 5,
	`default_distance_units` text DEFAULT 'yards'
);
--> statement-breakpoint
CREATE TABLE `microcycles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(256),
	`order` integer,
	`program_id` integer
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(256),
	`description` text(256)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(256),
	`microcycle_id` integer,
	`program_id` integer,
	`order` integer
);
--> statement-breakpoint
CREATE TABLE `setGroups` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` integer,
	`microcycle_id` integer,
	`program_id` integer,
	`excercise_id` integer,
	`order` integer
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` integer,
	`microcycle_id` integer,
	`program_id` integer,
	`excercise_id` integer,
	`set_group_id` integer,
	`prescribed_reps` integer DEFAULT 0,
	`prescribed_RPE` real DEFAULT 0,
	`prescribed_RIR` real DEFAULT 0,
	`prescribed_weight` real DEFAULT 0,
	`reps` integer DEFAULT 0,
	`RPE` real DEFAULT 0,
	`RIR` integer DEFAULT 0,
	`weight` real DEFAULT 0,
	`order` integer,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
DROP TABLE `agents`;--> statement-breakpoint
DROP TABLE `conversations`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
DROP TABLE `tickets`;