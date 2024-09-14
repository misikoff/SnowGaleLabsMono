'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Button } from 'components/ui/button'
import {
  createMicrocycle,
  deleteMicrocycle,
  getProgramWithMicrocycles,
} from 'app/app/actions'

// https://stackoverflow.com/questions/59774572/how-to-get-the-return-type-of-async-function-in-typescript
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any

// make sure button is not clickable when running
export default function Home({ params }: { params: { slug: string } }) {
  const [program, setProgram] =
    useState<AsyncReturnType<typeof getProgramWithMicrocycles>>()

  useEffect(() => {
    async function setData() {
      const program1 = await getProgramWithMicrocycles(params.slug)
      setProgram(program1)
      console.log(program1)
    }
    setData()
  }, [params.slug])

  function getNextOrder() {
    return (program?.microcycles?.length ?? 0) + 1
  }

  return (
    <>
      {program && (
        <div className='flex flex-col'>
          <div>{program.name}</div>
          <div>{program.description}</div>

          <div className='text-xl'>Add Microcycle</div>
          <Button
            onClick={async () => {
              console.log('button clicked')
              await createMicrocycle({
                programId: program.id,
                order: getNextOrder(),
              })
              setProgram(await getProgramWithMicrocycles(params.slug))
              console.log('done')
            }}
          >
            add Microcycle
          </Button>
          {program?.microcycles?.length > 0 && (
            <>
              <Button
                onClick={async () => {
                  const numMicrocycles = program.microcycles.length
                  await deleteMicrocycle(
                    program.microcycles[numMicrocycles - 1].id,
                  )
                  setProgram(await getProgramWithMicrocycles(params.slug))
                }}
              >
                remove microcycle
              </Button>

              <div>Microcyles</div>
              {program.microcycles.map((m) => (
                <div key={m.id} className='flex'>
                  <span>
                    <Link
                      key={m.id}
                      href={`/builder/microcycles/${m.id}`}
                      className='hover:text-blue-400'
                    >
                      {m.id}: {m.order}
                    </Link>
                  </span>
                  <Button
                    onClick={async () => {
                      await deleteMicrocycle(m.id)
                      setProgram(await getProgramWithMicrocycles(params.slug))
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
