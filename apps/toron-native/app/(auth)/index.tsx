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
          {/* show sessions from current split as a selector */}
          {/*this should default to the next session in the split*/}
          {/* if no split selected show link to pick a split */}
          {/* if no splits exist show a link to create a split */}
          <Text className='text-center text-xl font-bold text-white'>
            Start a Session
          </Text>
          {/* also show button to start free form session */}
        </View>
      </Link>
    </View>
  )
}
