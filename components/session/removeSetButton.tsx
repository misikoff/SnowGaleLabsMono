'use client'

import { Button } from 'components/ui/button'
import { deleteSet } from 'app/app/actions'
import { Set } from 'db/schema'

export default function RemoveSetButton({
  set,
  onSetRemoved,
}: {
  set: Set
  onSetRemoved?: (id: string) => void
}) {
  return (
    <Button
      onClick={async () => {
        const deletedSet = await deleteSet(set.id)
        console.log({ deletedSet })
        if (deletedSet.length > 0) {
          if (onSetRemoved) {
            onSetRemoved(deletedSet[0].deletedId)
          }
        }
      }}
    >
      Remove Set
    </Button>
  )
}
