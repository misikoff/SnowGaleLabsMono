CREATE TABLE temp_table AS
SELECT
    id,
    name,
    CAST(clerk_id AS TEXT) AS clerk_id,
    db_url,
    created_at,
    updated_at,
    CAST(test AS INTEGER) AS test
FROM users;--> statement-breakpoint

DROP TABLE users;--> statement-breakpoint

ALTER TABLE temp_table RENAME TO users;

