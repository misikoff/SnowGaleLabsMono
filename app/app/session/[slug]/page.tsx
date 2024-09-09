'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
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

  const updateSetGroupOrderMutation = useMutation({
    mutationFn: async ({
      index1,
      index2,
    }: {
      index1: number
      index2: number
    }) => {
      const curSession = session!
      const setGroup1 = curSession.setGroups[index1]
      const setGroup2 = curSession.setGroups[index2]
      const order1 = curSession.setGroups[index1].order
      const order2 = curSession.setGroups[index2].order
      updateSetGroup({ id: setGroup1.id, order: order2 })
      updateSetGroup({ id: setGroup2.id, order: order1 })
    },
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (indices) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', params.slug],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', params.slug])
      const nextSession = produce(previousSession, (draft: any) => {
        const order1 = draft.setGroups[indices.index1].order
        const order2 = draft.setGroups[indices.index2].order
        draft.setGroups[indices.index1].order = order2
        draft.setGroups[indices.index2].order = order1
        draft.setGroups = draft.setGroups.sort(
          (a: SetGroupWithExerciseAndSets, b: SetGroupWithExerciseAndSets) => {
            // handle a.order being undefined
            if (a.order === null || b.order === null) {
              return -1
            }
            return a.order - b.order
          },
        )
      })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', params.slug], nextSession)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newOrder, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newOrder, context })
      queryClient.setQueryData(
        ['session', params.slug],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', params.slug],
      })
    },
  })

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
                    await updateSetGroupOrderMutation.mutateAsync({
                      index1: index,
                      index2: index - 1,
                    })
                  }}
                >
                  <ArrowUpNarrowWide />
                </Button>
                <Button
                  disabled={index === session.setGroups.length - 1}
                  onClick={async () => {
                    await updateSetGroupOrderMutation.mutateAsync({
                      index1: index,
                      index2: index + 1,
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
