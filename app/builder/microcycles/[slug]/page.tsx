'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Button } from 'components/ui/button'
import {
  createSession,
  deleteSession,
  getMicrocycleWithSessions,
} from 'app/app/actions'

// https://stackoverflow.com/questions/59774572/how-to-get-the-return-type-of-async-function-in-typescript
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any

// make sure button is not clickable when running
export default function Home({ params }: { params: { slug: string } }) {
  const [microcycle, setMicrocycle] =
    useState<AsyncReturnType<typeof getMicrocycleWithSessions>>()

  useEffect(() => {
    async function setData() {
      const microcycle1 = await getMicrocycleWithSessions(parseInt(params.slug))
      setMicrocycle(microcycle1)
      console.log(microcycle1)
    }
    setData()
  }, [params.slug])

  function getNextOrder() {
    return (microcycle?.sessions?.length ?? 0) + 1
  }

  return (
    <>
      {microcycle && (
        <div className='flex flex-col'>
          {/* <div>{program.name}</div>
          <div>{program.description}</div> */}

          <div className='text-xl'>Add Session</div>
          <Button
            onClick={async () => {
              console.log('button clicked')
              await createSession({
                order: getNextOrder(),
                programId: microcycle.programId || undefined,
                userId: microcycle.userId || undefined,
                microcycleId: microcycle.id,
              })
              setMicrocycle(
                await getMicrocycleWithSessions(parseInt(params.slug)),
              )
              console.log('done')
            }}
          >
            add session
          </Button>
          {microcycle?.sessions?.length > 0 && (
            <>
              <Button
                onClick={async () => {
                  const numSessions = microcycle.sessions.length
                  await deleteSession(microcycle.sessions[numSessions - 1].id)
                  setMicrocycle(
                    await getMicrocycleWithSessions(parseInt(params.slug)),
                  )
                }}
              >
                remove session
              </Button>

              <div>Sessions</div>
              {microcycle.sessions.map((s) => (
                <div key={s.id} className='flex'>
                  <span>
                    <Link
                      key={s.id}
                      href={`/builder/sessions/${s.id}`}
                      className='hover:text-blue-400'
                    >
                      {s.id}: {s.order}
                    </Link>
                  </span>
                  <Button
                    onClick={async () => {
                      await deleteSession(s.id)
                      setMicrocycle(
                        await getMicrocycleWithSessions(parseInt(params.slug)),
                      )
                    }}
                  >
                    -
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  )
}
