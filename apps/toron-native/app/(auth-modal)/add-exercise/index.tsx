import { useEffect, useState } from 'react'

import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import * as Crypto from 'expo-crypto'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

import { getExercises, getMuscleGroups } from '@/lib/dbFunctions'
import {
  useCreateSessionExerciseMutation,
  useUpdateSessionExerciseMutation,
} from '@/lib/mutations/sessionExerciseMutations'

const ModalScreen = () => {
  const { sessionId, sessionExerciseId, muscleGroupId, order } =
    useLocalSearchParams()
  console.log({ sessionId, sessionExerciseId, muscleGroupId })

  const [selectedExercise, setSelectedExercise] = useState()
  const [filteredMuscleGroupId, setFilteredMuscleGroupId] = useState<
    string | null
  >(muscleGroupId)
  const createSessionExerciseMutation = useCreateSessionExerciseMutation()
  const updateSessionExerciseMutation = useUpdateSessionExerciseMutation()

  const navigation = useNavigation()

  const {
    data: muscleGroups,
    isLoading: muscleGroupsLoading,
    isError: muscleGroupsError,
  } = useQuery({
    queryKey: ['muscleGroups'],
    queryFn: async () => getMuscleGroups(),
  })

  const {
    data: exercises,
    isLoading: exercisesLoading,
    isError: exercisesError,
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => getExercises(),
  })

  const handleSubmit = async () => {
    console.log({ selectedExercise })
    if (!sessionExerciseId) {
      const params: any = {
        id: Crypto.randomUUID(),
        muscleGroupId: selectedExercise?.muscleGroupId,
        sessionId: sessionId as string,
        exerciseId: selectedExercise?.id,
      }
      if (order) {
        params['order'] = order
      }
      await createSessionExerciseMutation
        .mutateAsync(params)
        .then(() => {
          console.log('Exercise created')
          navigation.goBack() // Dismiss the route / pop the stack
        })
        .catch((error) => {
          console.error('Error creating session exercise:', error)
        })
    } else {
      await updateSessionExerciseMutation
        .mutateAsync({
          id: sessionExerciseId,
          exerciseId: selectedExercise?.id,
        })
        .then(() => {
          console.log('Exercise updated')
          navigation.goBack() // Dismiss the route / pop the stack
        })
    }
  }

  return (
    <View className='flex flex-1 items-center gap-5 p-4'>
      <View className='w-full text-left'>
        <Text className='text-lg font-bold text-black'>Pick Exercise</Text>
      </View>

      {/* Muscle Group Filter Section */}
      {muscleGroups && (
        <View className='flex flex-row flex-wrap gap-2 p-2'>
          {muscleGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              onPress={() =>
                setFilteredMuscleGroupId(
                  filteredMuscleGroupId === group.id ? null : group.id,
                )
              }
              className={clsx(
                'rounded-full px-4 py-2',
                filteredMuscleGroupId === group.id
                  ? 'bg-blue-500'
                  : 'bg-gray-300',
              )}
            >
              <Text
                className={clsx(
                  'text-sm font-bold',
                  filteredMuscleGroupId === group.id
                    ? 'text-white'
                    : 'text-black',
                )}
              >
                {group.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Clear Filter Button */}
      {/* <View className='mt-4 w-full'>
        {filteredMuscleGroupId && (
          <Button
            title='Clear Filter'
            onPress={() => {
              setFilteredMuscleGroupId(null)
            }}
          />
        )}
      </View> */}

      {/* Exercise List */}
      <View className='mt-2 flex max-h-40 flex-row items-center justify-between rounded-md bg-gray-400 p-2'>
        <FlashList
          data={exercises?.filter(
            (exercise) =>
              !filteredMuscleGroupId ||
              exercise.muscleGroupId === filteredMuscleGroupId,
          )}
          keyExtractor={(item) => item.id}
          extraData={{ selectedExercise }}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setSelectedExercise(item)}>
              <View key={item.id} className='flex justify-between'>
                <View
                  className={clsx(
                    'flex flex-row items-center justify-between',
                    selectedExercise?.id === item.id && 'bg-red-300',
                  )}
                >
                  <Text>{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          estimatedItemSize={50}
        />
      </View>

      <Text>order: {order}</Text>

      {/* Submit Button */}
      <View className='mt-4 w-full'>
        <Button
          title='Select Exercise'
          disabled={!selectedExercise}
          onPress={() => {
            handleSubmit()
          }}
        />
      </View>
    </View>
  )
}

export default ModalScreen
