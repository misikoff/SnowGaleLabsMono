import { ScrollView, Text, View, Button, Alert } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import {
  getProfile,
  getSplit,
  getTrainingDaysForSplit,
} from '@/lib/dbFunctions'
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

  const {
    data: trainingDays,
    isLoading: trainingDaysLoading,
    isError: trainingDaysError,
  } = useQuery({
    queryKey: ['trainingDays', splitId],
    queryFn: () => getTrainingDaysForSplit({ splitId: splitId as string }),
    enabled: !!splitId,
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
      {trainingDaysLoading && <Text>Loading training days...</Text>}
      {trainingDaysError && <Text>Error loading training days</Text>}
      {trainingDays && (
        <View>
          <Text>Training Days:</Text>
          {trainingDays.map((day) => (
            <View key={day.id}>
              <Text>
                {day.order}: {day.name}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
