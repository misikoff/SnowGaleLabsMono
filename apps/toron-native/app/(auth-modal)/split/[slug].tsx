import { ScrollView, Text, View, Button } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getProfile, getSessions, getSplit } from '@/lib/dbFunctions'
import { useUpdateProfileMutation } from '@/lib/mutations/profileMutations'

export default function Page() {
  const { slug: splitId } = useLocalSearchParams()
  const updateProfileMutation = useUpdateProfileMutation()
  const navigation = useNavigation()

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  })

  const {
    data: split,
    isLoading: splitLoading,
    isError: splitError,
  } = useQuery({
    queryKey: ['splits', splitId],
    queryFn: () =>
      getSplit({
        id: splitId as string,
      }),
  })

  // fetch sessions for training days
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
  } = useQuery({
    queryKey: ['sessions', splitId],
    queryFn: () => getSessions({ splitTemplateId: splitId as string }),
    enabled: !!splitId,
  })

  console.log({ sessions })
  console.log({
    ex: sessions && sessions[0].sessionExercises,
  })

  const handleSelectSplit = () => {
    if (profileLoading || !profile) {
      return
    } else {
      updateProfileMutation.mutate(
        {
          id: profile.id, // Replace with the actual user ID
          currentSplitId: splitId as string,
        },
        {
          onSuccess: () => {
            navigation.goBack() // Dismiss the route / pop the stack
          },
        },
      )
    }
  }

  const handledDeselectSplit = () => {
    if (profileLoading || !profile) {
      return
    }
    updateProfileMutation.mutate(
      {
        id: profile.id,
        currentSplitId: null,
      },
      {
        onSuccess: () => {
          navigation.goBack() // Dismiss the route / pop the stack
        },
      },
    )
  }

  return (
    <ScrollView>
      {/* <Link href='/(auth)/session'>Back</Link> */}
      {splitLoading && <Text>Loading...</Text>}
      {splitError && <Text>Error</Text>}
      {split && (
        <View>
          <Text>{split.id}</Text>
          <Text>{split.name}</Text>
          <Text>{split.rirTarget}</Text>
          {profile?.currentSplitId === split.id ? (
            <>
              <Text>Current Split</Text>
              <Button
                title='Deselect Split'
                onPress={handledDeselectSplit}
                disabled={!profile}
              />
            </>
          ) : (
            <Button
              title='Select Split'
              onPress={handleSelectSplit}
              disabled={!profile}
            />
          )}
        </View>
      )}
      {sessionsLoading && <Text>Loading training days...</Text>}
      {sessionsError && <Text>Error loading training days</Text>}
      {sessions && (
        <View>
          <Text>Training Days:</Text>
          {sessions.map((day) => (
            <View key={day.id}>
              <Text>
                day:{day.order}: {day.name}
              </Text>
              {/* show exercises */}
              {day.sessionExercises.map((x) => (
                <View key={x.id}>
                  <Text>
                    order:{x.order}: {x.muscleGroup.name}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
