import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schemas from './test/schema'

neonConfig.fetchConnectionCache = true

const schema = {
  ...schemas,
}
const sql = neon(process.env.DATABASE_URL!) // neon(process.env.DRIZZLE_DATABASE_URL!)
const db = drizzle(sql, { schema })

export { db }
