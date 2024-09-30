'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Exercise } from '@repo/db/schema'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createSetGroup,
  deleteSetGroup,
  getExercises,
  getSessionWithSetGroups,
} from 'app/app/actions'

// https://stackoverflow.com/questions/59774572/how-to-get-the-return-type-of-async-function-in-typescript
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any

// make sure button is not clickable when running
export default function Home({ params }: { params: { slug: string } }) {
  const [session, setSession] =
    useState<AsyncReturnType<typeof getSessionWithSetGroups>>()
  const [exercises, setExercises] = useState<Exercise[]>()
  const [exerciseId, setExerciseId] = useState<string>()
  useEffect(() => {
    async function setData() {
      const session1 = await getSessionWithSetGroups(params.slug)
      setSession(session1)
      console.log(session1)
      const exercises1 = await getExercises()
      setExercises(exercises1)
      console.log(exercises1)
    }
    setData()
  }, [params.slug])

  function getNextOrder() {
    return (session?.setGroups?.length ?? 0) + 1
  }

  return (
    <>
      {session && (
        <div className='flex flex-col'>
          {/* <div>{program.name}</div>
          <div>{program.description}</div> */}

          <div className='text-xl'>Build Session</div>
          {exerciseId}
          <Select
            onValueChange={(e) => {
              console.log(e)
              setExerciseId(e)
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select an exercise' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Exercises</SelectLabel>
                {exercises?.map((e) => (
                  <SelectItem key={e.id} value={e.id + ''}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            onClick={async () => {
              console.log('button clicked')
              await createSetGroup({
                order: getNextOrder(),
                programId: session.programId || undefined,
                microcycleId: session.microcycleId || undefined,
                sessionId: session.id || undefined,
                exerciseId: exerciseId || undefined,
              })
              setExerciseId(undefined)
              setSession(await getSessionWithSetGroups(params.slug))
              console.log('done')
            }}
          >
            add set group
          </Button>
          {session?.setGroups?.length > 0 && (
            <>
              <Button
                onClick={async () => {
                  const numSetGroups = session.setGroups.length
                  await deleteSetGroup(session.setGroups[numSetGroups - 1].id)
                  setSession(await getSessionWithSetGroups(params.slug))
                }}
              >
                remove set group
              </Button>

              <div>Set Groups</div>
              {session.setGroups.map((s) => (
                <div key={s.id} className='flex'>
                  <span>
                    <Link
                      key={s.id}
                      href={`/builder/setGroups/${s.id}`}
                      className='hover:text-blue-400'
                    >
                      id:{s.id}: order:{s.order} exercise: {s.exercise?.name}
                    </Link>
                  </span>
                  <Button
                    onClick={async () => {
                      await deleteSetGroup(s.id)
                      setSession(await getSessionWithSetGroups(params.slug))
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
