'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'

import { Button } from 'components/ui/button'
import { createSet } from 'app/app/actions'
import { SetGroupWithExerciseAndSets } from 'db/schema'

type createSetParams = Parameters<typeof createSet>[0]

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
    }: createSetParams) =>
      createSet({
        id,
        order,
        userId,
        exerciseId,
        sessionId,
        setGroupId,
      }),
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['session', setGroup.sessionId],
      })
    },
    mutationKey: ['addSet'],
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
