'use client'

import { useQueryClient } from '@tanstack/react-query'

import { Button } from 'components/ui/button'
import { deleteSet } from 'app/app/actions'
import { Set } from 'db/schema'

export default function RemoveSetButton({ set }: { set: Set }) {
  const queryClient = useQueryClient()

  return (
    <Button
      variant='destructive'
      onClick={async () => {
        const deletedSet = await deleteSet(set.id)
        console.log({ deletedSet })
        if (deletedSet.length > 0) {
          queryClient.invalidateQueries({
            queryKey: ['session', set.sessionId],
          })
        }
      }}
    >
      Remove Set
    </Button>
  )
}
