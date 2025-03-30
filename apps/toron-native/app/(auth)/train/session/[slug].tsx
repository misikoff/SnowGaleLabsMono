import { Alert, Button, ScrollView, Text, View } from 'react-native'
import * as Crypto from 'expo-crypto'
import { useLocalSearchParams, router, Link } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import CompleteSessionButton from '@/components/session/completeSessionButton'
import PerformanceButton from '@/components/session/performanceButton'
import { getProfile, getSession, getSplit } from '@/lib/dbFunctions'
import { useUpdateProfileMutation } from '@/lib/mutations/profileMutations'
import {
  useDeleteSessionExerciseMutation,
  useUpdateSessionExerciseMutation,
} from '@/lib/mutations/sessionExerciseMutations'
import {
  useCreateSetMutation,
  useDeleteSetMutation,
  useUpdateSetMutation,
} from '@/lib/mutations/setMutation'

export default function Page() {
  const { slug: sessionId } = useLocalSearchParams()

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sessions', sessionId],
    queryFn: () =>
      getSession({
        sessionId: sessionId as string,
      }),
  })

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  })

  const {
    data: split,
    isLoading: splitLoading,
    isError: splitError,
  } = useQuery({
    queryKey: ['splits', profile?.currentSplitId],
    queryFn: () => getSplit({ id: profile?.currentSplitId }),
    enabled: !!profile?.currentSplitId,
  })

  const deleteSessionExerciseMutation = useDeleteSessionExerciseMutation()
  const updateSessionExerciseMutation = useUpdateSessionExerciseMutation()

  const updateProfileMutation = useUpdateProfileMutation()

  const updateSetMutation = useUpdateSetMutation()
  const createSetMutation = useCreateSetMutation()
  const deleteSetMutation = useDeleteSetMutation()

  return (
    <ScrollView>
      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      {session && (
        <View>
          {/* <Text>Session: {session.id.substring(0, 5)}</Text> */}

          <View className='gap-4'>
            {/* <Text>
              Session Muscle Groups: {session.sessionExercises.length}
            </Text> */}
            {session.sessionExercises.map((sessionExercise, index) => (
              <View key={index} className='rounded-md bg-gray-200 p-2'>
                <Text>
                  {sessionExercise.muscleGroup.name}: {sessionExercise.order}
                </Text>
                {/* add exercise button that brings up the select exercise modal with the muscle group's exercises highlighted */}
                {sessionExercise.exercise ? (
                  <View>
                    <View className='flex-row items-center justify-between'>
                      <Text>{sessionExercise.exercise.name}</Text>
                      <View className='flex-row gap-2'>
                        {session.id && (
                          <Button
                            title='Swap'
                            onPress={() => {
                              if (sessionExercise.sets.length > 0) {
                                Alert.alert(
                                  'Delete Sets',
                                  'Swapping exercises will delete all sets for this exercise. Are you sure you want to continue?',
                                  [
                                    {
                                      text: 'Cancel',
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Continue',
                                      onPress: () => {
                                        router.push(
                                          `/(auth-modal)/add-exercise?sessionId=${session.id}&sessionExerciseId=${sessionExercise.id}&muscleGroupId=${sessionExercise.muscleGroup.id}`,
                                        )
                                      },
                                    },
                                  ],
                                  // { cancelable: true },
                                )
                              } else {
                                router.push(
                                  `/(auth-modal)/add-exercise?sessionId=${session.id}&sessionExerciseId=${sessionExercise.id}&muscleGroupId=${sessionExercise.muscleGroup.id}`,
                                )
                              }
                            }}
                          />
                        )}
                        <Button
                          title='Delete'
                          color='red'
                          onPress={() => {
                            Alert.alert(
                              'Delete Exercise',
                              'Are you sure you want to delete this exercise? All sets will be deleted.',
                              [
                                {
                                  text: 'Cancel',
                                  style: 'cancel',
                                },
                                {
                                  text: 'OK',
                                  onPress: async () => {
                                    // TODO: delete session exercise and update other session exercise orders
                                    await deleteSessionExerciseMutation
                                      .mutateAsync({
                                        sessionId: session.id,
                                        id: sessionExercise.id,
                                      })
                                      .then(async () => {
                                        // iterate over sessionExercises and update the order
                                        await session.sessionExercises.forEach(
                                          async (se, index1) => {
                                            if (
                                              se.order > sessionExercise.order
                                            ) {
                                              // se.order = se.order - 1
                                              await updateSessionExerciseMutation.mutateAsync(
                                                {
                                                  id: se.id,
                                                  order: index1 - 1,
                                                },
                                              )
                                            }
                                          },
                                        )
                                      })
                                  },
                                },
                              ],
                              // { cancelable: true },
                            )
                          }}
                        />
                      </View>
                    </View>

                    {/* for each set list the sets */}
                    <View className='gap-2'>
                      {sessionExercise.sets.map((set, index) => (
                        <View
                          key={index}
                          className='rounded-md bg-gray-300 p-2'
                        >
                          <View className='flex-row items-center justify-between'>
                            <Text>
                              Set: {set.order}: {set.weight}
                              lbs x {set.reps}reps @ {set.rir}RIR
                            </Text>
                            <PerformanceButton
                              set={set}
                              // set default weight to previous set weight if available
                              // TODO: set default weight and reps to last first set of the exercise if it's the first set
                              defaultWeight={
                                sessionExercise.sets[index - 1]?.weight
                              }
                              defaultReps={
                                sessionExercise.sets[index - 1]?.reps
                              }
                              targetRir={split?.rirTarget}
                            >
                              <Text>Performance</Text>
                            </PerformanceButton>
                            <Button
                              title='-'
                              color='red'
                              onPress={async () => {
                                console.log({
                                  exerciseId: sessionExercise.exercise.id,
                                })
                                await deleteSetMutation
                                  .mutateAsync({
                                    id: set.id,
                                    sessionExerciseId: sessionExercise.id,
                                    sessionId: session.id,
                                  })
                                  .then(async () => {
                                    // iterate over sessionExercises and update the order
                                    await sessionExercise.sets.forEach(
                                      async (s, index2) => {
                                        if (s.order > set.order) {
                                          // se.order = se.order - 1
                                          await updateSetMutation.mutateAsync({
                                            id: s.id,
                                            order: index2 - 1,
                                            sessionId: session.id,
                                          })
                                        }
                                      },
                                    )
                                  })
                              }}
                            />
                          </View>
                        </View>
                      ))}
                    </View>

                    {/* add set button */}
                    <Button
                      title='Add Set'
                      onPress={async () => {
                        console.log({
                          exerciseId: sessionExercise.exercise.id,
                        })
                        await createSetMutation.mutateAsync({
                          id: Crypto.randomUUID(),
                          sessionExerciseId: sessionExercise.id,
                          exerciseId: sessionExercise.exercise.id,
                          order: sessionExercise.sets.length,
                          sessionId: session.id,
                        })
                      }}
                    />
                  </View>
                ) : (
                  <>
                    {session.id && (
                      <Button
                        title='Pick Exercise'
                        onPress={() =>
                          router.push(
                            `/(auth-modal)/add-exercise?sessionId=${session.id}&sessionExerciseId=${sessionExercise.id}&muscleGroupId=${sessionExercise.muscleGroup.id}`,
                          )
                        }
                      />
                    )}
                  </>
                )}
              </View>
            ))}

            <Button
              title='Add Another Exercise'
              onPress={() =>
                router.push(
                  `/(auth-modal)/add-exercise?sessionId=${session.id}&order=${session.sessionExercises.length}`,
                )
              }
            />
          </View>
        </View>
      )}

      <CompleteSessionButton
        sessionId={session?.id}
        className='mt-8'
        onComplete={async () => {
          if (profile?.activeSessionId) {
            await updateProfileMutation.mutateAsync({
              id: profile?.id,
              activeSessionId: null,
            })
          }

          router.back()
        }}
      >
        <View className='rounded-md bg-green-600 px-3 py-2 text-center'>
          <Text className='text-center text-xl font-bold text-white'>
            <Text>Complete Session</Text>
          </Text>
        </View>
      </CompleteSessionButton>
    </ScrollView>
  )
}
