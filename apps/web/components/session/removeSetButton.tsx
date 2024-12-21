import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Set, SetGroupWithExerciseAndSets } from '@repo/db/schema'
import { deleteSet } from '@/app/app/actions'
import { Button } from '@/components/ui/button'

export default function RemoveSetButton({ set }: { set: Set }) {
  const queryClient = useQueryClient()
  const deleteSetMutation = useMutation({
    mutationFn: (id: Parameters<typeof deleteSet>[0]) => deleteSet(id),
    // When mutate is called:
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions', set.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        set.sessionId,
      ])

      const nextSession = produce(previousSession, (draft: any) => {
        draft.setGroups = draft.setGroups.map(
          (curSetGroup: SetGroupWithExerciseAndSets) => {
            if (curSetGroup.id === set.setGroupId) {
              curSetGroup.sets = curSetGroup.sets.filter(
                (curSet) => curSet.id !== id,
              )
            }
            return curSetGroup
          },
        )
      })
      console.log({ nextSession })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', set.sessionId], nextSession)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, deletedSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ context })
      queryClient.setQueryData(
        ['session', set.sessionId],
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
        queryKey: ['sessions', set.sessionId],
      })
    },
  })

  return (
    <Button
      variant='destructive'
      onClick={async () => {
        await deleteSetMutation.mutateAsync(set.id)
      }}
    >
      Remove Set
    </Button>
  )
}
