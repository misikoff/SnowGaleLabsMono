const org = process.env.TURSO_ORG
const token = process.env.TURSO_PLATFORM_API_TOKEN
const userSchema = process.env.TURSO_USER_SCHEMA
const group = process.env.TURSO_GROUP

import { createClient } from '@tursodatabase/api'

export async function POST(req: Request) {
  console.log('in create user')
  console.log({ org, token })

  // const fetchReq = await fetch(
  //   `https://api.turso.tech/v1/organizations/${org}/databases`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       'Content-Type': 'application/json',
  //     },
  //     // body: '{\n      "name": "child-db",\n      "group": "default",\n      "schema": "parent-db"\n  }',
  //     body: JSON.stringify({
  //       // name: 'user-wow',
  //       // group: 'default',
  //       // schema: 'user-template',

  //       name: `${process.env.APP_NAME}-${organization.username}`,
  //       group: `${process.env.APP_GROUP}`,
  //       location: `${process.env.APP_PRIMARY_LOCATION}`,
  //     }),
  //   },
  // )

  // console.log({ fetchReq })

  const turso = createClient({
    org: org as string, // Your personal account or organization slug
    token: token as string, // Your personal access token
  })

  const database = await turso.databases.create('child-db-2', {
    group: group as string,
    schema: userSchema as string,
  })

  console.log({ database })

  return new Response('OK', { status: 200 })
}
