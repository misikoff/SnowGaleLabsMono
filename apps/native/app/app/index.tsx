import { View, Text } from 'react-native'
import { Link } from 'expo-router'

export default function Tab() {
  return (
    <View className='flex-1 items-center justify-center gap-y-8'>
      <Text className='text-3xl font-extrabold'>Welcome</Text>
      <Link href='/app/session'>
        <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
          <Text className='text-center text-xl font-bold text-white'>
            Start a Session
          </Text>
        </View>
      </Link>
    </View>
  )
}
