'use client'

import { useState } from 'react'

import { MinusIcon, PlusIcon } from 'lucide-react'

import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'components/ui/sheet'
import { Exercise } from 'db/schema'

// const exercise = {
//   name: 'Squat',
//   description:
//     'squat down and then stand up squat down and then stand up squat down and then stand up squat down and then stand up',
//   unilateral: false,
//   parts: ['quads', 'hamstrings', 'glutes'],
//   notes: '',
//   weightIncrement: 5,
//   equipment: 'barbell',
//   topSets: [
//     {
//       weight: 100,
//       reps: 5,
//       difficulty: 5,
//       date: '12-20-2025',
//     },
//     {
//       weight: 200,
//       reps: 2,
//       difficulty: 9.5,
//       date: '12-20-2025',
//     },
//   ],
// }

export default function InfoPopoverExercise({
  children,
  exercise,
}: {
  children: React.ReactNode
  exercise: Exercise
}) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side='top'>
        <SheetHeader>
          <SheetTitle>{exercise.name}</SheetTitle>
          {/* <SheetDescription>
          This action cannot be undone. This will permanently
          delete your account and remove your data from our
          servers.
        </SheetDescription> */}
        </SheetHeader>
        <div className='flex gap-2'>
          {/* {exercise.parts.map((p, index: number) => {
            return <Badge key={`${p}-${exercise.id}-${index}`}>{p}</Badge>
          })} */}
        </div>

        <div className='bg-gray-400 rounded-md p-4 my-2'>
          {exercise.description}
        </div>
        <div className='flex gap-4'>
          Loadability
          {/* <div>{exercise.weightIncrement}</div> */}
        </div>
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
  )
}
