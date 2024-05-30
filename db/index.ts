import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schemas from './test/schema'

const schema = {
  ...schemas,
}

const sql: NeonQueryFunction<boolean, boolean> = neon(process.env.DATABASE_URL!) // neon(process.env.DRIZZLE_DATABASE_URL!)
const db = drizzle(sql, { schema })

export { db }
