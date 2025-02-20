'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { ProgramWithMicrocycles } from '../../../../../packages/toron-db/schema'
import {
  createMicrocycle,
  deleteMicrocycle,
  getProgramWithMicrocycles,
} from '@/app/app/actions'
import { Button } from '@/components/ui/button'

// make sure button is not clickable when running
export default function Home({ params }: { params: { slug: string } }) {
  const [program, setProgram] = useState<ProgramWithMicrocycles>()

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
