'use client'

import { Button } from 'components/ui/button'
import { createSet } from 'app/app/actions'
import { Set, SetGroup } from 'db/users/schema'

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
          exerciseId: setGroup.exerciseId || undefined, // TODO: figure out how to simplify
          // setGroup exercise type is exerciseId: number | null instead of exerciseId: number | undefined
          sessionId: setGroup.sessionId || undefined,
          setGroupId: setGroup.id || undefined,
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
