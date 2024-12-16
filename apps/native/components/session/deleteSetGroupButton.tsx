import { Pressable } from 'react-native'

import { SetGroupWithExerciseAndSets } from '@repo/db/schema'
import { useDeleteSetGroupMutation } from '@/lib/mutations/setGroupMutations'

export default function DeleteSetGroupButton({
  setGroup,
  children = false,
}: {
  setGroup: SetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const deleteSetGroupMutation = useDeleteSetGroupMutation(
    setGroup.sessionId || '',
  )

  return (
    <Pressable
      onPress={async () => {
        await deleteSetGroupMutation.mutateAsync(setGroup.id)
      }}
    >
      {children}
    </Pressable>
  )
}
