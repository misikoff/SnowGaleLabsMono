import { useState } from 'react'

import { View, Text, TextInput, Button } from 'react-native'
import * as Crypto from 'expo-crypto'
import { Stack, useNavigation } from 'expo-router'

import { useCreateSplitMutation } from '@/lib/mutations/splitMutations'

const ModalScreen = () => {
  const [splitName, setSplitName] = useState('')
  const [rirTarget, setRirTarget] = useState('')
  const createSplitMutation = useCreateSplitMutation()
  const navigation = useNavigation()

  const handleSubmit = () => {
    createSplitMutation.mutate(
      { id: Crypto.randomUUID(), name: splitName, rirTarget },
      {
        onSuccess: () => {
          navigation.goBack() // Dismiss the route / pop the stack
        },
      },
    )
  }

  return (
    <View className='flex flex-1 items-center justify-center bg-white'>
      <Stack.Screen
        options={{
          title: 'New Split',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Text className='text-lg text-black'>
        This is a basic split modal screen
      </Text>
      <TextInput
        className='mt-5 h-10 w-4/5 border border-gray-400 px-2'
        placeholder='Enter split name'
        value={splitName}
        onChangeText={setSplitName}
      />
      <TextInput
        className='mt-5 h-10 w-4/5 border border-gray-400 px-2'
        placeholder='Enter RIR target'
        value={rirTarget}
        onChangeText={setRirTarget}
      />
      <Button title='Create Split' onPress={handleSubmit} />
    </View>
  )
}

export default ModalScreen
