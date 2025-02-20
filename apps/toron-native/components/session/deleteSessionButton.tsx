import { Pressable } from 'react-native'

import { useDeleteSessionMutation } from '@/lib/mutations/sessionMutations'

export default function DeleteSessionButton({
  sessionId,
  children,
}: {
  sessionId: string
  children: React.ReactNode
}) {
  const deleteSessionMutation = useDeleteSessionMutation()

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
