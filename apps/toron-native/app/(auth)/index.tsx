import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import {
  useSupabaseUser,
  getProfile,
  getSplit,
  getTrainingDaysForSplit,
} from '@/lib/dbFunctions'

export default function Tab() {
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useSupabaseUser()

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
    enabled: !!user,
  })

  const {
    data: split,
    isLoading: splitLoading,
    isError: splitError,
  } = useQuery({
    queryKey: ['splits', profile?.currentSplitId],
    queryFn: () => getSplit({ id: profile?.currentSplitId }),
    enabled: !!profile?.currentSplitId,
  })

  // loading training days
  const {
    data: trainingDays,
    isLoading: trainingDaysLoading,
    isError: trainingDaysError,
  } = useQuery({
    queryKey: ['trainingDays', profile?.currentSplitId],
    queryFn: () =>
      getTrainingDaysForSplit({ splitId: profile?.currentSplitId }),
    enabled: !!profile?.currentSplitId,
  })

  return (
    <View className='flex-1 items-center justify-center gap-y-8'>
      <Text className='text-center text-xl font-extrabold'>
        {user && `Welcome to Toron,\n${user.data.user?.email}`}
      </Text>
      {split && (
        <Text className='text-center text-lg font-bold'>
          Current Split: {split.name}
        </Text>
      )}
      {trainingDays && (
        <>
          <Text className='text-center text-lg font-bold'>
            Training Days: {trainingDays.length}
          </Text>
          {trainingDays.map((day) => (
            <View key={day.id}>
              <Text>
                {day.order}: {day.name}
              </Text>
            </View>
          ))}
        </>
      )}

      <Link href='/session'>
        <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
          {/* show sessions from current split as a selector */}
          {/*this should default to the next session in the split*/}
          {/* if no split selected show link to pick a split */}
          {/* if no splits exist show a link to create a split */}
          <Text className='text-center text-xl font-bold text-white'>
            Start Next Split Session
          </Text>
        </View>
      </Link>

      <Link href='/session'>
        <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
          <Text className='text-center text-xl font-bold text-white'>
            Start Empty Session
          </Text>
        </View>
      </Link>
    </View>
  )
}
