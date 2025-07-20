import React from 'react'
import { View, Text, Pressable } from 'react-native'
import * as Crypto from 'expo-crypto'

import { Session, MuscleGroup, SessionExercise } from '../../../../../packages/toron-db/schema'
import { 
  addMuscleGroupToSleekSession, 
  removeMuscleGroupFromSleekSession 
} from '@/lib/dbFunctions'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface SleekSessionControlsProps {
  session: Session & { sessionExercises: (SessionExercise & { muscleGroup: MuscleGroup })[] }
  muscleGroups: MuscleGroup[]
}

export default function SleekSessionControls({ 
  session, 
  muscleGroups 
}: SleekSessionControlsProps) {
  const queryClient = useQueryClient()

  const addMuscleGroupMutation = useMutation({
    mutationFn: addMuscleGroupToSleekSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', session.id] })
    },
  })

  const removeMuscleGroupMutation = useMutation({
    mutationFn: removeMuscleGroupFromSleekSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', session.id] })
    },
  })

  // Count how many times each muscle group has been added
  const muscleGroupCounts = session.sessionExercises?.reduce((acc, se) => {
    acc[se.muscleGroup.id] = (acc[se.muscleGroup.id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const handleAddMuscleGroup = async (muscleGroup: MuscleGroup) => {
    try {
      await addMuscleGroupMutation.mutateAsync({
        id: Crypto.randomUUID(),
        sessionId: session.id,
        muscleGroupId: muscleGroup.id,
        order: session.sessionExercises?.length || 0,
      })
    } catch (error) {
      console.error('Error adding muscle group:', error)
    }
  }

  const handleRemoveMuscleGroup = async (sessionExerciseId: string) => {
    try {
      await removeMuscleGroupMutation.mutateAsync({
        sessionExerciseId,
        sessionId: session.id,
      })
    } catch (error) {
      console.error('Error removing muscle group:', error)
    }
  }

  return (
    <View className='space-y-6'>
      {/* Added Muscle Groups */}
      <View>
        <Text className='text-lg font-semibold mb-3'>
          Training Today ({session.sessionExercises?.length || 0})
        </Text>
        {session.sessionExercises && session.sessionExercises.length > 0 ? (
          <View className='space-y-2'>
            {session.sessionExercises
              .sort((a, b) => a.muscleGroup.name.localeCompare(b.muscleGroup.name))
              .map((sessionExercise) => (
              <View 
                key={sessionExercise.id}
                className='flex-row items-center justify-between bg-green-100 p-3 rounded-lg'
              >
                <Text className='text-lg font-medium'>
                  {sessionExercise.muscleGroup.name}
                </Text>
                <Pressable
                  onPress={() => handleRemoveMuscleGroup(sessionExercise.id)}
                  className='bg-red-500 px-3 py-1 rounded-full'
                  disabled={removeMuscleGroupMutation.isPending}
                >
                  <Text className='text-white font-medium'>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <Text className='text-gray-500 italic'>
            No muscle groups added yet. Add some below!
          </Text>
        )}
      </View>

      {/* Available Muscle Groups */}
      <View>
        <Text className='text-lg font-semibold mb-3'>
          Add Muscle Groups
        </Text>
        <View className='space-y-2'>
          {muscleGroups
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((muscleGroup) => (
              <Pressable
                key={muscleGroup.id}
                onPress={() => handleAddMuscleGroup(muscleGroup)}
                className='flex-row items-center justify-between bg-gray-100 p-3 rounded-lg'
                disabled={addMuscleGroupMutation.isPending}
              >
                <View className='flex-row items-center'>
                  <Text className='text-lg'>
                    {muscleGroup.name}
                  </Text>
                  {muscleGroupCounts[muscleGroup.id] && (
                    <View className='ml-2 bg-gray-500 px-2 py-0.5 rounded-full'>
                      <Text className='text-white text-sm font-medium'>
                        {muscleGroupCounts[muscleGroup.id]}
                      </Text>
                    </View>
                  )}
                </View>
                <View className='bg-blue-500 px-3 py-1 rounded-full'>
                  <Text className='text-white font-medium'>Add</Text>
                </View>
              </Pressable>
          ))}
        </View>
      </View>
    </View>
  )
}