'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Button } from 'components/ui/button'
import SetGroupBlock from 'components/workout/setGroupBlock'
import { getSession } from 'app/app/actions'
import { Set, SetGroupWithExerciseAndSets } from 'db/users/schema'

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

  // handle added setgroup without having to reload the page
  const handleAddSetGroup = (setGroup: SetGroupWithExerciseAndSets) => {
    setSession((prev: any) => {
      return {
        ...prev,
        setGroups: [...prev.setGroups, setGroup],
      }
    })
  }

  const onSetRemoved = (id: number) => {
    setSession((prev: any) => {
      const newSetGroups = prev.setGroups.map(
        (g: SetGroupWithExerciseAndSets) => {
          // if (g.id === set.setGroupId) {
          //   return {
          //     ...g,
          //     sets: g.sets.filter((s: Set) => s.id !== set.id),
          //   }
          // }
          g.sets = g.sets.filter((s: Set) => s.id !== id)
          return g
        },
      )
      return {
        ...prev,
        setGroups: newSetGroups,
      }
    })
  }

  const onSetAdded = (set: Set) => {
    setSession((prev: any) => {
      const newSetGroups = prev.setGroups.map(
        (g: SetGroupWithExerciseAndSets) => {
          if (g.id === set.setGroupId) {
            return {
              ...g,
              sets: [...g.sets, set],
            }
          }
          return g
        },
      )
      return {
        ...prev,
        setGroups: newSetGroups,
      }
    })
  }

  const onSetGroupRemoved = (id: number) => {
    setSession((prev: any) => {
      return {
        ...prev,
        setGroups: prev.setGroups.filter(
          (g: SetGroupWithExerciseAndSets) => g.id !== id,
        ),
      }
    })
  }

  const onSetUpdated = (set: Set) => {
    setSession((prev: any) => {
      const newSetGroups = prev.setGroups.map(
        (g: SetGroupWithExerciseAndSets) => {
          if (g.id === set.setGroupId) {
            return {
              ...g,
              sets: g.sets.map((s: Set) => {
                if (s.id === set.id) {
                  return set
                }
                return s
              }),
            }
          }
          return g
        },
      )
      return {
        ...prev,
        setGroups: newSetGroups,
      }
    })
  }

  return (
    <div>
      <div>{session?.name}</div>
      <div>{session?.id}</div>

      <div className='flex flex-col gap-y-4'>
        {session?.setGroups.map(
          (g: SetGroupWithExerciseAndSets, index: number) => (
            <SetGroupBlock
              key={index}
              setGroup={g}
              onSubmit={onSetAdded}
              onSetRemoved={onSetRemoved}
              onSetGroupRemoved={onSetGroupRemoved}
              onSetUpdated={onSetUpdated}
            />
          ),
        )}
      </div>

      {/* unless session is locked */}
      <div className='flex flex-col'>
        <AddExerciseButton session={session} onSubmit={handleAddSetGroup} />
        <Link href={`/app/workout`}>
          <Button>Finish Workout</Button>
        </Link>
      </div>
    </div>
  )
}
