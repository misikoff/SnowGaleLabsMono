import { Pressable } from 'react-native'
import * as Crypto from 'expo-crypto'

import { SetGroupWithExerciseAndSets } from '@repo/db/schema'
import { useCreateSetMutation } from '@/lib/mutations/setMutation'

export default function AddSetButton({
  setGroup,
  children,
}: {
  className?: string
  setGroup: SetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const createSetMutation = useCreateSetMutation(
    setGroup.sets.length + 1,
    setGroup.sessionId || '',
  )

  return (
    <Pressable
      onPress={async () => {
        await createSetMutation.mutateAsync({
          id: Crypto.randomUUID(),
          exerciseId: setGroup.exercise.id,
          sessionId: setGroup.sessionId || '',
          setGroupId: setGroup.id,
          order: setGroup.sets.length + 1,
        })
      }}
    >
      {children}
    </Pressable>
  )
}
