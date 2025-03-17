import { useEffect, useState } from 'react'

import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native'
import * as Crypto from 'expo-crypto'
import { useNavigation } from 'expo-router'
import { FlashList } from '@shopify/flash-list'

import { useCreateSplitMutation } from '@/lib/mutations/splitMutations'
import { useCreateTrainingDayMutation } from '@/lib/mutations/trainingDayMutations'

const ModalScreen = () => {
  const [splitName, setSplitName] = useState('')
  const [rirTarget, setRirTarget] = useState(1)
  const [trainingDays, setTrainingDays] = useState<
    { id: string; name: string; order: number }[]
  >([])
  const [numTrainingDays, setNumTrainingDays] = useState(0)
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [editingDayName, setEditingDayName] = useState<string>('')
  const createSplitMutation = useCreateSplitMutation()
  const createTrainingDayMutation = useCreateTrainingDayMutation()
  const navigation = useNavigation()

  const handleTrainingDayNameChange = (id: string, name: string) => {
    setTrainingDays(
      trainingDays.map((day) => (day.id === id ? { ...day, name } : day)),
    )
  }

  const handleEditTrainingDay = (id: string, name: string) => {
    setEditingDayId(id)
    setEditingDayName(name)
  }

  const handleSaveTrainingDayName = (id: string) => {
    handleTrainingDayNameChange(id, editingDayName || '')
    setEditingDayId(null)
    setEditingDayName('')
  }

  const handleIncrementRir = () => {
    setRirTarget((prev) => Math.min(prev + 1, 5))
  }

  const handleDecrementRir = () => {
    setRirTarget((prev) => Math.max(prev - 1, 1))
  }

  const handleIncrementTrainingDays = () => {
    setTrainingDays([
      ...trainingDays,
      { id: Crypto.randomUUID(), name: '', order: trainingDays.length },
    ])
  }

  const handleDecrementTrainingDays = () => {
    setTrainingDays(trainingDays.slice(0, -1))
  }

  const handleSubmit = () => {
    const splitId = Crypto.randomUUID()
    createSplitMutation.mutate(
      { id: splitId, name: splitName, rirTarget },
      {
        onSuccess: () => {
          trainingDays.forEach((day) => {
            console.log('creating training day', day.name)
            createTrainingDayMutation.mutate(
              {
                id: Crypto.randomUUID(),
                splitId,
                name: day.name,
                order: day.order,
              },
              {
                onError: (error) => {
                  console.error('Error creating training day', error)
                },
                onSettled: () => {
                  // console.log('training day creation settled')
                },
                onSuccess: () => {
                  // console.log('training day created')
                },
              },
            )
          })
          navigation.goBack() // Dismiss the route / pop the stack
        },
        onError: (error) => {
          console.error('Error creating split', error)
        },
        onSettled: () => {
          // console.log('split creation settled')
        },
      },
    )
  }

  useEffect(() => {
    // start with 3 training days
    setTrainingDays([
      { id: Crypto.randomUUID(), name: '', order: 0 },
      { id: Crypto.randomUUID(), name: '', order: 1 },
      { id: Crypto.randomUUID(), name: '', order: 2 },
    ])
  }, [])

  useEffect(() => {
    setNumTrainingDays(trainingDays.length)
  }, [trainingDays])

  return (
    <View className='flex flex-1 items-center gap-5 p-4'>
      <View className='w-full text-left'>
        <Text className='text-lg font-bold text-black'>Split Name:</Text>
        <TextInput
          className='mt-5 h-10 border border-gray-400 px-2'
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
        <Text className='text-lg font-bold'>Training Days:</Text>
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
            disabled={numTrainingDays >= 10}
          />
        </View>
      </View>

      <View className='mt-2 flex w-4/5 flex-row items-center justify-between rounded-md bg-gray-400 p-2'>
        <FlashList
          data={trainingDays}
          keyExtractor={(item) => item.id}
          extraData={{ editingDayName, editingDayId }}
          renderItem={({ item, index }) => (
            <View
              key={item.id}
              className='flex flex-row items-center justify-between'
            >
              {editingDayId === item.id ? (
                <>
                  <TextInput
                    placeholder='Name'
                    value={editingDayName || ''}
                    onChangeText={(text) => setEditingDayName(text)}
                    style={{ borderWidth: 1, padding: 5, marginVertical: 5 }}
                  />
                  <Button
                    title='Save'
                    onPress={() => handleSaveTrainingDayName(item.id)}
                  />
                </>
              ) : (
                <>
                  <Text>{item.name ? item.name : 'Day ' + (index + 1)}</Text>
                  <Button
                    title='Edit'
                    onPress={() => handleEditTrainingDay(item.id, item.name)}
                  />
                </>
              )}
              <Button
                title='Delete'
                onPress={() => {
                  setTrainingDays(
                    trainingDays.filter((day) => day.id !== item.id),
                  )
                }}
              />
            </View>
          )}
          estimatedItemSize={50}
        />
      </View>
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
