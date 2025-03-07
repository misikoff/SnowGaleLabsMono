import { View, Text, Button, Alert } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  getProfile,
  getSplits,
  deleteSplit,
  updateProfile,
} from '@/lib/dbFunctions'

function HomeScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  })

  const {
    data: splits,
    isLoading: splitsLoading,
    isError: splitsError,
  } = useQuery({
    queryKey: ['splits'],
    queryFn: async () => getSplits(),
  })

  const deleteSplitMutation = useMutation({
    mutationFn: deleteSplit,
    onSuccess: () => {
      queryClient.invalidateQueries(['splits'])
      queryClient.invalidateQueries(['profile'])
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile'])
    },
  })

  const handleDeleteSplit = (splitId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this split?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // consider handling this with a database trigger instead
            // for clearing the currentSplitId
            // if it matches the splitId to be deleted
            if (profile?.currentSplitId === splitId) {
              updateProfileMutation.mutate(
                {
                  id: profile.id,
                  currentSplitId: null,
                },
                {
                  onSuccess: () => {
                    deleteSplitMutation.mutate({ id: splitId })
                  },
                },
              )
            } else {
              deleteSplitMutation.mutate({ id: splitId })
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <View className='w-full flex-1'>
      <View className='items-center' />

      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      <View className='mt-8 rounded-xl bg-gray-300 p-4'>
        <Text className='mb-4 font-bold'>Splits</Text>
      </View>

      {/* list of split ids */}
      <View className='flex flex-col gap-2'>
        {splits?.map((split) => (
          <View
            key={split.id}
            className='flex flex-row items-center justify-between rounded-md bg-gray-200 p-2'
          >
            <Link href={`/(auth-modal)/split/${split.id}`}>
              <Text>
                {split.id.substring(0, 5)}: {split.name}
              </Text>
              {split.id === profile?.currentSplitId && (
                <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
                  <Text className='text-white'> Current Split</Text>
                </View>
              )}
            </Link>
            <Button
              title='Delete'
              color='red'
              onPress={() => handleDeleteSplit(split.id)}
            />
          </View>
        ))}
      </View>

      <Button
        title='Show Split Modal'
        onPress={() => router.push('/(auth-modal)/split/new')}
      />
      <Button
        title='Show Test Modal'
        onPress={() => router.push('/(auth-modal)/test')}
      />
      <Button
        title='Show Auth Modal Index'
        onPress={() => router.push('/(auth-modal)')}
      />
    </View>
  )
}

export default HomeScreen
