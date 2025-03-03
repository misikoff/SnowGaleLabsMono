import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.local' })

// for handling supabase auth table
// https://github.com/supabase/supabase/issues/19883#issuecomment-2094656180
export default defineConfig({
  schemaFilter: ['public'],
  schema: './schema.ts',
  casing: 'snake_case',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
