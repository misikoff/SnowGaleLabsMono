import { db } from '../db'

export default async function Home() {
  const user = await db.query.users.findFirst({
    with: {
      exercises: true,
    },
  })

  console.log({ user })
  console.log({ exercises: user?.exercises })

  console.log('test')

  return <div>s </div>
}
