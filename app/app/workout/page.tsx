'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import { deleteSession, getSessions } from 'app/app/actions'
import { Session } from 'db/schema'

import CreateSessionButton from './createSessionButton'

export default function Workout() {
  const [sessions, setSessions] = useState<Session[]>([])
  useEffect(() => {
    async function setData() {
      const sessions = await getSessions()
      setSessions(sessions)
    }
    setData()
  }, [])

  return (
    <div>
      <h1>Workouts</h1>
      <CreateSessionButton />
      {/* list all the most recent workouts or scheduled workouts here */}
      <div className='flex flex-col'>
        {sessions.map((s) => (
          <div key={`session-${s.id}`} className='flex space-x-4'>
            <Link href={`workout/${s.id}`} className='block'>
              {s.id}
            </Link>
            {s.completed && <Badge>complete</Badge>}
            <Button
              onClick={async () => {
                await deleteSession(s.id)
                setSessions(sessions.filter((session) => session.id !== s.id))
              }}
            >
              delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
