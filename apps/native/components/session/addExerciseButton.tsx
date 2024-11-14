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
import * as Crypto from 'expo-crypto'
import { useFocusEffect } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import {
  Exercise,
  SessionWithSetGroupWithExerciseAndSets,
  SetGroup,
} from '@repo/db/schema'
import CustomSelect from '@/components/customSelect'
import { createSet, createSetGroup, getExercises } from '@/lib/dbFunctions'

export default function AddExerciseButton({
  session,
  children,
}: {
  session: SessionWithSetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>()
  const user = useUser()
  const userId = user.user!.id
  const [nextOrder, setNextOrder] = useState(0)

  useFocusEffect(() => {
    if (session) {
      const newMax =
        session.setGroups.length > 0
          ? Math.max(
              ...session.setGroups.map((setGroup) => setGroup.order || 0),
            ) + 1
          : 0

      setNextOrder(newMax)
    }
  })

  // use react query to fetch exercises
  const {
    data: exercises,
    // isLoading,
    // isError,
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => getExercises(),
  })

  const exercisesOptions = exercises?.map((exercise) => ({
    label: exercise.name,
    value: exercise.id,
  }))

  const createSetGroupMutation = useMutation({
    mutationFn: ({
      id,
      exerciseId,
      sessionId,
      order,
      userId,
    }: Parameters<typeof createSetGroup>[0]) =>
      createSetGroup({
        id,
        exerciseId,
        sessionId,
        order,
        userId,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSetGroup: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', session.id],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', session.id])
      const nextSession = produce(previousSession, (draft: any) => {
        // fill in missing fields
        // TODO: this is a bit of a hack, but it works for now
        // figure out how to automatically fill in missing fields
        newSetGroup.sets = []
        newSetGroup.exercise = selectedExercise
        draft.setGroups.push(newSetGroup as SetGroup)
      })

      console.log({ newSetGroup })
      console.log({ id: newSetGroup.id })
      console.log('creating new set', {
        exerciseId: selectedExercise?.id || '',
        sessionId: session.id,
        setGroupId: newSetGroup.id,
      })

      // TODO: get this working instead of running the set creation after the promise
      // createSetMutation.mutateAsync({
      //   id: Crypto.randomUUID(),
      //   exerciseId: selectedExercise?.id || '',
      //   sessionId: session.id,
      //   setGroupId: newSetGroup.id,
      //   order: nextOrder,
      // })

      // Optimistically update to the new value
      queryClient.setQueryData(['session', session.id], nextSession)

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
        ['session', session.id],
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
        queryKey: ['session', session.id],
      })
    },
  })

  const createSetMutation = useMutation({
    mutationFn: ({
      id,
      exerciseId,
      sessionId,
      setGroupId,
      userId,
    }: Parameters<typeof createSet>[0]) =>
      createSet({
        id,
        exerciseId,
        sessionId,
        setGroupId,
        userId,
        order: nextOrder,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSet: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', session.id],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', session.id])
      const nextSession = produce(
        previousSession,
        (draft: SessionWithSetGroupWithExerciseAndSets) => {
          draft.setGroups = draft.setGroups.map(
            (curSetGroup: SetGroupWithExerciseAndSets) => {
              if (curSetGroup.id === newSet.setGroupId) {
                curSetGroup.sets.push(newSet as Set)
              }
              return curSetGroup
            },
          )
        },
      )
      // Optimistically update to the new value
      queryClient.setQueryData(['session', session.id], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSet, context })
      queryClient.setQueryData(
        ['session', session.id],
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
        queryKey: ['session', session.id],
      })
    },
  })

  return (
    <View className='mt-12 items-center justify-center'>
      <Modal
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
              Select Exercise Next Order: {nextOrder}
            </Text>

            {exercisesOptions && exercisesOptions.length > 0 && (
              <CustomSelect
                options={exercisesOptions}
                intialValue={selectedExercise}
                onSelect={(option) => {
                  console.log({ option })
                  setSelectedExercise(
                    exercises?.find((e) => {
                      return e.id === option.value
                    }),
                  )
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
                disabled={disabled || !selectedExercise}
                className='group w-1/2 rounded-md rounded-br-3xl bg-green-400 p-3 transition-colors disabled:bg-gray-600'
                onPress={async () => {
                  setDisabled(true)
                  console.log({ sessionId: session.id })
                  if (selectedExercise) {
                    const newId = Crypto.randomUUID()

                    createSetGroupMutation
                      .mutateAsync({
                        id: newId,
                        exerciseId: selectedExercise?.id || '',
                        sessionId: session.id,
                        order: nextOrder,
                        userId,
                      })
                      .then(() => {
                        // todo get this incorporated into the create set group mutation
                        createSetMutation.mutateAsync({
                          id: Crypto.randomUUID(),
                          exerciseId: selectedExercise?.id || '',
                          sessionId: session.id,
                          setGroupId: newId,
                          order: nextOrder,
                        })
                        // maybe not needed
                        setDisabled(false)
                      })

                    setModalVisible(!modalVisible)
                  }
                }}
              >
                <Text className='text-center transition-colors group-disabled:text-white'>
                  Add Exercise {disabled && <ActivityIndicator />}
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
