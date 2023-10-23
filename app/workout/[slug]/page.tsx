import Link from 'next/link'
import { neon } from '@neondatabase/serverless'
import { InfoIcon, PenIcon, PencilIcon } from 'lucide-react'

import { Button } from 'components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'components/ui/sheet'

const user = {
  preferredUnits: 'lbs',
}

const workout = {
  name: 'Workout 1',
  exercises: [
    {
      name: 'Squat',
      notes: '',
      weightIncrement: 5,
      equipment: 'barbell',
      unilateral: false,
      parts: ['quads', 'hamstrings', 'glutes'],
      sets: [
        {
          prescribedRepsLow: null,
          prescribedRepsHigh: null,
          prescribedWeightLow: 100,
          prescribedWeightHigh: 100,
          prescribedDifficultyLow: null,
          prescribedDifficultyHigh: null,
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
        {
          prescribedRepsLow: 5,
          prescribedRepsHigh: 5,
          prescribedWeightLow: null,
          prescribedWeightHigh: null,
          prescribedDifficultyLow: null,
          prescribedDifficultyHigh: null,
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
        {
          prescribedRepsLow: null,
          prescribedRepsHigh: null,
          prescribedWeightLow: null,
          prescribedWeightHigh: null,
          prescribedDifficultyLow: '8',
          prescribedDifficultyHigh: '8',
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
        {
          prescribedRepsLow: null,
          prescribedRepsHigh: null,
          prescribedWeightLow: null,
          prescribedWeightHigh: null,
          prescribedDifficultyLow: 5,
          prescribedDifficultyHigh: 5,
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
      ],
    },
    {
      name: 'bench',
      notes: '',
      weightIncrement: 5,
      equipment: 'barbell',
      unilateral: false,
      parts: ['chest', 'triceps', 'shoulders'],
      sets: [
        {
          prescribedRepsLow: null,
          prescribedRepsHigh: null,
          prescribedWeightLow: 100,
          prescribedWeightHigh: 100,
          prescribedDifficultyLow: null,
          prescribedDifficultyHigh: null,
          style: 'myoreps',
          weight: 0,
          reps: 0,
          notes: '',
        },
      ],
    },
  ],
}

function getSetType(set: any) {
  if (set.prescribedRepsLow && set.prescribedRepsHigh) {
    if (set.prescribedRepsLow === set.prescribedRepsHigh) {
      return `${set.prescribedRepsLow} reps`
    } else {
      return `not same ${set.prescribedRepsLow} - ${set.prescribedRepsHigh}`
    }
  } else if (set.prescribedWeightLow && set.prescribedWeightHigh) {
    if (set.prescribedWeightLow === set.prescribedWeightHigh) {
      return `${set.prescribedWeightLow}lbs`
    } else {
      return `${set.prescribedWeightLow} - ${set.prescribedWeightHigh}lbs`
    }
  } else if (set.prescribedDifficultyLow && set.prescribedDifficultyHigh) {
    if (set.prescribedDifficultyLow === set.prescribedDifficultyHigh) {
      return `${set.prescribedDifficultyLow} RPE`
    } else {
      return `${set.prescribedDifficultyLow} - ${set.prescribedDifficultyHigh} RPE`
    }
  }
}

async function getData() {
  const sql = neon(process.env.DATABASE_URL!)

  const response = await sql`SELECT * FROM playing_with_neon;`
  console.log(response)
  return response
}

export default async function Home() {
  const data = await getData()
  console.log({ woo: data })
  return (
    <div>
      <Link
        href='/workout'
        className='text-gray-600 group-hover:text-gray-700 flex flex-col items-center gap-y-2 px-1 text-sm font-medium transition-colors duration-150'
      >
        back
      </Link>
      <div>{workout.name}</div>

      <div className='flex flex-col gap-y-4'>
        {workout.exercises.map((exercise, index) => (
          <div className='bg-gray-800 rounded-xl p-4' key={index}>
            <div className='flex justify-between'>
              <div className='text-2xl text-white'>{exercise.name}</div>
              <div className='flex gap-x-3'>
                <InfoIcon className='w-6 h-6 text-gray-400' />
                <PencilIcon className='w-6 h-6 text-gray-400' />
              </div>
            </div>
            <div className='ml-1 mt-2 flex flex-col gap-y-2'>
              {exercise.sets.map((set, index) => (
                <div key={'s' + index}>
                  <div className='flex items-center gap-x-2 text-white'>
                    <span className='flex h-8 w-8 flex-shrink-0 items-center text-blue-400 justify-center rounded-full border-2 bg-black border-black'>
                      <span className='text-indigo-600'>{index + 1}</span>
                    </span>
                    {getSetType(set)}
                    <div className='flex-grow' />

                    <Sheet>
                      <SheetTrigger>
                        <Button className='justify-self-end rounded-full text-blue-400'>
                          Performance
                        </Button>
                      </SheetTrigger>
                      <SheetContent side='bottom'>
                        <SheetHeader>
                          <SheetTitle>Performance</SheetTitle>
                          {/* <SheetDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </SheetDescription> */}
                        </SheetHeader>
                        <div>weight</div>
                        <div>weight</div>
                        <div>Difficulty</div>
                        <div className='flex w-full gap-x-4'>
                          <SheetClose className='w-full'>
                            <Button className='justify-self-end w-full uppercase font-mono text-gray-400'>
                              Clear
                            </Button>
                          </SheetClose>
                          <SheetClose className='w-full'>
                            <Button className='justify-self-end w-full uppercase font-mono text-white bg-green-400'>
                              Done
                            </Button>
                          </SheetClose>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
