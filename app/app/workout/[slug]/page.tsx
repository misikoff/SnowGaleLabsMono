'use client'

import { useEffect, useState } from 'react'

import SetGroupBlock from 'components/workout/setGroupBlock'
import { getSession } from 'app/app/actions'
import { Exercise, Set } from 'db/users/schema'

import AddExerciseButton from './addExerciseButton'

// const user = {
//   preferredUnits: 'lbs',
// }

// const workout = {
//   name: 'Workout 1',
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

export default function Home({ params }: { params: { slug: string } }) {
  const [session, setSession] = useState<any>()

  useEffect(() => {
    async function fetchData() {
      const session = await getSession(parseInt(params.slug))
      setSession(session)
      console.log({ session })
    }
    fetchData()
  }, [params.slug])

  return (
    <div>
      <div>{session?.name}</div>
      <div>{session?.id}</div>

      <div className='flex flex-col gap-y-4'>
        {session?.setGroups.map(
          (
            g: { exercise: Exercise; sets: Set[]; id: number },
            index: number,
          ) => <SetGroupBlock key={index} setGroup={g} />,
        )}
      </div>

      {/* unless session is locked */}
      <AddExerciseButton session={session} />
    </div>
  )
}
