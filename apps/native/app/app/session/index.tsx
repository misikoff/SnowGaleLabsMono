import { View, Text } from 'react-native'
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
      <Text>Sessions</Text>
      <Link href='/'>/</Link>
      <AddSessionButton
        userId={userId}
        onCreate={(newSessionId) =>
          router.navigate(`/app/session/${newSessionId}`)
        }
      >
        <Text>New Session</Text>
      </AddSessionButton>

      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}

      {sessions?.map((session) => (
        <View key={session.id} className='flex-row gap-4'>
          <Link href={`/app/session/${session.id}`}>
            {session.id.substring(0, 5)}
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
  )
}
