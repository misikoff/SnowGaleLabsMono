const org = process.env.TURSO_ORG
const token = process.env.TURSO_PLATFORM_API_TOKEN
const userSchema = process.env.TURSO_USER_SCHEMA
const group = process.env.TURSO_GROUP

import { createClient } from '@tursodatabase/api'

export async function POST(req: Request) {
  // get id from request body
  const { id } = await req.json()
  console.log('in create user')
  console.log({ org, token })

  const turso = createClient({
    org: org as string,
    token: token as string,
  })

  const database = await turso.databases.create('child-db-2', {
    group: group as string,
    schema: userSchema as string,
  })

  console.log({ database })

  return new Response('OK', { status: 200 })
}
