import { useState } from 'react'

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
} from 'react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import {
  SessionWithSetGroupWithExerciseAndSets,
  Set,
  SetGroupWithExerciseAndSets,
} from '@repo/db/schema'
import { updateSet } from '@/lib/dbFunctions'

export default function PerformanceButton({
  set,
  disabled = false,
  children,
}: {
  set: Set
  disabled?: boolean
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)

  const [curWeight, setCurWeight] = useState(set.weight)
  const [curReps, setCurReps] = useState(set.reps)
  const [curRpe, setCurRpe] = useState(set.rpe)

  const updateSetMutation = useMutation({
    mutationFn: ({ id, reps, weight, rpe }: Parameters<typeof updateSet>[0]) =>
      updateSet({
        id,
        reps,
        weight,
        rpe,
      }),

    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (updatedSet: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', set.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        set.sessionId,
      ])
      const nextSession = produce(
        previousSession,
        (draft: SessionWithSetGroupWithExerciseAndSets) => {
          draft.setGroups.map((sg: SetGroupWithExerciseAndSets) => {
            sg.sets = sg.sets.map((s: Set) => {
              if (s.id === set.id) {
                s.reps = updatedSet.reps
                s.weight = updatedSet.weight
                s.rpe = updatedSet.rpe
              }
              return s
            })
          })
        },
      )

      // Optimistically update to the new value
      queryClient.setQueryData(['session', set.sessionId], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, updatedSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ updatedSet, context })
      queryClient.setQueryData(
        ['session', set.sessionId],
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
        queryKey: ['session', set.sessionId],
      })
    },
  })

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
            <Text className='my-4 text-center font-bold'>Performance</Text>

            <View className='flex-row justify-between gap-6'>
              {/* TODO */}
              <View className='flex-row'>
                <View className='flex flex-col items-center'>
                  <Text>Weight</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setCurWeight}
                    value={curWeight}
                    keyboardType='numeric'
                    type='number'
                  />
                </View>

                <View className='flex flex-col items-center'>
                  <Text>Reps</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setCurReps}
                    value={curReps}
                    keyboardType='numeric'
                    type='number'
                  />
                </View>

                <View className='flex flex-col items-center'>
                  <Text>RPE</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setCurRpe}
                    value={curRpe}
                    keyboardType='numeric'
                    type='number'
                  />
                </View>
              </View>
            </View>

            <View className='flex w-full flex-row justify-between gap-6'>
              <Pressable
                className='w-1/2 rounded-md rounded-bl-3xl bg-gray-300 p-3'
                onPress={() => {
                  setModalVisible(!modalVisible)
                }}
              >
                <Text className='text-center'>Cancel</Text>
              </Pressable>
              <Pressable
                className='group w-1/2 rounded-md rounded-br-3xl bg-green-400 p-3 transition-colors disabled:bg-gray-600'
                onPress={async () => {
                  console.log({ curWeight, curReps, curRpe })
                  await updateSetMutation.mutateAsync({
                    id: set.id,
                    weight: Number(curWeight),
                    reps: Number(curReps),
                    rpe: Number(curRpe),
                  })

                  setModalVisible(!modalVisible)
                }}
              >
                <Text className='text-center transition-colors group-disabled:text-white'>
                  Update
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.button}
        onPress={() => setModalVisible(true)}
        disabled={disabled}
      >
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})
