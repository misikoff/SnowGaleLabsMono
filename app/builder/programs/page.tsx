'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Textarea } from 'components/ui/textarea'
import { createProgram, getPrograms, getUsers } from 'app/app/actions'
import { Program } from 'db/test/schema'

export default function Home() {
  const [programName, setProgramName] = useState('')
  const [programDescription, setProgramDescription] = useState('')

  const [programs, setPrograms] = useState<Program[]>([])

  // useEffect(() => {
  //   console.log({ programs })
  // }, [programs])

  useEffect(() => {
    async function setData() {
      setPrograms(await getPrograms())
    }
    setData()
  }, [])

  return (
    <div>
      <div>
        <Label>Program Name</Label>
        <Input
          // type='name'
          // placeholder='name'
          onChange={(e) => setProgramName(e.target.value)}
          value={programName}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          // type='name'
          // placeholder='name'
          onChange={(e) => setProgramDescription(e.target.value)}
          value={programDescription}
        />
      </div>

      <Button
        onClick={async () => {
          await createProgram({
            name: programName,
            description: programDescription,
          })
          setProgramName('')
          setProgramDescription('')
          setPrograms(await getPrograms())
        }}
      >
        create program
      </Button>

      {programs.length > 0 && (
        <>
          <div className='mt-16 text-xl'> Programs</div>

          <div className='flex flex-col'>
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/builder/programs/${program.id}`}
                className='hover:text-blue-400'
              >
                {program.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
