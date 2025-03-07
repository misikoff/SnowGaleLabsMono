ALTER TABLE "splits" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "splits" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;