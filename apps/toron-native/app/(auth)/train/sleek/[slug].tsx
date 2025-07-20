import { useState, useCallback } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import { getProfile, getSession, getMuscleGroups } from '@/lib/dbFunctions'
import { useUpdateProfileMutation } from '@/lib/mutations/profileMutations'
import CompleteSessionButton from '@/components/session/completeSessionButton'
import SleekSessionControls from '@/components/session/sleekSessionControls'

export default function SleekSessionPage() {
  const { slug: sessionId } = useLocalSearchParams()

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ['sessions', sessionId],
    queryFn: () =>
      getSession({
        sessionId: sessionId as string,
      }),
  })

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  })

  const {
    data: muscleGroups,
    isLoading: muscleGroupsLoading,
    isError: muscleGroupsError,
  } = useQuery({
    queryKey: ['muscleGroups'],
    queryFn: getMuscleGroups,
  })

  const updateProfileMutation = useUpdateProfileMutation()

  const handleCompleteSession = useCallback(async () => {
    if (profile?.activeSessionId) {
      await updateProfileMutation.mutateAsync({
        id: profile?.id,
        activeSessionId: null,
      })
    }
    router.back()
  }, [profile, updateProfileMutation])

  if (sessionLoading || profileLoading || muscleGroupsLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (sessionError || profileError || muscleGroupsError) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Error loading session</Text>
      </View>
    )
  }

  if (!session || !session.isSleek) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Session not found or not a sleek session</Text>
      </View>
    )
  }

  return (
    <ScrollView className='flex-1 p-4'>
      <View className='mb-6'>
        <Text className='text-2xl font-bold text-center mb-2'>
          Sleek Session
        </Text>
        <Text className='text-lg text-center text-gray-600 mb-4'>
          Track the muscle groups you're training today
        </Text>
      </View>

      {session && muscleGroups && (
        <SleekSessionControls
          session={session}
          muscleGroups={muscleGroups}
        />
      )}

      <CompleteSessionButton
        sessionId={session?.id}
        className='mt-8'
        onComplete={handleCompleteSession}
      >
        <View className='rounded-md bg-green-600 px-4 py-3 text-center'>
          <Text className='text-center text-xl font-bold text-white'>
            Complete Sleek Session
          </Text>
        </View>
      </CompleteSessionButton>
    </ScrollView>
  )
}