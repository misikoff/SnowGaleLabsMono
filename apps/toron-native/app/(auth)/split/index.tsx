import React from 'react'

import { View, Text, Button } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { XCircleIcon } from 'lucide-react-native'

import AddSessionButton from '@/components/session/addSessionButton'
import DeleteSessionButton from '@/components/session/deleteSessionButton'
import { getSplits } from '@/lib/dbFunctions'
import { supabase } from '@/utils/supabase'

function HomeScreen() {
  const router = useRouter()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => supabase.auth.getUser(),
  })

  const {
    data: splits,
    isLoading: splitsLoading,
    isError: splitsError,
  } = useQuery({
    enabled: user !== undefined,
    queryKey: ['splits'],
    queryFn: async () => getSplits(),
  })

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
            <Link href={`/(auth)/split/${split.id}`}>
              <Text>{split.id}</Text>
            </Link>
          </View>
        ))}
      </View>

      <Button
        title='Show Split Modal'
        onPress={() => router.push('/(auth-modal)/split')}
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
