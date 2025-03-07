import { View, Text, Button } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getProfile, getSplits } from '@/lib/dbFunctions'

function HomeScreen() {
  const router = useRouter()

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

  console.log('profile', profile)
  console.log({ profileNow: profile })
  return (
    <View className='w-full flex-1'>
      <View className='items-center' />

      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      <View className='mt-8 rounded-xl bg-gray-300 p-4'>
        <Text className='mb-4 font-bold'>Splits</Text>
      </View>
      {/* print profile id */}
      <View className='flex flex-row items-center justify-between rounded-md bg-gray-200 p-2'>
        <Text>
          profile: {profile?.id}, {profile?.currentSplitId}
        </Text>
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
                <Text>Current Split</Text>
              )}
            </Link>
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
