import * as dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'

dotenv.config({ path: '.env.local' })

export default {
  schema: './db/**/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    // host: process.env.DB_HOST!,
    // user: process.env.DB_USER!,
    // password: process.env.DB_PASSWORD!,
    // database: process.env.DB_DATABASE!,
    connectionString: process.env.DATABASE_URL!, //process.env.DB_URL,
    ssl: true,
  },
} satisfies Config
