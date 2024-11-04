import { useState } from 'react'

import { StyleSheet, Pressable, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Exercise, SetGroupWithExerciseAndSets } from '@repo/db/schema'
import { getExercises, updateSet, updateSetGroup } from '@/lib/dbFunctions'

export default function ReorderExerciseButton({
  setGroup,
  direction = 'up',
  children,
}: {
  setGroup: SetGroupWithExerciseAndSets
  direction: 'up' | 'down'
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()

  // use react query to fetch exercises
  const {
    data: exercises,
    // isLoading,
    // isError,
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => getExercises(),
  })

  const updateSetGroupMutation = useMutation({
    mutationFn: async ({
      id,
      exerciseId,
    }: Parameters<typeof updateSetGroup>[0]) => {
      // update all set groups with new order
    },
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSetGroup: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', setGroup.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        setGroup.sessionId,
      ])
      const nextSession = produce(previousSession, (draft: any) => {
        // draft.setGroups = draft.setGroups.map(
        //   (curSetGroup: SetGroupWithExerciseAndSets) => {
        //     if (curSetGroup.id === newSetGroup.id) {
        //       curSetGroup.exerciseId = newSetGroup.exerciseId
        //       curSetGroup.exercise = selectedExercise as Exercise
        //       curSetGroup.sets = curSetGroup.sets.map((set) => {
        //         set.exerciseId = newSetGroup.exerciseId
        //         return set
        //       })
        //     }
        //     return curSetGroup
        //   },
        // )
      })

      // Optimistically update to the new value
      queryClient.setQueryData(['session', setGroup.sessionId], nextSession)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSetGroup, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSetGroup, context })
      queryClient.setQueryData(
        ['session', setGroup.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', setGroup.sessionId],
      })
    },
  })

  return (
    <View className='mt-12 items-center justify-center'>
      <Pressable
        style={styles.button}
        onPress={() => {
          console.log('pressed')
        }}
      >
        {children}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    elevation: 2,
  },
})
