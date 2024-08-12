import Link from 'next/link'

import { getSessions } from 'app/app/actions'

import CreateSessionButton from './createSessionButton'

export default async function Workout() {
  const sessions = await getSessions()
  console.log({ sessions })
  return (
    <div>
      <h1>Workouts</h1>
      <CreateSessionButton />
      {/* list all the most recent workouts or scheduled workouts here */}
      <div className='flex flex-col'>
        {sessions.map((s) => (
          <Link
            key={`session-${s.id}`}
            href={`workout/${s.id}`}
            className='block'
          >
            {s.id}
          </Link>
        ))}
      </div>
    </div>
  )
}
