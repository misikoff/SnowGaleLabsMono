import { useEffect } from 'react'

import * as Crypto from 'expo-crypto'
import { useNavigation } from 'expo-router'

import SplitEditor from '@/components/split/editor'
import { createSessionExercise } from '@/lib/dbFunctions'
import { useCreateSessionMutation } from '@/lib/mutations/sessionMutations'
import { useCreateSplitMutation } from '@/lib/mutations/splitMutations'

const ModalScreen = () => {
  const createSplitMutation = useCreateSplitMutation()
  const createSessionMutation = useCreateSessionMutation()
  const navigation = useNavigation()

  const handleSubmit = async (
    trainingDays: {
      id: string
      name: string
      order: number
      muscleGroups?: string[]
    }[],
    splitName: string,
    rirTarget: number,
    restDayType: 'Planned' | 'Dynamic',
  ) => {
    console.log('submit split')
    const splitId = Crypto.randomUUID()

    console.log({ splitId, splitName, rirTarget, restDayType })
    await new Promise((resolve, reject) => {
      createSplitMutation.mutate(
        {
          id: splitId,
          name: splitName,
          rirTarget,
          plannedRestDays: restDayType === 'Planned',
        },
        {
          onSuccess: resolve,
          onError: (error) => {
            console.error('Error creating split:', error)
            reject(new Error('Error creating split'))
          },
        },
      )
    })
      .catch((error) => {
        console.error('Error creating split:', error)
      })
      .finally(() => {
        console.log('Split created successfully')
      })
    console.log('made it this far')
    // TODO: make this all parallel
    // Create all training days and their associated muscle groups
    const trainingDayPromises = trainingDays.map(async (day, dayIndex) => {
      // Create the session for the training day
      await createSessionMutation
        .mutateAsync({
          id: day.id,
          splitTemplateId: splitId,
          isRestDay:
            restDayType === 'Planned' && (day.muscleGroups?.length || 0) === 0,
          name: day.name,
          order: dayIndex,
        })
        .catch((error) => {
          console.error('Error creating session:', error)
        })
      console.log('made it htis far')
      // Create muscle groups for the session
      if (day.muscleGroups) {
        const muscleGroupPromises = day.muscleGroups.map(
          (muscleGroupId, muscleGroupIndex) =>
            createSessionExercise({
              sessionId: day.id,
              muscleGroupId,
              order: muscleGroupIndex,
            }),
        )

        // Wait for all muscle group creations to complete
        return muscleGroupPromises
      }
    })

    // Wait for all training day promises to complete
    await Promise.all(trainingDayPromises)
    console.log('training days created')

    navigation.goBack() // Dismiss the route / pop the stack
  }

  const defaultDays = [
    { id: Crypto.randomUUID(), name: '', order: 0 },
    { id: Crypto.randomUUID(), name: '', order: 1 },
    { id: Crypto.randomUUID(), name: '', order: 2 },
  ]

  useEffect(() => {
    fetch('https://google.com')
      .then((res) => console.log('✅ Fetch working'))
      .catch((err) => console.log('❌ Fetch failed', err))
  }, [])

  return <SplitEditor trainingDays={defaultDays} onCreateSplit={handleSubmit} />
}

export default ModalScreen
