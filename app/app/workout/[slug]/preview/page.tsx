'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import {
  InfoIcon,
  MinusIcon,
  PenIcon,
  PencilIcon,
  ArrowRightLeftIcon,
  PlusIcon,
  ArrowRightIcon,
} from 'lucide-react'

import { Button } from 'components/ui/button'
import { getExercises, getSession, getSetsForSession } from 'app/app/actions'
import { Session, SetGroup, Exercise } from 'db/test/schema'
import { Set } from 'db/test/schema'

import InfoPopoverExercise from '../infoPopoverExercise'
import PerformanceButton from '../performancePopover'
import SwapButton from '../swapPopover'

// // const user = {
// //   preferredUnits: 'lbs',
// // }

// const workout = {
//   name: 'Workout 1',
//   id: '1',
//   exercises: [
//     {
//       name: 'Squat',
//       notes: '',
//       weightIncrement: 5,
//       equipment: 'barbell',
//       unilateral: false,
//       parts: ['quads', 'hamstrings', 'glutes'],
//       sets: [
//         {
//           prescribedRepsLow: null,
//           prescribedRepsHigh: null,
//           prescribedWeightLow: 100,
//           prescribedWeightHigh: 100,
//           prescribedDifficultyLow: null,
//           prescribedDifficultyHigh: null,
//           style: 'myoreps',
//           weight: 0,
//           reps: 0,
//           notes: '',
//         },
//         {
//           prescribedRepsLow: 5,
//           prescribedRepsHigh: 5,
//           prescribedWeightLow: null,
//           prescribedWeightHigh: null,
//           prescribedDifficultyLow: null,
//           prescribedDifficultyHigh: null,
//           style: 'myoreps',
//           weight: 0,
//           reps: 0,
//           notes: '',
//         },
//         {
//           prescribedRepsLow: null,
//           prescribedRepsHigh: null,
//           prescribedWeightLow: null,
//           prescribedWeightHigh: null,
//           prescribedDifficultyLow: '8',
//           prescribedDifficultyHigh: '8',
//           style: 'myoreps',
//           weight: 0,
//           reps: 0,
//           notes: '',
//         },
//         {
//           prescribedRepsLow: null,
//           prescribedRepsHigh: null,
//           prescribedWeightLow: null,
//           prescribedWeightHigh: null,
//           prescribedDifficultyLow: 5,
//           prescribedDifficultyHigh: 5,
//           style: 'myoreps',
//           weight: 0,
//           reps: 0,
//           notes: '',
//         },
//       ],
//     },
//     {
//       name: 'bench',
//       notes: '',
//       weightIncrement: 5,
//       equipment: 'barbell',
//       unilateral: false,
//       parts: ['chest', 'triceps', 'shoulders'],
//       sets: [
//         {
//           prescribedRepsLow: null,
//           prescribedRepsHigh: null,
//           prescribedWeightLow: 100,
//           prescribedWeightHigh: 100,
//           prescribedDifficultyLow: null,
//           prescribedDifficultyHigh: null,
//           style: 'myoreps',
//           weight: 0,
//           reps: 0,
//           notes: '',
//         },
//       ],
//     },
//   ],
// }

// function getSetType(set: any) {
//   if (set.prescribedRepsLow && set.prescribedRepsHigh) {
//     if (set.prescribedRepsLow === set.prescribedRepsHigh) {
//       return `${set.prescribedRepsLow} reps`
//     } else {
//       return `not same ${set.prescribedRepsLow} - ${set.prescribedRepsHigh}`
//     }
//   } else if (set.prescribedWeightLow && set.prescribedWeightHigh) {
//     if (set.prescribedWeightLow === set.prescribedWeightHigh) {
//       return `${set.prescribedWeightLow}lbs`
//     } else {
//       return `${set.prescribedWeightLow} - ${set.prescribedWeightHigh}lbs`
//     }
//   } else if (set.prescribedDifficultyLow && set.prescribedDifficultyHigh) {
//     if (set.prescribedDifficultyLow === set.prescribedDifficultyHigh) {
//       return `${set.prescribedDifficultyLow} RPE`
//     } else {
//       return `${set.prescribedDifficultyLow} - ${set.prescribedDifficultyHigh} RPE`
//     }
//   }
// }

export default function Home({
  // children,
  params,
}: {
  // children: React.ReactNode
  params: { slug: string }
}) {
  const [session, setSession] = useState<Session>()
  const [groupsOfSets, setGroupsOfSets] = useState<any>([])
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    async function fetchData() {
      const session = await getSession(params.slug)
      setSession(session)
    }
    fetchData()
  }, [params.slug])

  useEffect(() => {
    async function fetchData() {
      const exercises = await getExercises()
      setExercises(exercises)

      const data = await getSetsForSession(params.slug)
      setGroupsOfSets(data)
      console.log({ data })
    }
    fetchData()
  }, [params.slug])

  const getExerciseName = (id: SetGroup['exerciseId']) => {
    console.log({ id })
    return exercises.find((exercise) => exercise.id === id)?.name
  }

  return (
    <div>
      <div>{session?.name}</div>
      <Link
        href={`/app/workout/${session?.id}/check-in`}
        className='flex gap-3 bg-green-400 rounded-md'
      >
        Start Training <ArrowRightIcon />
      </Link>
      <div className='flex flex-col gap-y-4'>
        {groupsOfSets.map(
          (exercise: { setGroup: SetGroup; sets: Set[] }, index: number) => (
            <div className='bg-gray-800 rounded-xl p-4' key={index}>
              <div className='flex justify-between'>
                <div className='text-2xl text-white'>
                  {getExerciseName(exercise.setGroup.exerciseId)}
                </div>
                <div className='flex gap-x-3'>
                  <InfoPopoverExercise>
                    <InfoIcon className='w-6 h-6 text-gray-400' />
                  </InfoPopoverExercise>
                  <SwapButton>
                    <ArrowRightLeftIcon className='w-6 h-6 text-gray-400' />
                  </SwapButton>
                </div>
              </div>
              <div className='ml-1 mt-2 flex flex-col gap-y-2'>
                {exercise.sets.map((set: Set, index) => (
                  <div key={'s' + index}>
                    <div className='flex items-center gap-x-2 text-white'>
                      <span className='flex h-8 w-8 flex-shrink-0 items-center text-blue-400 justify-center rounded-full border-2 bg-black border-black'>
                        <span className='text-indigo-600'>{index + 1}</span>
                      </span>
                      {set.prescribedWeight} x {set.prescribedReps}
                      {/* {getSetType(set)} */}
                      <div className='flex-grow' />
                      <PerformanceButton weight={set.prescribedWeight}>
                        <Button className='justify-self-end rounded-full text-blue-400'>
                          Performance
                        </Button>
                      </PerformanceButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
