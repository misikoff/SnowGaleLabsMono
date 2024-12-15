import { Alert } from 'react-native'
import * as Haptics from 'expo-haptics'

import { Exercise } from '@repo/db/schema'
export default function DeleteExerciseAlert(
  exercise: Exercise,
  onClose?: any,
  onDelete?: any,
) {
  Alert.alert(
    'Delete Exercise?',
    `${exercise.name}\n\n If you delete an exercise with values logged, you will lose your data for that exercise.`,
    [
      {
        text: 'No thanks',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes!',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          // deleteSessionMutation.mutateAsync(
          //   session.id,
          // )
        },
      },
    ],
  )
}
