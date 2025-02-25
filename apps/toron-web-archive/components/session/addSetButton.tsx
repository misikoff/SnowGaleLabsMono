import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { v4 as uuidv4 } from 'uuid'

import { Set, SetGroupWithExerciseAndSets } from '../../../../packages/toron-db/schema'
import { createSet } from '@/app/app/actions'
import { Button } from '@/components/ui/button'

export default function AddSetButton({
  setGroup,
}: {
  setGroup: SetGroupWithExerciseAndSets
}) {
  const queryClient = useQueryClient()
  const createSetMutation = useMutation({
    mutationFn: ({
      id,
      order,
      userId,
      exerciseId,
      sessionId,
      setGroupId,
    }: Parameters<typeof createSet>[0]) =>
      createSet({
        id,
        order,
        userId,
        exerciseId,
        sessionId,
        setGroupId,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSet) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions', setGroup.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        setGroup.sessionId,
      ])
      const nextSession = produce(previousSession, (draft: any) => {
        draft.setGroups = draft.setGroups.map(
          (curSetGroup: SetGroupWithExerciseAndSets) => {
            if (curSetGroup.id === setGroup.id) {
              curSetGroup.sets.push(newSet as Set)
            }
            return curSetGroup
          },
        )
      })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', setGroup.sessionId], nextSession)

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
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['sessions', setGroup.sessionId],
      })
    },
  })

  const newMax =
    setGroup.sets.length > 0
      ? Math.max(...setGroup.sets.map((set) => set.order || 0)) + 1
      : 0

  return (
    <Button
      onClick={async () => {
        await createSetMutation.mutateAsync({
          id: uuidv4(),
          order: newMax,
          userId: setGroup.userId,
          exerciseId: setGroup.exerciseId!,
          sessionId: setGroup.sessionId!,
          setGroupId: setGroup.id,
        })
      }}
    >
      Add Set
    </Button>
  )
}
