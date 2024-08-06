// import { db } from '../db'

export default async function Home() {
  // const user = await db.query.users.findFirst({
  //   with: {
  //     exercises: true,
  //   },
  // })

  // console.log({ user })
  // console.log({ exercises: user?.exercises })

  console.log('test')

  return (
    <div className='flex flex-col w-full items-center'>
      <div>Centurion</div>
      <div>Open Source Exercise</div>
    </div>
  )
}
