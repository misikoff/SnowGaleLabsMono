import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'

export default function Tab() {
  const user = useUser()

  return (
    <View className='flex-1 items-center justify-center gap-y-8'>
      <Text className='text-center text-xl font-extrabold'>
        {user.user?.primaryEmailAddress
          ? `Welcome to Centurion,\n${user.user.primaryEmailAddress}`
          : 'Welcome to Centurion'}
      </Text>
      <Link href='/session'>
        <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
          <Text className='text-center text-xl font-bold text-white'>
            Start a Session
          </Text>
        </View>
      </Link>
    </View>
  )
}
