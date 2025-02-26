CREATE TABLE IF NOT EXISTS "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"author" text,
	"category" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quotesCategoryIndex" ON "quotes" USING btree ("category");