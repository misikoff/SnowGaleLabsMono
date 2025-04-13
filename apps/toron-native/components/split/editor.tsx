import { useState } from 'react'

import { Button, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import SplitDayInput from '@/components/split/dayInput'

const MAX_TRAINING_DAYS = 12
export default function SplitEditor({
  split,
  trainingDays,
  onCreateSplit,
  onUpdateSplit,
}: {
  split?: {
    id: string
    name: string | null
    rirTarget: number | null
    plannedRestDays: boolean | null
  } | null
  trainingDays: {
    id: string
    name: string
    order: number
    muscleGroups?: string[]
  }[]
  onCreateSplit?: (
    trainingDays: {
      id: string
      name: string
      order: number
      muscleGroups?: string[]
    }[],
    splitName: string,
    rirTarget: number,
    plannedRestDays: boolean,
  ) => Promise<void>
  onUpdateSplit?: (
    trainingDays: {
      id: string
      name: string
      order: number
      muscleGroups?: string[]
    }[],
    splitName: string,
    rirTarget: number,
    plannedRestDays: boolean,
  ) => Promise<void>
}) {
  const [splitName, setSplitName] = useState(split?.name || '')
  const [rirTarget, setRirTarget] = useState(split?.rirTarget || 1)
  const [plannedRestDays, setPlannedRestDays] = useState<boolean>(
    split?.plannedRestDays || true,
  )
  const [numTrainingDays, setNumTrainingDays] = useState(
    trainingDays.length || 0,
  )
  const [curTrainingDays, setCurTrainingDays] = useState(trainingDays)

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
            onPress={() => setPlannedRestDays(true)}
            disabled={plannedRestDays}
          />
          <Button
            title='Dynamic'
            onPress={() => setPlannedRestDays(false)}
            disabled={!plannedRestDays}
          />
        </View>
      </View>

      <View className='h-10 w-full flex-row items-center justify-between'>
        <Text className='text-lg font-bold'>
          {plannedRestDays ? 'Cycle Length' : 'Training Days'}
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

      {trainingDays.length > 0 && (
        <SplitDayInput
          trainingDays={curTrainingDays}
          setTrainingDays={setCurTrainingDays}
          numTrainingDays={numTrainingDays}
          plannedRestDays={plannedRestDays}
        />
      )}

      <TouchableOpacity
        onPress={async () => {
          if (onCreateSplit) {
            await onCreateSplit(
              curTrainingDays,
              splitName,
              rirTarget,
              plannedRestDays,
            ).catch((error) => {
              console.error('Error creating split:', error)
            })
          } else if (onUpdateSplit) {
            await onUpdateSplit(
              curTrainingDays,
              splitName,
              rirTarget,
              plannedRestDays,
            ).catch((error) => {
              console.error('Error updating split:', error)
            })
          }
        }}
        className='rounded-md bg-green-400 p-4'
      >
        <Text className='text-lg font-bold text-white'>
          {onCreateSplit ? 'Create' : 'Update'} Split
        </Text>
      </TouchableOpacity>
    </View>
  )
}
