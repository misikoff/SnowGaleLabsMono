import { Pressable } from 'react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import {
  SessionWithSetGroupWithExerciseAndSets,
  SetGroupWithExerciseAndSets,
} from '@repo/db/schema'
import { deleteSetGroup } from '@/lib/dbFunctions'

export default function DeleteSetGroupButton({
  setGroup,
  children = false,
}: {
  setGroup: SetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()

  const deleteSetGroupMutation = useMutation({
    mutationFn: (id: Parameters<typeof deleteSetGroup>[0]) =>
      deleteSetGroup(id),
    // When mutate is called:
    onMutate: async () => {
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

      const nextSession = produce(
        previousSession,
        (draft: SessionWithSetGroupWithExerciseAndSets) => {
          draft.setGroups = draft.setGroups.filter(
            (curSetGroup: SetGroupWithExerciseAndSets) => {
              return curSetGroup.id !== setGroup.id
            },
          )
        },
      )
      console.log({ nextSession })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', setGroup.sessionId], nextSession)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, deletedSetGroup, context) => {
      console.log('error')
      console.log({ err })
      console.log({ context })
      queryClient.setQueryData(
        ['session', setGroup.sessionId],
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
        queryKey: ['session', setGroup.sessionId],
      })
    },
  })

  return (
    <Pressable
      onPress={async () => {
        await deleteSetGroupMutation.mutateAsync(setGroup.id)
      }}
    >
      {children}
    </Pressable>
  )
}
