import { useEffect, useState } from 'react'

import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native'
import * as Crypto from 'expo-crypto'
import { useNavigation } from 'expo-router'

import SplitDayInput from '@/components/split/dayInput'
import { createSessionExercise } from '@/lib/dbFunctions'
import { useCreateSessionMutation } from '@/lib/mutations/sessionMutations'
import { useCreateSplitMutation } from '@/lib/mutations/splitMutations'

const MAX_TRAINING_DAYS = 12

const ModalScreen = () => {
  const [splitName, setSplitName] = useState('')
  const [rirTarget, setRirTarget] = useState(1)
  const [restDayType, setRestDayType] = useState<'Planned' | 'Dynamic'>(
    'Planned',
  )
  const [trainingDays, setTrainingDays] = useState<
    { id: string; name: string; order: number; muscleGroups?: string[] }[]
  >([])
  const [numTrainingDays, setNumTrainingDays] = useState(0)

  const createSplitMutation = useCreateSplitMutation()
  const createSessionMutation = useCreateSessionMutation()
  const navigation = useNavigation()

  const handleIncrementRir = () => {
    setRirTarget((prev) => Math.min(prev + 1, 5))
  }

  const handleDecrementRir = () => {
    setRirTarget((prev) => Math.max(prev - 1, 1))
  }

  const handleIncrementTrainingDays = () => {
    setNumTrainingDays((prev) => Math.min(prev + 1, MAX_TRAINING_DAYS))
  }

  const handleDecrementTrainingDays = () => {
    setNumTrainingDays((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    console.log('submit split')
    const splitId = Crypto.randomUUID()

    await new Promise((resolve, reject) => {
      createSplitMutation.mutate(
        { id: splitId, name: splitName, rirTarget },
        {
          onSuccess: resolve,
          onError: reject,
        },
      )
    })

    // TODO: make this all parallel
    // Create all training days and their associated muscle groups
    const trainingDayPromises = trainingDays.map(async (day, dayIndex) => {
      const sessionId = Crypto.randomUUID()

      // Create the session for the training day
      await createSessionMutation.mutateAsync({
        id: sessionId,
        splitTemplateId: splitId,
        isRestDay:
          restDayType === 'Planned' && (day.muscleGroups?.length || 0) === 0,
        name: day.name,
        order: dayIndex,
      })

      // Create muscle groups for the session
      if (day.muscleGroups) {
        const muscleGroupPromises = day.muscleGroups.map(
          (muscleGroupId, muscleGroupIndex) =>
            createSessionExercise({
              sessionId,
              muscleGroupId,
              order: muscleGroupIndex,
            }),
        )

        // Wait for all muscle group creations to complete
        return muscleGroupPromises
      }
    })

    // Wait for all training day promises to complete
    await Promise.all(trainingDayPromises)
    console.log('training days created')

    navigation.goBack() // Dismiss the route / pop the stack
  }

  useEffect(() => {
    // start with 3 training days
    setTrainingDays([
      { id: Crypto.randomUUID(), name: '', order: 0 },
      { id: Crypto.randomUUID(), name: '', order: 1 },
      { id: Crypto.randomUUID(), name: '', order: 2 },
    ])
  }, [])

  return (
    <View className='flex flex-1 items-center gap-2 p-4'>
      <View className='w-full flex-row items-center justify-between gap-2'>
        <Text className='text-lg font-bold text-black'>Split Name:</Text>
        <TextInput
          className='flex-grow border border-gray-400 px-2'
          placeholder='Push / Pull / Legs'
          value={splitName}
          onChangeText={setSplitName}
        />
      </View>
      <View className='h-10 w-full flex-row items-center justify-between'>
        <Text className='text-lg font-bold'>RIR Target:</Text>
        <View className='flex-row items-center gap-2'>
          <Button
            title='-'
            onPress={handleDecrementRir}
            disabled={rirTarget <= 0}
          />
          <Text className='mt-1 w-8 text-center text-lg'>{rirTarget}</Text>
          <Button
            title='+'
            onPress={handleIncrementRir}
            disabled={rirTarget >= 5}
          />
        </View>
      </View>

      <View className='h-10 w-full flex-row items-center justify-between'>
        <Text className='text-lg font-bold'>Rest Days:</Text>
        <View className='flex-row items-center gap-2'>
          <Button
            title='Planned'
            onPress={() => setRestDayType('Planned')}
            disabled={restDayType === 'Planned'}
          />
          <Button
            title='Dynamic'
            onPress={() => setRestDayType('Dynamic')}
            disabled={restDayType === 'Dynamic'}
          />
        </View>
      </View>

      <View className='h-10 w-full flex-row items-center justify-between'>
        <Text className='text-lg font-bold'>
          {restDayType === 'Planned' ? 'Cycle Length' : 'Training Days'}
        </Text>
        <View className='flex-row items-center gap-2'>
          <Button
            title='-'
            onPress={handleDecrementTrainingDays}
            disabled={numTrainingDays <= 1}
          />
          <Text className='mt-1 w-8 text-center text-lg'>
            {numTrainingDays}
          </Text>
          <Button
            title='+'
            onPress={handleIncrementTrainingDays}
            disabled={numTrainingDays >= MAX_TRAINING_DAYS}
          />
        </View>
      </View>

      {/* todo watch for changes in training days */}
      <SplitDayInput
        restDayType={restDayType}
        numTrainingDays={numTrainingDays}
        trainingDays={trainingDays}
        setTrainingDays={setTrainingDays}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        className='rounded-md bg-green-400 p-4'
      >
        <Text className='text-lg font-bold text-white'>Create Split</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalScreen
