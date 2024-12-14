import { View } from 'react-native'
import { Slot } from 'expo-router'

export default function SettingsLayout() {
  return (
    <View className='h-full'>
      <Slot />
    </View>
  )
}
