import { useEffect, useState } from 'react'

import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native'
import * as Crypto from 'expo-crypto'
import { useFocusEffect } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { GlassesIcon, InfoIcon, XIcon } from 'lucide-react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'

import { SessionWithSetGroupWithExerciseAndSets } from '@repo/db/schema'
import { getExercises } from '@/lib/dbFunctions'
import { useCreateSetGroupMutation } from '@/lib/mutations/setGroupMutations'
import { useCreateSetMutation } from '@/lib/mutations/setMutation'

export default function AddExerciseSheet({
  session,
  children,
}: {
  session: SessionWithSetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const user = useUser()
  const userId = user.user!.id
  const [nextOrder, setNextOrder] = useState(1)

  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!modalVisible) {
      setSelectedExercises([])
    }
  }, [modalVisible])
  useFocusEffect(() => {
    if (session) {
      const newMax =
        session.setGroups.length > 0
          ? Math.max(
              ...session.setGroups.map((setGroup) => setGroup.order || 0),
            ) + 1
          : 1

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

  const createSetGroupMutation = useCreateSetGroupMutation()

  const createSetMutation = useCreateSetMutation(nextOrder, session.id)

  // console.log({ exercises })

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setModalVisible(!modalVisible)
        }}
      >
        <View className='mt-16 flex-1 items-center justify-center bg-slate-900 py-4'>
          {exercisesOptions && exercisesOptions.length > 0 && (
            <>
              <View className='w-full flex-row items-center justify-between px-2'>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  <Text className='text-lg text-white'>Back</Text>
                </TouchableOpacity>
                <Text className='text-center text-3xl text-white'>
                  Exercises
                </Text>
                <TouchableOpacity
                  onPress={async () => {
                    // for each selected exercise, create a set group
                    // and then create a set for each set group
                    // console.log({ selectedExercises })

                    await Promise.all(
                      selectedExercises.map((exerciseId, index) => {
                        const newId = Crypto.randomUUID()

                        createSetGroupMutation
                          .mutateAsync({
                            id: newId,
                            exerciseId,
                            sessionId: session.id,
                            order: nextOrder + index,
                            userId,
                          })
                          .then(() => {
                            // todo get this incorporated into the create set group mutation
                            createSetMutation.mutateAsync({
                              id: Crypto.randomUUID(),
                              exerciseId,
                              sessionId: session.id,
                              setGroupId: newId,
                              order: 0,
                            })
                            // maybe not needed
                            // setDisabled(false)
                          })
                      }),
                    )

                    setModalVisible(false)
                  }}
                  disabled={selectedExercises.length === 0}
                >
                  <Text
                    className={clsx(
                      'w-24 text-lg font-bold',
                      selectedExercises.length > 0
                        ? 'text-blue-500'
                        : 'text-gray-400',
                    )}
                  >
                    Add{' '}
                    {selectedExercises.length > 0 &&
                      `(${selectedExercises.length})`}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className='relative w-full px-2'>
                <TextInput
                  autoCapitalize='none'
                  placeholder='search exercises and circuits'
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  className='my-4 h-10 w-full rounded-md border-2 bg-slate-950 px-2 text-lg text-white placeholder:text-gray-400'
                />
                {searchTerm.length > 0 && (
                  <View className='absolute right-2 flex h-full justify-center'>
                    <TouchableOpacity onPress={() => setSearchTerm('')}>
                      <XIcon color='gray' />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {exercisesOptions.filter((exercise) => {
                return exercise.label
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
              }).length > 0 ? (
                <ScrollView
                  className='w-full'
                  // nestedScrollEnabled={true}
                >
                  <FlashList
                    className='h-full w-full'
                    data={exercisesOptions.filter((exercise) => {
                      return exercise.label
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    })}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (!selectedExercises.includes(item.value)) {
                            setSelectedExercises([
                              ...selectedExercises,
                              item.value,
                            ])
                          } else {
                            setSelectedExercises(
                              selectedExercises.filter(
                                (exerciseId) => exerciseId !== item.value,
                              ),
                            )
                          }
                        }}
                        className='m-2 -mt-2 rounded-lg border-b-2 border-gray-200 p-4'
                      >
                        <View className='flex-row items-center justify-between gap-2'>
                          <Text className='max-w-64 text-lg font-bold text-white'>
                            {item.label}
                          </Text>
                          <View className='flex-row items-center gap-4'>
                            <TouchableOpacity>
                              <InfoIcon size={24} />
                            </TouchableOpacity>

                            <View
                              className={clsx(
                                'h-8 w-8 rounded-full border-2 border-blue-500',
                                selectedExercises.includes(item.value) &&
                                  'bg-blue-500',
                              )}
                            >
                              {selectedExercises.includes(item.value) && (
                                <View className='flex h-full items-center justify-center'>
                                  <Text className='text-center font-bold'>
                                    {selectedExercises.indexOf(item.value) + 1}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                    estimatedItemSize={200}
                  />
                </ScrollView>
              ) : (
                <View className='mt-12 flex-grow gap-4'>
                  <View className='items-center'>
                    <GlassesIcon size={64} color='white' />
                  </View>
                  <Text className='text-center font-bold text-white'>
                    No Results Found
                  </Text>
                  <Text className='w-64 text-center text-white'>
                    Try modifying your search or create something new.
                  </Text>
                  <TouchableOpacity className='rounded-lg bg-blue-500 p-4'>
                    <Text className='text-center text-white'>
                      Create New Exercise
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className='rounded-lg bg-blue-500 p-4'>
                    <Text className='text-center text-white'>
                      Create New Circuit
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          {/* <View className='flex-1 items-center pt-4'> */}
          {/* <Text className='font-bold'>{selectedExercise?.name}</Text> */}
          {/* </View> */}
          {/* <View className='flex-1' /> */}
          {/* <View className='flex w-full flex-row justify-between gap-6'>
            <TouchableOpacity
              className='w-1/2 rounded-md rounded-bl-3xl bg-gray-300 p-3'
              onPress={() => {
                setSelectedExercise(null)
                setModalVisible(!modalVisible)
              }}
            >
              <Text className='text-center'>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
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
            </TouchableOpacity>
          </View> */}
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {children}
      </TouchableOpacity>
    </>
  )
}
