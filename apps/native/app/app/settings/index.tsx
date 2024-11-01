import { View, Text, Pressable } from 'react-native'
import { Link, router } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useQuery } from '@tanstack/react-query'
import { XCircleIcon } from 'lucide-react-native'

import AddSessionButton from '@/components/session/addSessionButton'
import DeleteSessionButton from '@/components/session/deleteSessionButton'
import { getSessions } from '@/lib/dbFunctions'

export default function App() {
  const user = useUser()
  const userId = user.user!.id
  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => getSessions({ userId }),
  })

  return (
    <View className='w-full flex-1'>
      <Link href='/'>/</Link>
      <View className='items-center'>
        <Text>Settings</Text>
        <Pressable
          onPress={() => {
            console.log('Sign Out')
          }}
        >
          <Text>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  )
}
