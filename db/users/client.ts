import { createClient } from '@libsql/client/http'
import { drizzle } from 'drizzle-orm/libsql'

import * as schema from 'db/users/schema'

export interface Env {
  url: string
  TURSO_DB_AUTH_TOKEN?: string
}

export function buildSchemaDbClient() {
  const url = process.env.TURSO_USERS_DB_URL
  if (url === undefined) {
    throw new Error('TURSO_USERS_DB_URL is not defined')
  }

  const authToken = (process.env as unknown as Env).TURSO_DB_AUTH_TOKEN?.trim()
  if (authToken === undefined) {
    throw new Error('TURSO_DB_AUTH_TOKEN is not defined')
  }

  return drizzle(createClient({ url, authToken }), {
    schema,
  })
}

export function buildDbClient({ url }: Env) {
  if (url === undefined) {
    throw new Error('db url is not defined')
  }

  const authToken = (process.env as unknown as Env).TURSO_DB_AUTH_TOKEN?.trim()
  if (authToken === undefined) {
    throw new Error('TURSO_DB_AUTH_TOKEN is not defined')
  }

  return drizzle(createClient({ url: `libsql://${url}`, authToken }), {
    schema,
  })
}
