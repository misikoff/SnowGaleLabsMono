import { TouchableOpacity } from 'react-native'
import * as Crypto from 'expo-crypto'
import * as Haptics from 'expo-haptics'

import { Session } from '@repo/toron-db/schema'
import { createSessionExercise } from '@/lib/dbFunctions'
import {
  useCreateSessionMutation,
  useDeleteSessionMutation,
} from '@/lib/mutations/sessionMutations'

export default function AddSessionButton({
  date = '2-2-2022',
  children,
  onCreate,
  fromTemplate,
}: {
  date?: string
  children: React.ReactNode
  onCreate?: (sessionId: string) => void
  // Session with muscle groups
  fromTemplate?: Session
}) {
  const createSessionMutation = useCreateSessionMutation()
  const deleteSessionMutation = useDeleteSessionMutation()

  return (
    <TouchableOpacity
      onPress={async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        console.log('create session')
        const newSessionId = Crypto.randomUUID()

        if (fromTemplate) {
          console.log({ fromTemplate })
          console.log({ mg: fromTemplate.sessionExercises })

          // TODO: make sure this shows loading or otherwise displays things instead of adding the session and then navigating
          await createSessionMutation
            .mutateAsync({
              id: newSessionId,
              name: 'New Session',
              splitId: fromTemplate?.splitTemplateId,
              clonedFromSessionId: fromTemplate?.id,
              date,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .then(async () => {
              if (fromTemplate && fromTemplate.sessionExercises) {
                console.log('adding muscleGroups')
                console.log({
                  muscles: fromTemplate.sessionExercises[0].muscleGroup,
                })
                const muscleGroupPromises = fromTemplate.sessionExercises.map(
                  (sessionExercise, sessionExerciseIndex) =>
                    createSessionExercise({
                      id: Crypto.randomUUID(),
                      sessionId: newSessionId,
                      muscleGroupId: sessionExercise.muscleGroup.id,
                      order: sessionExerciseIndex,
                    }),
                )

                // Wait for all muscle group creations to complete
                await Promise.all(muscleGroupPromises).catch((e) => {
                  console.error('Error creating muscle groups', e)
                  // delete the session
                  deleteSessionMutation.mutate({ id: newSessionId })
                })
                console.log('********done adding muscleGroups')
              }
            })
            .catch((e) => {
              console.error('Error creating session', e)
            })
          if (onCreate) {
            onCreate(newSessionId)
          }
        } else {
          await createSessionMutation
            .mutateAsync({
              id: newSessionId,
              name: 'New Session',
              date,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .then(() => {
              if (onCreate) {
                onCreate(newSessionId)
              }
            })
        }
      }}
    >
      {children}
    </TouchableOpacity>
  )
}
