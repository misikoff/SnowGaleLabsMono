'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'

import SetGroupBlock from 'components/session/setGroupBlock'
import { Button } from 'components/ui/button'
import {
  deleteSession,
  getSession,
  updateSession,
  updateSetGroup,
} from 'app/app/actions'
import { Set, SetGroupWithExerciseAndSets } from 'db/schema'

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
  const router = useRouter()
  const [session, setSession] = useState<any>()

  useEffect(() => {
    async function fetchData() {
      const session = await getSession(params.slug)
      setSession(session)
    }
    fetchData()
  }, [params.slug])

  // handle added setGroup without having to reload the page
  const handleAddSetGroup = (setGroup: SetGroupWithExerciseAndSets) => {
    setSession((prev: any) => {
      return {
        ...prev,
        setGroups: [...prev.setGroups, setGroup],
      }
    })
  }

  const onSetRemoved = (id: string) => {
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

  const onSetGroupRemoved = (id: string) => {
    setSession((prev: any) => {
      return {
        ...prev,
        setGroups: prev.setGroups.filter(
          (g: SetGroupWithExerciseAndSets) => g.id !== id,
        ),
      }
    })
  }

  const onSetGroupUpdated = (setGroup: SetGroupWithExerciseAndSets) => {
    setSession((prev: any) => {
      const newSetGroups = prev.setGroups.map(
        (g: SetGroupWithExerciseAndSets) => {
          if (g.id === setGroup.id) {
            return setGroup
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
      <Button
        onClick={async () => {
          // TODO add confirmation
          await deleteSession(session.id)
          router.push('/app/session')
        }}
      >
        Delete Session
      </Button>

      <div className='flex flex-col gap-y-4'>
        {session?.setGroups.map(
          (g: SetGroupWithExerciseAndSets, index: number) => (
            <div key={index}>
              <Button
                disabled={index === 0}
                onClick={async () => {
                  // shift this setgroup down by changing the order of all set groups
                  const order = session.setGroups.map(
                    (g: SetGroupWithExerciseAndSets) => g.id,
                  )
                  // move current setGroup up one
                  const currentOrder = order[index]
                  order[index] = order[index - 1]
                  order[index - 1] = currentOrder
                  console.log({ order })

                  // sort setGroups by their id index in order
                  const orderedSetGroups = session.setGroups.sort(
                    (
                      a: SetGroupWithExerciseAndSets,
                      b: SetGroupWithExerciseAndSets,
                    ) => order.indexOf(a.id) - order.indexOf(b.id),
                  )

                  // update the set groups that were moved
                  orderedSetGroups.forEach(
                    async (
                      curGroup: SetGroupWithExerciseAndSets,
                      i: number,
                    ) => {
                      const newSetGroup = await updateSetGroup({
                        id: curGroup.id,
                        order: i,
                      })
                      if (newSetGroup.length > 0) {
                        console.log({ newSetGroup })
                        const newSetGroupWithSetsAndExercise = {
                          ...newSetGroup[0],
                          exercise: curGroup.exercise,
                          sets: curGroup.sets,
                        }
                        // TODO: simplify this by updating all the set groups at once
                        onSetGroupUpdated(newSetGroupWithSetsAndExercise)
                      }
                    },
                  )
                }}
              >
                <ArrowUpNarrowWide />
              </Button>
              <Button
                disabled={index === session.setGroups.length - 1}
                onClick={async () => {
                  // shift this setgroup down by changing the order of all set groups
                  const order = session.setGroups.map(
                    (g: SetGroupWithExerciseAndSets) => g.id,
                  )
                  // move current setGroup down one
                  const currentOrder = order[index]
                  order[index] = order[index + 1]
                  order[index + 1] = currentOrder
                  console.log({ order })

                  // sort setGroups by their id index in order
                  const orderedSetGroups = session.setGroups.sort(
                    (
                      a: SetGroupWithExerciseAndSets,
                      b: SetGroupWithExerciseAndSets,
                    ) => order.indexOf(a.id) - order.indexOf(b.id),
                  )

                  // update the set groups that were moved
                  orderedSetGroups.forEach(
                    async (
                      curGroup: SetGroupWithExerciseAndSets,
                      i: number,
                    ) => {
                      const newSetGroup = await updateSetGroup({
                        id: curGroup.id,
                        order: i,
                      })
                      if (newSetGroup.length > 0) {
                        console.log({ newSetGroup })
                        const newSetGroupWithSetsAndExercise = {
                          ...newSetGroup[0],
                          exercise: curGroup.exercise,
                          sets: curGroup.sets,
                        }
                        // TODO: simplify this by updating all the set groups at once
                        onSetGroupUpdated(newSetGroupWithSetsAndExercise)
                      }
                    },
                  )
                }}
              >
                <ArrowDownNarrowWide />
              </Button>
              <SetGroupBlock
                setGroup={g}
                onSubmit={onSetAdded}
                onSetRemoved={onSetRemoved}
                onSetGroupRemoved={onSetGroupRemoved}
                onSetUpdated={onSetUpdated}
                onSetGroupUpdated={onSetGroupUpdated}
              />
            </div>
          ),
        )}
      </div>

      {/* unless session is locked */}
      <div className='mt-8 flex flex-col space-y-4 w-full items-center'>
        <AddExerciseButton session={session} onSubmit={handleAddSetGroup} />
        <Button
          variant='secondary'
          className='w-fit'
          onClick={async () => {
            await updateSession({ id: session.id, completed: true })
            router.push('/app/session')
          }}
        >
          Finish Workout
        </Button>
      </div>
    </div>
  )
}
