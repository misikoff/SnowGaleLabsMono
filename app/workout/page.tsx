import Link from 'next/link'
import { neon } from '@neondatabase/serverless'

async function getData() {
  const sql = neon(process.env.DATABASE_URL!)

  const response = await sql`SELECT * FROM playing_with_neon;`
  console.log(response)
  return response
}

export default async function Home() {
  const data = await getData()
  console.log({ woo: data })
  return (
    <div>
      <div>Workout</div>

      <Link
        href='/workout/wow'
        className='text-gray-600 group-hover:text-gray-700 flex flex-col items-center gap-y-2 px-1 text-sm font-medium transition-colors duration-150'
      >
        workout 1
      </Link>
    </div>
  )
}
