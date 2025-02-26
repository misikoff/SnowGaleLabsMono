import { View, Text } from 'react-native'
import { Link } from 'expo-router'

import { useSupabaseUser } from '@/lib/dbFunctions'

export default function Tab() {
  const { data: user, isLoading, isError } = useSupabaseUser()

  return (
    <View className='flex-1 items-center justify-center gap-y-8'>
      <Text className='text-center text-xl font-extrabold'>
        {user && `Welcome to Toron,\n${user.data.user?.email}`}
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
