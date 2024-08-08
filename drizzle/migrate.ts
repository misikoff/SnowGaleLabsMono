// this kind of migration file may not be needed, given db:push is available
// a similar file could be constructed for the users database if necessary
// if it is not needed, tsx packagaes can be removed from the project
// https://andriisherman.medium.com/migrations-with-drizzle-just-got-better-push-to-sqlite-is-here-c6c045c5d0fb

import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
// import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
dotenv.config({ path: '.env.local' })

console.log('url', process.env.TURSO_DB_URL)

export const client = createClient({
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
})

export const db = drizzle(client)

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: 'drizzle/migrations',
    })
    console.log('Tables migrated!')
    process.exit(0)
  } catch (error) {
    console.error('Error performing migration: ', error)
    process.exit(1)
  }
}

main()
