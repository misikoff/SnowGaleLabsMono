import { useState } from 'react'

import {
  Text,
  View,
  // ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import * as Crypto from 'expo-crypto'
import * as Haptics from 'expo-haptics'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { GlassesIcon, InfoIcon, XIcon } from 'lucide-react-native'

import { getExercises, getSession, useSupabaseUser } from '@/lib/dbFunctions'
import { useCreateSetGroupMutation } from '@/lib/mutations/sessionExerciseMutations'
import { useCreateSetMutation } from '@/lib/mutations/setMutation'
export default function App() {
  const { sessionId } = useLocalSearchParams()

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useSupabaseUser()

  const [nextOrder, setNextOrder] = useState(1)

  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // useFocusEffect(() => {
  //   setSelectedExercises([])
  // })

  const {
    data: session,
    // isLoading,
    // isError,
  } = useQuery({
    enabled: user !== undefined,
    queryKey: ['session', sessionId],
    queryFn: async () =>
      getSession({
        userId: user!.data.user?.id as string,
        sessionId: sessionId as string,
      }),
  })

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

  const createSetGroupMutation = useCreateSetGroupMutation()
  const createSetMutation = useCreateSetMutation()

  const router = useRouter()

  const handleDismiss = () => {
    router.dismiss()
  }

  return (
    <View className='h-full w-full items-center justify-center bg-slate-900 pb-4 pt-12'>
      {exercisesOptions && exercisesOptions.length > 0 && (
        <>
          <View className='mt-12 h-8 w-full flex-row items-baseline justify-between px-6'>
            <TouchableOpacity
              onPress={() => {
                handleDismiss()
              }}
              className='w-24'
            >
              <Text className='text-lg text-white'>Back</Text>
            </TouchableOpacity>
            <Text className='text-center text-3xl text-white'>Exercises</Text>
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
                        userId: user?.data.user?.id as string,
                      })
                      .then(() => {
                        // todo get this incorporated into the create set group mutation
                        createSetMutation.mutateAsync({
                          id: Crypto.randomUUID(),
                          exerciseId,
                          sessionId: session.id,
                          setGroupId: newId,
                          order: 0,
                          userId: user?.data.user?.id as string,
                        })
                        // maybe not needed
                        // setDisabled(false)
                      })
                  }),
                )

                handleDismiss()
              }}
              disabled={selectedExercises.length === 0}
              className='w-24'
            >
              <Text
                className={clsx(
                  'text-right text-lg font-bold',
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

          <View className='relative mt-4 w-full px-2'>
            <TextInput
              style={{ lineHeight: 30, fontSize: 24 }}
              autoCapitalize='none'
              placeholder='Search exercises and circuits'
              value={searchTerm}
              onChangeText={setSearchTerm}
              className='w-full rounded-full bg-slate-950 px-4 py-2 text-white placeholder:text-gray-400'
            />
            {/* <BottomSheetTextInput
              style={{ lineHeight: 30, fontSize: 24 }}
              autoCapitalize='none'
              placeholder='Search exercises and circuits'
              value={searchTerm}
              onChangeText={setSearchTerm}
              className='w-full rounded-full bg-slate-950 px-4 py-2 text-white placeholder:text-gray-400'
            /> */}
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
            <View className='h-full w-full bg-red-400'>
              <FlashList
                className='mb-12 mt-2 h-72 w-full'
                data={exercisesOptions.filter((exercise) => {
                  return exercise.label
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                })}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (!selectedExercises.includes(item.value)) {
                        setSelectedExercises([...selectedExercises, item.value])
                      } else {
                        setSelectedExercises(
                          selectedExercises.filter(
                            (exerciseId) => exerciseId !== item.value,
                          ),
                        )
                      }
                      // Haptics.selectionAsync()
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      )
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
            </View>
          ) : (
            <View className='h-full'>
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
  )
}
