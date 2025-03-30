import { Alert, Pressable, View } from 'react-native'
import { clsx } from 'clsx'

import { Session } from '@repo/toron-db/schema'
import { useCompleteSessionMutation } from '@/lib/mutations/sessionMutations'

export default function CompleteSessionButton({
  sessionId,
  children,
  className,
  onComplete = () => {},
}: {
  sessionId: Session['id']
  children: React.ReactNode
  className?: string
  onComplete?: () => void
}) {
  const updateSessionMutation = useCompleteSessionMutation()

  const handleCompleteSession = async () => {
    console.log({ sessionId: sessionId })
    await updateSessionMutation.mutateAsync({
      id: sessionId,
      completed: true,
    })

    if (onComplete) {
      onComplete()
    }
  }

  const showAlert = () => {
    Alert.alert(
      'Mark Session Complete',
      'Are you sure you want to mark this session as complete?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          style: 'default',
          onPress: handleCompleteSession,
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <View className={clsx('items-center justify-center', className)}>
      <Pressable onPress={showAlert}>{children}</Pressable>
    </View>
  )
}
