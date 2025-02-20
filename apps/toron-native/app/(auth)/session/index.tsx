import { View, Text } from 'react-native'
import { Link, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { XCircleIcon } from 'lucide-react-native'

import AddSessionButton from '@/components/session/addSessionButton'
import DeleteSessionButton from '@/components/session/deleteSessionButton'
import { getSessions } from '@/lib/dbFunctions'
import { supabase } from '@/utils/supabase'

export default function App() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => supabase.auth.getUser(),
  })

  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
  } = useQuery({
    enabled: user !== undefined,
    queryKey: ['sessions'],
    queryFn: async () => getSessions({ userId: user!.data.user!.id }),
  })

  return (
    <View className='w-full flex-1'>
      <View className='items-center'>
        {user && (
          <AddSessionButton
            userId={user.data.user!.id}
            onCreate={(newSessionId) =>
              router.navigate(`/(auth)/session/${newSessionId}`)
            }
          >
            <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
              <Text className='text-center text-xl font-bold text-white'>
                New Session
              </Text>
            </View>
          </AddSessionButton>
        )}
      </View>

      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      <View className='mt-8 rounded-xl bg-gray-300 p-4'>
        <Text className='mb-4 font-bold'>Previous Sessions</Text>
        {sessions?.map((session) => (
          <View key={session.id} className='flex-row gap-4'>
            <Link href={`/(auth)/session/${session.id}`}>
              {
                session.id //.substring(0, 5)
              }
            </Link>
            {session.completed && <Text>Completed</Text>}
            <DeleteSessionButton sessionId={session.id}>
              <Text className='mt-1'>
                <XCircleIcon color='red' size={16} />
              </Text>
            </DeleteSessionButton>
          </View>
        ))}
      </View>
    </View>
  )
}
