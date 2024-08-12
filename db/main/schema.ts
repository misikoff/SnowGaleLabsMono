import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  clerkId: text('clerk_id'),
  dbUrl: text('db_url'),
  createdAt: integer('created_at').default(sql`(cast(unixepoch() as int))`),
  updatedAt: integer('updated_at').default(sql`(cast(unixepoch() as int))`),
})

export type User = typeof users.$inferSelect
