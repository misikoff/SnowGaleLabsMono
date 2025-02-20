import { Pressable, Text } from 'react-native'

import { Set } from '../../../../packages/toron-db/schema'
import { useDeleteSetMutation } from '@/lib/mutations/setMutation'

export default function DeleteSetButton({
  set,
  children,
}: {
  set: Set
  children: React.ReactNode
}) {
  const deleteSetMutation = useDeleteSetMutation(set.sessionId)

  return (
    <Pressable
      onPress={async () => await deleteSetMutation.mutateAsync(set.id)}
    >
      {children}
    </Pressable>
  )
}
