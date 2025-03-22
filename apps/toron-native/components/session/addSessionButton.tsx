import { TouchableOpacity } from 'react-native'
import * as Crypto from 'expo-crypto'
import * as Haptics from 'expo-haptics'

import { useCreateSessionMutation } from '@/lib/mutations/sessionMutations'

export default function AddSessionButton({
  date = '2-2-2022',
  children,
  onCreate,
  fromTemplate,
}: {
  date?: string
  children: React.ReactNode
  onCreate?: (sessionId: string) => void
  fromTemplate?: string
}) {
  const createSessionMutation = useCreateSessionMutation()

  return (
    <TouchableOpacity
      onPress={async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        console.log('create session')
        const newSessionId = Crypto.randomUUID()
        // TODO: make sure this shows loading or otherwise displays things instead of adding the session and then navigating
        await createSessionMutation.mutateAsync({
          id: newSessionId,
          date,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        if (onCreate) {
          onCreate(newSessionId)
        }
      }}
    >
      {children}
    </TouchableOpacity>
  )
}
