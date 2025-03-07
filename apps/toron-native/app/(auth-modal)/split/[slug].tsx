import { ScrollView, Text, View, Button, Alert } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getProfile, getSplit } from '@/lib/dbFunctions'
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
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['splits', splitId],
    queryFn: () =>
      getSplit({
        id: splitId as string,
      }),
  })
  console.log({ split })

  const handleSelectSplit = () => {
    if (profileLoading || !profile) {
      return
    } else {
      console.log('update profile')
      console.log({ profile, splitId })
      Alert.alert('update profile', profile.id)
      Alert.alert('split id', splitId)

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

  return (
    <ScrollView>
      {/* <Link href='/(auth)/session'>Back</Link> */}
      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      {split && (
        <View>
          <Text>{split.id}</Text>
          <Text>{split.name}</Text>
          <Text>{split.rirTarget}</Text>
          {profile?.currentSplitId === split.id ? (
            <Text>Current Split</Text>
          ) : (
            <Button
              title='Select Split'
              onPress={handleSelectSplit}
              disabled={!profile}
            />
          )}
        </View>
        // TODO: edit button to enter edit mode
        // TODO: select split button thats sets the user's profile current split id to this one
      )}
    </ScrollView>
  )
}
