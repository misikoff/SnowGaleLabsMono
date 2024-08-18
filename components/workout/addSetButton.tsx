'use client'

import { Button } from 'components/ui/button'
import { createSet } from 'app/app/actions'
import { Set, SetGroup } from 'db/schema'

export default function AddSetButton({
  setGroup,
  onSubmit,
}: {
  setGroup: SetGroup
  onSubmit?: (set: Set) => void
}) {
  return (
    <Button
      onClick={async () => {
        const newSet = await createSet({
          exerciseId: setGroup.exerciseId!, // TODO: figure out how to simplify
          // setGroup exercise type is exerciseId: number | null instead of exerciseId: number | undefined
          sessionId: setGroup.sessionId!,
          setGroupId: setGroup.id,
          // TODO: better error handling if exercise or session is null
        })
        if (onSubmit) {
          onSubmit(newSet[0])
        }
      }}
    >
      Add Set
    </Button>
  )
}
