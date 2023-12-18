import { currentUser } from '@clerk/nextjs'
import { neon } from '@neondatabase/serverless'

async function getData() {
  const sql = neon(process.env.DATABASE_URL!)

  const response = await sql`SELECT * FROM playing_with_neon;`
  console.log(response)
  return response
}

export default async function Home() {
  const user = await currentUser()
  console.log({ user })

  const data = await getData()
  console.log({ woo: data })
  return (
    <div>
      {data.map((d: any) => (
        <div key={d.id}>{d.name}</div>
      ))}
      id: {user?.id}
    </div>
  )
}
