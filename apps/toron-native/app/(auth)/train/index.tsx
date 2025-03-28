import { useState, useEffect, useCallback } from 'react'

import { View, Text } from 'react-native'
import { Link, router, useFocusEffect } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import AddSessionButton from '@/components/session/addSessionButton'
import {
  useSupabaseUser,
  getProfile,
  getSplit,
  getSessionsForCalendar,
  getSessions,
  updateProfile,
} from '@/lib/dbFunctions'

export default function Tab() {
  const [nextTrainingDay, setNextTrainingDay] = useState<TrainingDay | null>(
    null,
  )

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useSupabaseUser()

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
    // enabled: !!user,
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

  const {
    data: trainingDays,
    isLoading: trainingDaysLoading,
    isError: trainingDaysError,
  } = useQuery({
    queryKey: ['trainingDays', profile?.currentSplitId],
    queryFn: () => getSessions({ splitTemplateId: profile?.currentSplitId }),
    enabled: !!profile?.currentSplitId,
  })

  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
    refetch: sessionsRefetch,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => getSessionsForCalendar(),
  })

  useFocusEffect(
    useCallback(() => {
      // Refetch sessions when the screen comes into focus
      sessionsRefetch()
      profileRefetch()
    }, [profileRefetch, sessionsRefetch]),
  )

  useEffect(() => {
    if (sessions && trainingDays) {
      if (sessions.length === 0 && trainingDays.length) {
        setNextTrainingDay(trainingDays[0])
        return
      }
      const lastSession = sessions[sessions.length - 1]

      const lastTrainingDay = trainingDays.find(
        (day) => day.id === lastSession?.clonedFromSessionId,
      )

      if (!lastTrainingDay) {
        // set next training day to the first training day
        setNextTrainingDay(trainingDays[0])
      } else {
        const nextTrainingDayOrder =
          (lastTrainingDay?.order ?? -1 + 1) % trainingDays.length
        const nextDay = trainingDays.find(
          (day) => day.order === nextTrainingDayOrder,
        )
        if (nextDay) {
          setNextTrainingDay(nextDay)
        }
      }
    }
  }, [sessions, trainingDays])

  // Shared memoized onCreate function
  const handleOnCreate = useCallback(
    async (newSessionId: string) => {
      if (profile) {
        await updateProfile({
          id: profile.id,
          activeSessionId: newSessionId,
        }).then(() => {
          router.navigate(`/(auth)/train/session/${newSessionId}`)
        })
      }
    },
    [profile],
  )

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
      {profile?.activeSessionId ? (
        <Link href={`/(auth)/train/session/${profile.activeSessionId}`}>
          <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
            <Text className='text-center text-xl font-bold text-white'>
              Resume Active Session
            </Text>
          </View>
        </Link>
      ) : (
        <>
          {nextTrainingDay && (
            <Text className='text-center text-lg font-bold'>
              Next Training Day: {nextTrainingDay.name}
            </Text>
          )}

          {/* if split is undefined show link to splits */}
          {split ? (
            <AddSessionButton
              date={new Date().toISOString()}
              onCreate={handleOnCreate}
              fromTemplate={nextTrainingDay}
            >
              <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
                <Text className='text-center text-xl font-bold text-white'>
                  Start Next Split Session
                </Text>
              </View>
            </AddSessionButton>
          ) : (
            <Link href='/(auth)/split'>
              <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
                {/* TODO: if no splits make this go directly to creating a split */}
                <Text className='text-center text-xl font-bold text-white'>
                  Pick or Create a Split
                </Text>
              </View>
            </Link>
          )}

          <AddSessionButton
            date={new Date().toISOString()}
            onCreate={handleOnCreate}
          >
            <View className='rounded-md bg-blue-600 px-3 py-2 text-center'>
              <Text className='text-center text-xl font-bold text-white'>
                New Session
              </Text>
            </View>
          </AddSessionButton>
        </>
      )}
    </View>
  )
}
