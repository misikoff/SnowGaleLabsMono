'use client'

import { useQueryClient } from '@tanstack/react-query'

import { Button } from 'components/ui/button'
import { createSet } from 'app/app/actions'
import { SetGroupWithExerciseAndSets } from 'db/schema'

export default function AddSetButton({
  setGroup,
}: {
  setGroup: SetGroupWithExerciseAndSets
}) {
  const queryClient = useQueryClient()

  const newMax =
    setGroup.sets.length > 0
      ? Math.max(...setGroup.sets.map((set) => set.order || 0)) + 1
      : 0
  return (
    <Button
      onClick={async () => {
        const newSet = await createSet({
          order: newMax,
          exerciseId: setGroup.exerciseId!, // TODO: figure out how to simplify
          // setGroup exercise type is exerciseId: number | null instead of exerciseId: number | undefined
          sessionId: setGroup.sessionId!,
          setGroupId: setGroup.id,
          // TODO: better error handling if exercise or session is null
        })
        if (newSet) {
          queryClient.invalidateQueries({
            queryKey: ['session', setGroup.sessionId],
          })
        }
      }}
    >
      Add Set
    </Button>
  )
}
