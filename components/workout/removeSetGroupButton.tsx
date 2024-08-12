'use client'

import { Button } from 'components/ui/button'
import { deleteSet, deleteSetGroup } from 'app/app/actions'
import { SetGroupWithExerciseAndSets } from 'db/users/schema'

export default function RemoveSetGroupButton({
  setGroup,
  onSetGroupRemoved,
}: {
  setGroup: SetGroupWithExerciseAndSets
  onSetGroupRemoved?: (id: number) => void
}) {
  return (
    <Button
      onClick={async () => {
        const deletedSetGroup = await deleteSetGroup(setGroup.id)
        console.log({ deletedSetGroup })
        if (deletedSetGroup.length > 0) {
          if (onSetGroupRemoved) {
            onSetGroupRemoved(deletedSetGroup[0].deletedId)
          }
        }
      }}
    >
      Remove Exercise
    </Button>
  )
}
