import { Pressable, ScrollView, Text, View } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react-native'

import { SetGroupWithExerciseAndSets } from '@repo/db/schema'
import AddExerciseButton from '@/components/session/addExerciseButton'
import CompleteSessionButton from '@/components/session/completeSessionButton'
import SetGroupBlock from '@/components/session/setGroupBlock'
import { getSession, useSupabaseUser } from '@/lib/dbFunctions'
import { useUpdateSetGroupOrderMutation } from '@/lib/mutations/setGroupMutations'

export default function Page() {
  const { slug: sessionId } = useLocalSearchParams()

  const { data: user } = useSupabaseUser()

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    enabled: user !== undefined,
    queryKey: ['sessions', sessionId],
    queryFn: () =>
      getSession({
        userId: user!.data.user?.id,
        sessionId: sessionId as string,
      }),
  })
  console.log({ session })

  const updateSetGroupOrderMutation = useUpdateSetGroupOrderMutation()

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
              .map((setGroup: SetGroupWithExerciseAndSets, index: number) => (
                <View key={index}>
                  <Pressable
                    disabled={index === 0}
                    onPress={async () => {
                      await updateSetGroupOrderMutation.mutateAsync({
                        index1: index,
                        index2: index - 1,
                        session,
                        sessionId: setGroup.sessionId,
                      })
                    }}
                  >
                    <ArrowUpWideNarrow />
                  </Pressable>
                  <Pressable
                    disabled={index === session.setGroups.length - 1}
                    onPress={async () => {
                      await updateSetGroupOrderMutation.mutateAsync({
                        index1: index,
                        index2: index + 1,
                        session,
                        sessionId: setGroup.sessionId,
                      })
                    }}
                  >
                    <ArrowDownWideNarrow />
                  </Pressable>
                  <SetGroupBlock setGroup={setGroup} />
                </View>
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
