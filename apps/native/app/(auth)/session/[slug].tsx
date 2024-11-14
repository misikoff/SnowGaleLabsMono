import { Pressable, ScrollView, Text, View } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react-native'

import { SetGroupWithExerciseAndSets } from '@repo/db/schema'
import AddExerciseButton from '@/components/session/addExerciseButton'
import CompleteSessionButton from '@/components/session/completeSessionButton'
import SetGroupBlock from '@/components/session/setGroupBlock'
import { getSession, updateSetGroup } from '@/lib/dbFunctions'

export default function Page() {
  const { slug: sessionId } = useLocalSearchParams()
  const queryClient = useQueryClient()

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

  const updateSetGroupOrderMutation = useMutation({
    mutationFn: async ({
      index1,
      index2,
    }: {
      index1: number
      index2: number
    }) => {
      const curSession = session!
      const setGroup1 = curSession.setGroups[index1]
      const setGroup2 = curSession.setGroups[index2]
      const order1 = curSession.setGroups[index1].order
      const order2 = curSession.setGroups[index2].order
      updateSetGroup({ id: setGroup1.id, order: order2 })
      updateSetGroup({ id: setGroup2.id, order: order1 })
    },
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (indices) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', sessionId])
      const nextSession = produce(previousSession, (draft: any) => {
        const order1 = draft.setGroups[indices.index1].order
        const order2 = draft.setGroups[indices.index2].order
        draft.setGroups[indices.index1].order = order2
        draft.setGroups[indices.index2].order = order1
        draft.setGroups = draft.setGroups.sort(
          (a: SetGroupWithExerciseAndSets, b: SetGroupWithExerciseAndSets) => {
            // handle a.order being undefined
            if (a.order === null || b.order === null) {
              return -1
            }
            return a.order - b.order
          },
        )
      })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', sessionId], nextSession)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newOrder, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newOrder, context })
      queryClient.setQueryData(['session', sessionId], context?.previousSession)
    },
    onSuccess: () => {
      console.log('success')
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', sessionId],
      })
    },
  })

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
