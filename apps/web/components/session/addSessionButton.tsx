'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { v4 as uuidv4 } from 'uuid'

import { Session } from '@repo/db/schema'
import { createSession } from '@/app/app/actions'
import { Button } from '@/components/ui/button'

export default function AddSessionButton() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const createSessionMutation = useMutation({
    mutationFn: ({
      id,
      createdAt,
      updatedAt,
    }: Parameters<typeof createSession>[0]) =>
      createSession({
        id,
        createdAt,
        updatedAt,
      }),
    onMutate: async ({ id, createdAt, updatedAt }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData(['sessions'])

      const nextSessions = produce(previousSessions, (draft: Session[]) => {
        draft.push({ id, createdAt, updatedAt } as Session)
      })
      console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session created')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
  return (
    <Button
      onClick={async () => {
        const newSessionId = uuidv4()
        createSessionMutation
          .mutateAsync({
            id: newSessionId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .then(() => {
            router.push(`session/${newSessionId}`)
          })
      }}
    >
      New Session
    </Button>
  )
}
