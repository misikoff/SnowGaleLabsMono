'use client'

import { useQueryClient } from '@tanstack/react-query'

import { Button } from 'components/ui/button'
import { deleteSetGroup } from 'app/app/actions'
import { SetGroupWithExerciseAndSets } from 'db/schema'

export default function RemoveSetGroupButton({
  setGroup,
}: {
  setGroup: SetGroupWithExerciseAndSets
}) {
  const queryClient = useQueryClient()
  return (
    <Button
      variant='destructive'
      onClick={async () => {
        const deletedSetGroup = await deleteSetGroup(setGroup.id)
        console.log({ deletedSetGroup })
        if (deletedSetGroup.length > 0) {
          queryClient.invalidateQueries({
            queryKey: ['session', setGroup.sessionId],
          })
        }
      }}
    >
      Remove Exercise
    </Button>
  )
}
