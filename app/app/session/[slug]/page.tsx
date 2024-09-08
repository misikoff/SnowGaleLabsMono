'use client'

import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'

import SetGroupBlock from 'components/session/setGroupBlock'
import { Button } from 'components/ui/button'
import AddExerciseButtonDrawer from '@/components/session/addExerciseButtonDrawer'
import {
  deleteSession,
  getSession,
  updateSession,
  updateSetGroup,
} from 'app/app/actions'
import { SetGroupWithExerciseAndSets } from 'db/schema'

export default function Home({ params }: { params: { slug: string } }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['session', params.slug],
    queryFn: () => getSession(params.slug),
  })

  // const onSetRemoved = (id: string) => {
  //   setSession((prev: any) => {
  //     const newSetGroups = prev.setGroups.map(
  //       (g: SetGroupWithExerciseAndSets) => {
  //         // if (g.id === set.setGroupId) {
  //         //   return {
  //         //     ...g,
  //         //     sets: g.sets.filter((s: Set) => s.id !== set.id),
  //         //   }
  //         // }
  //         g.sets = g.sets.filter((s: Set) => s.id !== id)
  //         return g
  //       },
  //     )
  //     return {
  //       ...prev,
  //       setGroups: newSetGroups,
  //     }
  //   })
  // }

  // const onSetAdded = (set: Set) => {
  //   setSession((prev: any) => {
  //     const newSetGroups = prev.setGroups.map(
  //       (g: SetGroupWithExerciseAndSets) => {
  //         if (g.id === set.setGroupId) {
  //           return {
  //             ...g,
  //             sets: [...g.sets, set],
  //           }
  //         }
  //         return g
  //       },
  //     )
  //     return {
  //       ...prev,
  //       setGroups: newSetGroups,
  //     }
  //   })
  // }

  // const onSetGroupRemoved = (id: string) => {
  //   setSession((prev: any) => {
  //     return {
  //       ...prev,
  //       setGroups: prev.setGroups.filter(
  //         (g: SetGroupWithExerciseAndSets) => g.id !== id,
  //       ),
  //     }
  //   })
  // }

  // const onSetGroupUpdated = (setGroup: SetGroupWithExerciseAndSets) => {
  //   setSession((prev: any) => {
  //     const newSetGroups = prev.setGroups.map(
  //       (g: SetGroupWithExerciseAndSets) => {
  //         if (g.id === setGroup.id) {
  //           return setGroup
  //         }
  //         return g
  //       },
  //     )
  //     return {
  //       ...prev,
  //       setGroups: newSetGroups,
  //     }
  //   })
  // }

  // const onSetUpdated = (set: Set) => {
  //   setSession((prev: any) => {
  //     const newSetGroups = prev.setGroups.map(
  //       (g: SetGroupWithExerciseAndSets) => {
  //         if (g.id === set.setGroupId) {
  //           return {
  //             ...g,
  //             sets: g.sets.map((s: Set) => {
  //               if (s.id === set.id) {
  //                 return set
  //               }
  //               return s
  //             }),
  //           }
  //         }
  //         return g
  //       },
  //     )
  //     return {
  //       ...prev,
  //       setGroups: newSetGroups,
  //     }
  //   })
  // }

  return (
    <div>
      <div>{session?.name}</div>
      <div>{session?.id}</div>
      {session && (
        <Button
          onClick={async () => {
            // TODO add confirmation
            await deleteSession(session.id)
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            router.push('/app/session')
          }}
        >
          Delete Session
        </Button>
      )}

      <div className='flex flex-col gap-y-4'>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error</div>}
        {session &&
          session.setGroups.map(
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
                    console.log({ orderedSetGroups })
                    // update the set groups that were moved
                    orderedSetGroups.forEach(
                      async (
                        curGroup: SetGroupWithExerciseAndSets,
                        i: number,
                      ) => {
                        console.log({
                          exerciseName: curGroup.exercise.name,
                          order: i,
                        })
                        const newSetGroup = await updateSetGroup({
                          id: curGroup.id,
                          order: i,
                        })
                        if (newSetGroup.length > 0) {
                          console.log({ newSetGroup })
                          // const newSetGroupWithSetsAndExercise = {
                          //   ...newSetGroup[0],
                          //   exercise: curGroup.exercise,
                          //   sets: curGroup.sets,
                          // }
                        }
                      },
                    )
                    queryClient.invalidateQueries({
                      queryKey: ['session', params.slug],
                    })
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
                          // const newSetGroupWithSetsAndExercise = {
                          //   ...newSetGroup[0],
                          //   exercise: curGroup.exercise,
                          //   sets: curGroup.sets,
                          // }
                        }
                      },
                    )
                    queryClient.invalidateQueries({
                      queryKey: ['session', params.slug],
                    })
                  }}
                >
                  <ArrowDownNarrowWide />
                </Button>
                <SetGroupBlock setGroup={g} />
              </div>
            ),
          )}
      </div>

      {/* unless session is locked */}
      <div className='mt-8 flex flex-col space-y-4 w-full items-center'>
        {session && (
          <>
            <AddExerciseButtonDrawer session={session}>
              <Button className='w-fit'>Add Exercise</Button>
            </AddExerciseButtonDrawer>
            <Button
              variant='secondary'
              className='w-fit'
              onClick={async () => {
                await updateSession({ id: session.id, completed: true })
                queryClient.invalidateQueries({
                  queryKey: ['sessions'],
                })
                router.push('/app/session')
              }}
            >
              Finish Session
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
