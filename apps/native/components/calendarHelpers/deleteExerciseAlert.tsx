import { Alert } from 'react-native'
import * as Haptics from 'expo-haptics'

import { SetGroupWithExerciseAndSets } from '@repo/db/schema'
import { useDeleteSetGroupMutation } from '@/lib/mutations/setGroupMutations'
export default function DeleteExerciseAlert(
  setGroup: SetGroupWithExerciseAndSets,
  onClose?: () => void,
  onDelete?: () => void,
) {
  const deleteSetGroupMutation = useDeleteSetGroupMutation(
    setGroup.sessionId || '',
  )
  Alert.alert(
    'Delete Exercise?',
    `${setGroup.exercise.name}\n\n If you delete an exercise with values logged, you will lose your data for that exercise.`,
    [
      {
        text: 'No thanks',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes!',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          await deleteSetGroupMutation.mutateAsync(setGroup.id)
        },
      },
    ],
  )
}
