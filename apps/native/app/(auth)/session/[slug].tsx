import { ScrollView, Text, View } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useQuery } from '@tanstack/react-query'

import { SetGroupWithExerciseAndSets } from '@repo/db/schema'
import AddExerciseButton from '@/components/session/addExerciseButton'
import CompleteSessionButton from '@/components/session/completeSessionButton'
import SetGroupBlock from '@/components/session/setGroupBlock'
import { getSession } from '@/lib/dbFunctions'

export default function Page() {
  const { slug: sessionId } = useLocalSearchParams()
  const user = useUser()
  const userId = user.user!.id
  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession({ userId, sessionId: sessionId as string }),
  })
  console.log({ session })

  return (
    <ScrollView>
      <Link href='/(auth)/session'>Back</Link>
      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      {session && (
        <View>
          {/* <Text>Session: {session.id.substring(0, 5)}</Text> */}

          <View className='gap-4'>
            {/* <Text>Set Groups: {session.setGroups.length}</Text> */}
            {session.setGroups
              .sort(
                (
                  s1: SetGroupWithExerciseAndSets,
                  s2: SetGroupWithExerciseAndSets,
                ) => {
                  if (s1.order && s2.order) {
                    return s1.order - s2.order
                  } else if (s1.order) {
                    return -1
                  } else {
                    return 1
                  }
                },
              )
              .map((setGroup: SetGroupWithExerciseAndSets) => (
                <SetGroupBlock setGroup={setGroup} />
              ))}
          </View>
        </View>
      )}

      <AddExerciseButton session={session}>
        <View className='rounded-md bg-teal-600 px-3 py-2 text-center'>
          <Text className='text-center text-xl font-bold text-white'>
            <Text>Add Exercise</Text>
          </Text>
        </View>
      </AddExerciseButton>

      <CompleteSessionButton session={session}>
        <View className='rounded-md bg-green-600 px-3 py-2 text-center'>
          <Text className='text-center text-xl font-bold text-white'>
            <Text>Complete Session</Text>
          </Text>
        </View>
      </CompleteSessionButton>
    </ScrollView>
  )
}
