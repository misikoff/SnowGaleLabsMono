'use client'

import { Button } from 'components/ui/button'
import { deleteSetGroup } from 'app/app/actions'
import { SetGroupWithExerciseAndSets } from 'db/schema'

export default function RemoveSetGroupButton({
  setGroup,
  onSetGroupRemoved,
}: {
  setGroup: SetGroupWithExerciseAndSets
  onSetGroupRemoved?: (id: string) => void
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
