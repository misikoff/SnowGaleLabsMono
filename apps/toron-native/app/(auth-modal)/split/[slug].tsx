import { useEffect, useState } from 'react'

import { ScrollView, Text, View, Button } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { SessionExercise } from '@repo/toron-db/schema'
import SplitEditor from '@/components/split/editor'
import {
  createSessionExercise,
  deleteSessionExercise,
  getMuscleGroups,
  getProfile,
  getSessions,
  getSplit,
} from '@/lib/dbFunctions'
import { useUpdateProfileMutation } from '@/lib/mutations/profileMutations'
import {
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useUpdateSessionMutation,
} from '@/lib/mutations/sessionMutations'
import { useUpdateSplitMutation } from '@/lib/mutations/splitMutations'

export default function Page() {
  const { slug: splitId } = useLocalSearchParams()

  const updateProfileMutation = useUpdateProfileMutation()
  const updateSplitMutation = useUpdateSplitMutation()

  const createSessionMutation = useCreateSessionMutation()
  const updateSessionMutation = useUpdateSessionMutation()
  const deleteSessionMutation = useDeleteSessionMutation()

  const [trainingDays, setTrainingDays] = useState<
    { id: string; name: string; order: number; muscleGroups?: string[] }[]
  >([])

  const [isEditing, setIsEditing] = useState(false)

  const navigation = useNavigation()

  const {
    data: profile,
    isLoading: profileLoading,
    // isError: profileError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  })

  const {
    data: split,
    // isLoading: splitLoading,
    // isError: splitError,
  } = useQuery({
    queryKey: ['splits', splitId],
    queryFn: () =>
      getSplit({
        id: splitId as string,
      }),
  })

  // fetch sessions for training days
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
  } = useQuery({
    queryKey: ['sessions', splitId],
    queryFn: () => getSessions({ splitTemplateId: splitId as string }),
    enabled: !!splitId,
  })

  const { data: muscleGroups } = useQuery({
    queryKey: ['muscleGroups'],
    queryFn: async () => getMuscleGroups(),
  })

  useEffect(() => {
    if (sessions) {
      const updatedTrainingDays = sessions.map((day) => ({
        id: day.id,
        name: day.name,
        order: day.order,
        muscleGroups: day.sessionExercises.map((x: SessionExercise) =>
          x.muscleGroup ? x.muscleGroup.id : null,
        ),
        // .filter((id): id is string => id !== null), // Filter out null values
      }))

      // console.log({ updatedTrainingDays })

      setTrainingDays(updatedTrainingDays)
    }
  }, [sessions])

  const handleSelectSplit = () => {
    if (profileLoading || !profile) {
      return
    } else {
      updateProfileMutation.mutate(
        {
          id: profile.id, // Replace with the actual user ID
          currentSplitId: splitId as string,
        },
        {
          onSuccess: () => {
            navigation.goBack() // Dismiss the route / pop the stack
          },
        },
      )
    }
  }

  const handledDeselectSplit = () => {
    if (profileLoading || !profile) {
      return
    }
    updateProfileMutation.mutate(
      {
        id: profile.id,
        currentSplitId: null,
      },
      {
        onSuccess: () => {
          navigation.goBack() // Dismiss the route / pop the stack
        },
      },
    )
  }

  const handleUpdate = async (
    nextTrainingDays: {
      id: string
      name: string
      order: number
      muscleGroups?: string[]
    }[],
    splitName: string,
    rirTarget: number,
    plannedRestDays: boolean,
  ) => {
    console.log('update split')

    // TODO figure out all updates / changes to make

    // first compare split
    // has anything changed
    // if so, update split
    // if not, skip
    const changes = {} as {
      name?: string
      rirTarget?: number
      plannedRestDays?: boolean
    }
    if (split?.name !== splitName) {
      changes.name = splitName
    }
    if (split?.rirTarget !== rirTarget) {
      changes.rirTarget = rirTarget
    }
    if (split?.plannedRestDays !== plannedRestDays) {
      changes.plannedRestDays = plannedRestDays
    }

    if (Object.keys(changes).length > 0) {
      console.log('no changes to split')
      await new Promise((resolve, reject) => {
        updateSplitMutation.mutate(
          {
            id: splitId as string,
            ...changes,
          },
          {
            onSuccess: resolve,
            onError: (error) => {
              console.error('Error updating split:', error)
              reject(new Error('Error updating split'))
            },
          },
        )
      })
        .catch((error) => {
          console.error('Error creating split:', error)
        })
        .finally(() => {
          console.log('Split created successfully')
        })
    }

    console.log('made it this far1')

    // check if any training days have been removed
    const removedTrainingDays = sessions?.filter(
      (session) => !nextTrainingDays.find((day) => day.id === session.id),
    )

    console.log('testing removed training days')
    if (removedTrainingDays) {
      const removalPromises = removedTrainingDays.map(async (day) => {
        await deleteSessionMutation
          .mutateAsync({
            id: day.id,
          })
          .catch((error) => {
            console.error('Error creating session:', error)
          })
      })

      await Promise.all(removalPromises)
      // note: session exercises will remove themselves by cascade
    }

    // check for training days that are new
    const newTrainingDays = nextTrainingDays.filter(
      (day) => !sessions?.find((session) => session.id === day.id),
    )
    if (newTrainingDays) {
      // create the days and session exercises
      const newDayPromises = newTrainingDays.map(async (day, dayIndex) => {
        await createSessionMutation
          .mutateAsync({
            id: day.id,
            splitTemplateId: splitId as string,
            isRestDay: plannedRestDays && (day.muscleGroups?.length || 0) === 0,
            name: day.name,
            order: dayIndex,
          })
          .catch((error) => {
            console.error('Error creating session:', error)
          })

        if (day.muscleGroups) {
          const muscleGroupPromises = day.muscleGroups.map(
            (muscleGroupId, muscleGroupIndex) =>
              createSessionExercise({
                sessionId: day.id,
                muscleGroupId,
                order: muscleGroupIndex,
              }),
          )

          // Wait for all muscle group creations to complete
          return muscleGroupPromises
        }
      })

      await Promise.all(newDayPromises)
    }
    console.log('new training days:', newTrainingDays)

    // TODO: make this all parallel
    // update training days that have changed and their associated muscle groups changes
    const trainingDayPromises = nextTrainingDays.map(async (day, dayIndex) => {
      const existingSession = sessions?.find((session) => session.id === day.id)

      if (existingSession) {
        // check for changes in the session and changes in the session exercises
        const sessionChanges = {} as {
          name?: string
          order?: number
          isRestDay?: boolean
        }
        if (existingSession.name !== day.name) {
          sessionChanges.name = day.name
        }
        if (existingSession.order !== dayIndex) {
          sessionChanges.order = dayIndex
        }
        if (
          existingSession.isRestDay !==
          (plannedRestDays && (day.muscleGroups?.length || 0) === 0)
        ) {
          sessionChanges.isRestDay =
            plannedRestDays && (day.muscleGroups?.length || 0) === 0
        }

        if (Object.keys(sessionChanges).length > 0) {
          await updateSessionMutation
            .mutateAsync({
              id: day.id,
              ...sessionChanges,
            })
            .catch((error) => {
              console.error('Error updating session:', error)
            })
        }

        const changePromises = []

        // if any session exercises don't exist in the new day, delete them
        const removeSessionExercises = existingSession.sessionExercises.filter(
          (x) => !day.muscleGroups?.find((id) => id === x.muscleGroup.id),
        )
        if (removeSessionExercises) {
          const removalPromises = removeSessionExercises.map(async (x) => {
            await deleteSessionExercise({
              id: x.id,
            }).catch((error) => {
              console.error('Error deleting session exercise:', error)
            })
          })

          changePromises.push(...removalPromises)
        }

        // if any muscle groups are new, create them
        const newMuscleGroups = day.muscleGroups?.filter(
          (id) =>
            !existingSession.sessionExercises.find(
              (x) => x.muscleGroup.id === id,
            ),
        )
        if (newMuscleGroups) {
          const newMuscleGroupPromises = newMuscleGroups.map(
            (muscleGroupId, muscleGroupIndex) =>
              createSessionExercise({
                sessionId: day.id,
                muscleGroupId,
                order: muscleGroupIndex,
              }),
          )
          changePromises.push(...newMuscleGroupPromises)
        }

        // TODO: handle session exercise updates. as of now these can't happen. we only create or delete them
        // if sessionExercise already exists, update it
        const potentiallyUpdatedSessionExercises =
          existingSession.sessionExercises.filter((x) =>
            day.muscleGroups?.find((id) => id === x.muscleGroup.id),
          )
        if (potentiallyUpdatedSessionExercises) {
          // if (day.muscleGroups) {
          //   const muscleGroupPromises = day.muscleGroups.map(
          //     (muscleGroupId, muscleGroupIndex) =>
          //       createSessionExercise({
          //         sessionId: day.id,
          //         muscleGroupId,
          //         order: muscleGroupIndex,
          //       }),
          //   )
          //   // Wait for all muscle group creations to complete
          //   return muscleGroupPromises
          // }
        }
      }
    })

    // Wait for all training day promises to complete
    await Promise.all(trainingDayPromises)
    console.log('training days created')

    navigation.goBack() // Dismiss the route / pop the stack
  }

  return (
    <ScrollView>
      {/* toggle editing */}
      <Button
        title={isEditing ? 'Cancel' : 'Edit'}
        onPress={() => setIsEditing((prev) => !prev)}
        disabled={!profile}
      />
      {!isEditing && (
        <>
          {/* <Link href='/(auth)/session'>Back</Link> */}
          {/* {splitLoading && <Text>Loading...</Text>} */}
          {/* {splitError && <Text>Error</Text>} */}

          {sessionsLoading && <Text>Loading training days...</Text>}
          {sessionsError && <Text>Error loading training days</Text>}
          {split && sessions && (
            <View className='flex flex-1 items-center gap-2 p-4'>
              <View className='w-full flex-row items-center justify-between gap-2'>
                <Text className='text-lg font-bold text-black'>
                  Split Name:
                </Text>
                <Text>{split.name}</Text>
              </View>

              <View className='h-10 w-full flex-row items-center justify-between'>
                <Text className='text-lg font-bold'>RIR Target:</Text>
                <View className='flex-row items-center gap-2'>
                  <Text className='mt-1 w-8 text-center text-lg'>
                    {split.rirTarget}
                  </Text>
                </View>
              </View>

              <View className='h-10 w-full flex-row items-center justify-between'>
                <Text className='text-lg font-bold'>Rest Days:</Text>
                <View className='flex-row items-center gap-2'>
                  <Text className='mt-1 text-center text-lg'>
                    {split.plannedRestDays ? 'Planned' : 'Dynamic'}
                  </Text>
                </View>
              </View>

              <View className='h-10 w-full flex-row items-center justify-between'>
                <Text className='text-lg font-bold'>
                  {split.plannedRestDays ? 'Cycle Length' : 'Training Days'}
                </Text>

                <Text className='mt-1 w-8 text-center text-lg'>
                  {sessions.length}
                </Text>
              </View>

              {profile?.currentSplitId === split.id ? (
                <>
                  <Text>Current Split</Text>
                  <Button
                    title='Deselect Split'
                    onPress={handledDeselectSplit}
                    disabled={!profile}
                  />
                </>
              ) : (
                <Button
                  title='Select Split'
                  onPress={handleSelectSplit}
                  disabled={!profile}
                />
              )}
            </View>
          )}

          {trainingDays.length > 0 && (
            <View className='mt-4 w-full'>
              <Text className='text-lg font-bold'>Training Days</Text>
              <View className='flex flex-row items-center justify-between gap-2'>
                {trainingDays.map((day) => (
                  <View key={day.id}>
                    <Text className='text-lg font-bold'>{day.name}</Text>
                    <Text className='text-lg font-bold'>
                      {day.muscleGroups
                        ?.map((gId) => {
                          return muscleGroups?.find((item) => item.id === gId)
                            ?.name
                        })
                        .join(', ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}

      {/* if editing */}
      {isEditing && (
        <SplitEditor
          split={split}
          trainingDays={trainingDays}
          onUpdateSplit={handleUpdate}
        />
      )}
    </ScrollView>
  )
}
