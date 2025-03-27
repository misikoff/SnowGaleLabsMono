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
import { useQuery } from '@tanstack/react-query'

import CustomSelect from '@/components/customSelect'
import { getExercises, useSupabaseUser } from '@/lib/dbFunctions'
import { useCreateSetGroupMutation } from '@/lib/mutations/sessionExerciseMutations'
import { useCreateSetMutation } from '@/lib/mutations/setMutation'

import {
  Exercise,
  SessionWithSetGroupWithExerciseAndSets,
} from '../../../../packages/toron-db/schema'

export default function AddExerciseButton({
  session,
  children,
}: {
  session: SessionWithSetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>()
  const { data: user } = useSupabaseUser()
  const [nextOrder, setNextOrder] = useState(0)

  useFocusEffect(() => {
    // if (session) {
    //   const newMax =
    //     session.setGroups.length > 0
    //       ? Math.max(
    //           ...session.setGroups.map((setGroup) => setGroup.order || 0),
    //         ) + 1
    //       : 0
    //   setNextOrder(newMax)
    // }
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

  console.log({ exercises })

  const exercisesOptions = exercises?.map((exercise) => ({
    label: exercise.name,
    value: exercise.id,
  }))

  const createSetGroupMutation = useCreateSetGroupMutation()

  const createSetMutation = useCreateSetMutation()

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
                        userId: user?.data.user?.id || '',
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
