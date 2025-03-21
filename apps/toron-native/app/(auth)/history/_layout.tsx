import { View } from 'react-native'
import { Slot } from 'expo-router'

export default function HistoryLayout() {
  return (
    <View className='h-full px-4 py-2'>
      <Slot />
    </View>
  )
}
