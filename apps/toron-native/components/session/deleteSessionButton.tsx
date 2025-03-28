import { Pressable, Alert } from 'react-native'

import { useDeleteSessionMutation } from '@/lib/mutations/sessionMutations'

export default function DeleteSessionButton({
  sessionId,
  children,
  onDelete,
}: {
  sessionId: string
  children: React.ReactNode
  onDelete?: () => void
}) {
  const deleteSessionMutation = useDeleteSessionMutation()

  const handleDelete = async () => {
    console.log('delete session')
    await deleteSessionMutation.mutateAsync({ id: sessionId }).then(() => {
      if (onDelete) {
        onDelete()
      }
    })
  }

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDelete,
        },
      ],
      { cancelable: true },
    )
  }

  return <Pressable onPress={confirmDelete}>{children}</Pressable>
}
