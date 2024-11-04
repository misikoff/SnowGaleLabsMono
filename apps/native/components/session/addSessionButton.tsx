import { Pressable } from 'react-native'
import * as Crypto from 'expo-crypto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Session } from '@repo/db/schema'
import { createSession } from '@/lib/dbFunctions'

export default function AddSessionButton({
  userId,
  children,
  onCreate,
}: {
  userId: string
  children: React.ReactNode
  onCreate?: (sessionId: string) => void
}) {
  const queryClient = useQueryClient()
  const createSessionMutation = useMutation({
    mutationFn: ({
      id,
      createdAt,
      updatedAt,
      userId,
    }: Parameters<typeof createSession>[0]) =>
      createSession({
        id,
        createdAt,
        updatedAt,
        userId,
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
      // console.log({ nextSessions })
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
    <Pressable
      onPress={async () => {
        console.log('create session')
        const newSessionId = Crypto.randomUUID()
        // TODO: make sure this shows loading or otherwise displays things instead of adding the session and then navigating
        await createSessionMutation.mutateAsync({
          id: newSessionId,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
        })
        if (onCreate) {
          onCreate(newSessionId)
        }
      }}
    >
      {children}
    </Pressable>
  )
}
