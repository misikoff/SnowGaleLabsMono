import { useState } from 'react'

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Exercise, SetGroupWithExerciseAndSets } from '@repo/db/schema'
import CustomSelect from '@/components/customSelect'
import { getExercises, updateSet, updateSetGroup } from '@/lib/dbFunctions'

export default function SwapExerciseButton({
  setGroup,
  children,
}: {
  setGroup: SetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>()

  // use react query to fetch exercises
  const {
    data: exercises,
    // isLoading,
    // isError,
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => getExercises(),
  })

  useFocusEffect(() => {
    if (exercises && !selectedExercise) {
      setSelectedExercise(
        exercises.find((exercise) => exercise.id === setGroup.exerciseId),
      )
    }
    // [setGroup.exerciseId, exercises]
  })

  const exercisesOptions = exercises?.map((exercise) => ({
    label: exercise.name,
    value: exercise.id,
  }))

  const updateSetGroupMutation = useMutation({
    mutationFn: async ({
      id,
      exerciseId,
    }: Parameters<typeof updateSetGroup>[0]) => {
      await updateSetGroup({
        id,
        exerciseId,
      })

      // change the exercise ids of all the sets in the set group
      await Promise.all(
        setGroup.sets.map((set) => {
          return updateSet({
            id: set.id,
            exerciseId,
          })
        }),
      )
    },
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSetGroup: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', setGroup.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        setGroup.sessionId,
      ])
      const nextSession = produce(previousSession, (draft: any) => {
        draft.setGroups = draft.setGroups.map(
          (curSetGroup: SetGroupWithExerciseAndSets) => {
            if (curSetGroup.id === newSetGroup.id) {
              curSetGroup.exerciseId = newSetGroup.exerciseId
              curSetGroup.exercise = selectedExercise as Exercise
              curSetGroup.sets = curSetGroup.sets.map((set) => {
                set.exerciseId = newSetGroup.exerciseId
                return set
              })
            }
            return curSetGroup
          },
        )
      })

      // Optimistically update to the new value
      queryClient.setQueryData(['session', setGroup.sessionId], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSetGroup, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSetGroup, context })
      queryClient.setQueryData(
        ['session', setGroup.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', setGroup.sessionId],
      })
    },
  })

  // const updateSetMutation = useMutation({
  //   mutationFn: ({ id, exerciseId }: Parameters<typeof updateSet>[0]) =>
  //     updateSet({
  //       id,
  //       exerciseId,
  //     }),
  //   // When mutate is called:
  //   // TODO: better typing with a simple set or dummy set, but still may require casting
  //   onMutate: async (newSet: any) => {
  //     // Cancel any outgoing refetches
  //     // (so they don't overwrite our optimistic update)
  //     await queryClient.cancelQueries({
  //       queryKey: ['session', setGroup.sessionId],
  //     })

  //     // Snapshot the previous value
  //     const previousSession = queryClient.getQueryData([
  //       'session',
  //       setGroup.sessionId,
  //     ])
  //     const nextSession = produce(
  //       previousSession,
  //       (draft: SessionWithSetGroupWithExerciseAndSets) => {
  //         draft.setGroups = draft.setGroups.map(
  //           (curSetGroup: SetGroupWithExerciseAndSets) => {
  //             if (curSetGroup.id === newSet.setGroupId) {
  //               curSetGroup.sets.push(newSet as Set)
  //             }
  //             return curSetGroup
  //           },
  //         )
  //       },
  //     )
  //     // Optimistically update to the new value
  //     queryClient.setQueryData(['session', setGroup.sessionId], nextSession)

  //     // setOpen(false)

  //     // Return a context object with the snapshotted value
  //     return { previousSession }
  //   },
  //   // If the mutation fails,
  //   // use the context returned from onMutate to roll back
  //   onError: (err, newSet, context) => {
  //     console.log('error')
  //     console.log({ err })
  //     console.log({ newSet, context })
  //     queryClient.setQueryData(
  //       ['session', setGroup.sessionId],
  //       context?.previousSession,
  //     )
  //   },
  //   onSuccess: () => {
  //     console.log('success')
  //     // need to do another mutation to add the first set to the set group
  //   },
  //   // Always refetch after error or success:
  //   onSettled: () => {
  //     console.log('settled')
  //     queryClient.invalidateQueries({
  //       queryKey: ['session', setGroup.sessionId],
  //     })
  //   },
  // })

  return (
    <View>
      <Modal
        className='mt-12 items-center justify-center'
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setModalVisible(!modalVisible)
        }}
      >
        <View className='my-8 items-center justify-center'>
          <View
            className='m-5 items-center rounded-3xl bg-slate-50 p-1'
            style={styles.modalView}
          >
            <Text className='my-4 text-center font-bold'>
              select exercise to swap for: {setGroup.exercise.name}
            </Text>
            <Text className='my-4 text-center font-bold'>
              selected: {selectedExercise ? selectedExercise.name : 'none'}
            </Text>

            {exercisesOptions && exercisesOptions.length > 0 && (
              <CustomSelect
                options={exercisesOptions}
                intialValue={selectedExercise}
                onSelect={(option) => {
                  console.log({ option })
                  const selected = exercises?.find((e) => {
                    return e.id === option.value
                  })
                  console.log({ selected })
                  console.log({ id: selected.id })
                  setSelectedExercise(selected)
                  setDisabled(option.value === setGroup.exerciseId)
                }}
                placeholder='Select an option'
              />
            )}
            <View className='flex-1 items-center pt-4'>
              <Text className='font-bold'>{selectedExercise?.name}</Text>
            </View>
            {/* <View className='flex-1' /> */}
            <View className='flex w-full flex-row justify-between gap-6'>
              <Pressable
                className='w-1/2 rounded-md rounded-bl-3xl bg-gray-300 p-3'
                onPress={() => {
                  setSelectedExercise(null)
                  setModalVisible(!modalVisible)
                }}
              >
                <Text className='text-center'>Cancel</Text>
              </Pressable>
              <Pressable
                disabled={
                  disabled ||
                  !selectedExercise ||
                  selectedExercise.id === setGroup.exerciseId
                }
                className='group w-1/2 rounded-md rounded-br-3xl bg-green-400 p-3 transition-colors disabled:bg-gray-600'
                onPress={async () => {
                  console.log({ sessionId: setGroup.sessionId })
                  setInProgress(true)
                  if (selectedExercise) {
                    updateSetGroupMutation
                      .mutateAsync({
                        id: setGroup.id,
                        exerciseId: selectedExercise?.id || '',
                      })
                      .then(() => {
                        // maybe not needed
                        setInProgress(false)
                      })

                    setModalVisible(!modalVisible)
                  }
                }}
              >
                <Text className='text-center transition-colors group-disabled:text-white'>
                  Swap Exercise {inProgress && <ActivityIndicator />}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        {children}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  modalView: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    elevation: 2,
  },
})
