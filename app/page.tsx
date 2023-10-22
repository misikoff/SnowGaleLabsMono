import { neon } from '@neondatabase/serverless'

import Button from 'components/button'
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
      <span className='block pb-4'>Home Page</span>
      <a
        className='underline hover:text-blue-400'
        href='https://github.com/misikoff/next-starter-template'
      >
        Source Code
      </a>
      {data.toString()}
      <Button />
    </div>
  )
}
