import { Pressable } from 'react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Session } from '@repo/db/schema'
import { deleteSession } from '@/lib/dbFunctions'

export default function DeleteSessionButton({
  sessionId,
  children,
}: {
  sessionId: string
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const deleteSessionMutation = useMutation({
    mutationFn: (id: Session['id']) => deleteSession(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData([
        'sessions',
      ]) as Session[]

      const nextSessions = previousSessions.filter((s) => {
        console.log({ a: id, b: s.id, res: s.id !== id })
        return s.id !== id
      })

      console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session deleted')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  return (
    <Pressable
      onPress={async () => {
        console.log('delete session')
        deleteSessionMutation.mutateAsync(sessionId)
      }}
    >
      {children}
    </Pressable>
  )
}
