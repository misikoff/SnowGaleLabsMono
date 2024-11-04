import { Pressable } from 'react-native'
import * as Crypto from 'expo-crypto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Set, SetGroupWithExerciseAndSets } from '@repo/db/schema'
import { createSet } from '@/lib/dbFunctions'

export default function AddSetButton({
  setGroup,
  children,
}: {
  className?: string
  setGroup: SetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()

  const createSetMutation = useMutation({
    mutationFn: ({
      id,
      exerciseId,
      sessionId,
      setGroupId,
      userId,
      order,
    }: Parameters<typeof createSet>[0]) =>
      createSet({
        id,
        exerciseId,
        sessionId,
        setGroupId,
        userId,
        order,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSet: any) => {
      console.log({ newSet })
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', setGroup.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        setGroup.sessionId,
      ])
      const nextSession = produce(previousSession, (draft: any) => {
        draft.setGroups = draft.setGroups.map(
          (curSetGroup: SetGroupWithExerciseAndSets) => {
            if (curSetGroup.id === newSet.setGroupId) {
              curSetGroup.sets.push(newSet as Set)
            }
            return curSetGroup
          },
        )
      })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', setGroup.sessionId], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSet, context })
      queryClient.setQueryData(
        ['session', setGroup.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', setGroup.sessionId],
      })
    },
  })

  return (
    <Pressable
      onPress={async () => {
        await createSetMutation.mutateAsync({
          id: Crypto.randomUUID(),
          exerciseId: setGroup.exercise.id,
          sessionId: setGroup.sessionId || '',
          setGroupId: setGroup.id,
          order: setGroup.sets.length + 1,
        })
      }}
    >
      {children}
    </Pressable>
  )
}
