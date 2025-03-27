import {
  Alert,
  Button,
  //  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams, router, Link } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
// import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react-native'

// import AddExerciseButton from '@/components/session/addExerciseButton'
import CompleteSessionButton from '@/components/session/completeSessionButton'
import DeleteSessionButton from '@/components/session/deleteSessionButton'
// import SetGroupBlock from '@/components/session/setGroupBlock'
import { getSession } from '@/lib/dbFunctions'
import {
  useDeleteSessionExerciseMutation,
  useUpdateSessionExerciseMutation,
} from '@/lib/mutations/sessionExerciseMutations'

export default function Page() {
  const { slug: sessionId } = useLocalSearchParams()

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sessions', sessionId],
    queryFn: () =>
      getSession({
        sessionId: sessionId as string,
      }),
  })
  console.log({ session123: session })

  const deleteSessionExerciseMutation = useDeleteSessionExerciseMutation()
  const updateSessionExerciseMutation = useUpdateSessionExerciseMutation()

  return (
    <ScrollView>
      <Link href='/(auth)/train'>Back</Link>
      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      {session && (
        <View>
          {/* <Text>Session: {session.id.substring(0, 5)}</Text> */}

          <View className='gap-4'>
            <Text>
              Session Muscle Groups: {session.sessionExercises.length}
            </Text>
            {session.sessionExercises.map((sessionExercise, index) => (
              <View key={index}>
                <Text>
                  {sessionExercise.muscleGroup.name}: {sessionExercise.order}
                </Text>
                {/* add exercise button that brings up the select exercise modal with the muscle group's exercises highlighted */}
                {sessionExercise.exercise ? (
                  <>
                    <Text>{sessionExercise.exercise.name}</Text>
                    {session.id && (
                      <Button
                        title='Swap Exercise'
                        onPress={() =>
                          router.push(
                            `/(auth-modal)/add-exercise?sessionId=${session.id}&sessionExerciseId=${sessionExercise.id}&muscleGroupId=${sessionExercise.muscleGroup.id}`,
                          )
                        }
                      />
                    )}
                    <Button
                      title='Delete'
                      color='red'
                      onPress={() => {
                        Alert.alert(
                          'Delete Exercise',
                          'Are you sure you want to delete this exercise? All sets will be deleted.',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'OK',
                              onPress: async () => {
                                // TODO: delete session exercise and update other session exercise orders
                                await deleteSessionExerciseMutation
                                  .mutateAsync({
                                    sessionId: session.id,
                                    id: sessionExercise.id,
                                  })
                                  .then(async () => {
                                    // iterate over sessionExercises and update the order
                                    await session.sessionExercises.forEach(
                                      async (se, index1) => {
                                        if (se.order > sessionExercise.order) {
                                          // se.order = se.order - 1
                                          await updateSessionExerciseMutation.mutateAsync(
                                            {
                                              id: se.id,
                                              order: index1 - 1,
                                            },
                                          )
                                        }
                                      },
                                    )
                                  })
                              },
                            },
                          ],
                          // { cancelable: true },
                        )
                      }}
                    />
                  </>
                ) : (
                  <>
                    {session.id && (
                      <Button
                        title='Pick Exercise'
                        onPress={() =>
                          router.push(
                            `/(auth-modal)/add-exercise?sessionId=${session.id}&sessionExerciseId=${sessionExercise.id}&muscleGroupId=${sessionExercise.muscleGroup.id}`,
                          )
                        }
                      />
                    )}
                  </>
                )}
              </View>
            ))}

            <Button
              title='Add Another Exercise'
              onPress={() =>
                router.push(
                  `/(auth-modal)/add-exercise?sessionId=${session.id}&order=${session.sessionExercises.length}`,
                )
              }
            />

            {/* <Text>Set Groups: {session.setGroups.length}</Text> */}

            {/* {session.setGroups
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
              ))} */}
          </View>
        </View>
      )}

      <CompleteSessionButton session={session}>
        <View className='rounded-md bg-green-600 px-3 py-2 text-center'>
          <Text className='text-center text-xl font-bold text-white'>
            <Text>Complete Session</Text>
          </Text>
        </View>
      </CompleteSessionButton>

      {session?.id && (
        <DeleteSessionButton
          sessionId={session.id}
          onDelete={() => {
            router.navigate('/(auth)/train')
          }}
        >
          <View className='rounded-md bg-red-600 px-3 py-2 text-center'>
            <Text className='text-center text-xl font-bold text-white'>
              <Text>Delete Session</Text>
            </Text>
          </View>
        </DeleteSessionButton>
      )}
    </ScrollView>
  )
}
