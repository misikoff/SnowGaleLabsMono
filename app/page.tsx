import { neon } from '@neondatabase/serverless'
import { eq, lt, gte, ne } from 'drizzle-orm'

import { db } from 'db'
import { playing_with_neon } from 'db/test/schema'

// async function getData() {
//   const sql = neon(process.env.DATABASE_URL!)

//   const response = await sql`SELECT * FROM playing_with_neon;`
//   console.log(response)
//   return response
// }

export default async function Home() {
  // const data = await getData()

  const data2 = await db
    .select()
    .from(playing_with_neon)
    .where(eq(playing_with_neon.id, 19))

  data2.forEach((d) => {
    console.log(d.x)
  })
  console.log({ data2 })

  // console.log({ woo: data })
  return <div />
}
