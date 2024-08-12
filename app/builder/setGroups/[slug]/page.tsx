'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Button } from 'components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select'
import {
  createSet,
  deleteSet,
  deleteSetGroup,
  getSetGroupWithSets,
} from 'app/app/actions'
import { Exercise } from 'db/users/schema'

// https://stackoverflow.com/questions/59774572/how-to-get-the-return-type-of-async-function-in-typescript
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any

// make sure button is not clickable when running
export default function Home({ params }: { params: { slug: string } }) {
  const [setGroup, setSetGroup] =
    useState<AsyncReturnType<typeof getSetGroupWithSets>>()
  const [exerciseId, setExerciseId] = useState<number>()
  useEffect(() => {
    async function setData() {
      const setGroup1 = await getSetGroupWithSets(parseInt(params.slug))
      setSetGroup(setGroup1)
      console.log(setGroup1)
    }
    setData()
  }, [params.slug])

  function getNextOrder() {
    return (setGroup?.sets.length ?? 0) + 1
  }

  return (
    <>
      {setGroup && (
        <div className='flex flex-col'>
          {/* <div>{program.name}</div>
          <div>{program.description}</div> */}

          <div className='text-xl'>Build Set Group</div>
          {exerciseId}
          {/* <Select
            onValueChange={(e) => {
              console.log(e)
              setExerciseId(parseInt(e))
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
          </Select> */}

          <Button
            onClick={async () => {
              console.log('button clicked')
              await createSet({
                order: getNextOrder(),
                programId: setGroup.programId || undefined,
                microcycleId: setGroup.microcycleId || undefined,
                sessionId: setGroup.sessionId || undefined,
                exerciseId: setGroup.exerciseId || undefined,
                setGroupId: setGroup.id,
              })
              // setExerciseId(undefined)
              setSetGroup(await getSetGroupWithSets(parseInt(params.slug)))
              console.log('done')
            }}
          >
            add set group
          </Button>
          {setGroup.sets.length > 0 && (
            <>
              <Button
                onClick={async () => {
                  const numSets = setGroup.sets.length
                  await deleteSet(setGroup.sets[numSets - 1].id)
                  setSetGroup(await getSetGroupWithSets(parseInt(params.slug)))
                }}
              >
                remove set group
              </Button>

              <div>Set Groups</div>
              {setGroup.sets.map((s) => (
                <div key={s.id} className='flex'>
                  <span>
                    <Link
                      key={s.id}
                      href={`/builder/sets/${s.id}`}
                      className='hover:text-blue-400'
                    >
                      id:{s.id}: order:{s.order}
                    </Link>
                  </span>
                  <Button
                    onClick={async () => {
                      await deleteSet(s.id)
                      setSetGroup(
                        await getSetGroupWithSets(parseInt(params.slug)),
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
