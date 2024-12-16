import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import {
  SessionWithSetGroupWithExerciseAndSets,
  SetGroupWithExerciseAndSets,
} from '@repo/db/schema'

import { createSet, deleteSet, updateSet } from '../dbFunctions'

export const useCreateSetMutation = (nextOrder: number, sessionId = '') => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      exerciseId,
      sessionId,
      setGroupId,
      userId,
    }: Parameters<typeof createSet>[0]) =>
      createSet({
        id,
        exerciseId,
        sessionId,
        setGroupId,
        userId,
        order: nextOrder,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSet) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', sessionId])
      const nextSession = produce(
        previousSession,
        (draft: SessionWithSetGroupWithExerciseAndSets) => {
          draft.setGroups = draft.setGroups.map(
            (curSetGroup: SetGroupWithExerciseAndSets) => {
              if (curSetGroup.id === newSet.setGroupId) {
                curSetGroup.sets.push(newSet as Set)
              }
              return curSetGroup
            },
          )
        },
      )
      // Optimistically update to the new value
      queryClient.setQueryData(['session', sessionId], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSet, context })
      queryClient.setQueryData(['session', sessionId], context?.previousSession)
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', sessionId],
      })
    },
  })
}

export const useUpdateSetMutation = (sessionId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reps, weight, rpe }: Parameters<typeof updateSet>[0]) =>
      updateSet({
        id,
        reps,
        weight,
        rpe,
      }),

    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (updatedSet) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        set.sessionId,
      ])
      const nextSession = produce(
        previousSession,
        (draft: SessionWithSetGroupWithExerciseAndSets) => {
          draft.setGroups.map((sg: SetGroupWithExerciseAndSets) => {
            sg.sets = sg.sets.map((s: Set) => {
              if (s.id === set.id) {
                s.reps = updatedSet.reps
                s.weight = updatedSet.weight
                s.rpe = updatedSet.rpe
              }
              return s
            })
          })
        },
      )

      // Optimistically update to the new value
      queryClient.setQueryData(['session', sessionId], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, updatedSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ updatedSet, context })
      queryClient.setQueryData(['session', sessionId], context?.previousSession)
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', sessionId],
      })
    },
  })
}

export const useDeleteSetMutation = (sessionId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Parameters<typeof deleteSet>[0]) => deleteSet(id),
    // When mutate is called:
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', sessionId])

      const nextSession = produce(
        previousSession,
        (draft: SessionWithSetGroupWithExerciseAndSets) => {
          draft.setGroups = draft.setGroups.map(
            (curSetGroup: SetGroupWithExerciseAndSets) => {
              if (curSetGroup.id === set.setGroupId) {
                curSetGroup.sets = curSetGroup.sets.filter(
                  (curSet) => curSet.id !== id,
                )
              }
              return curSetGroup
            },
          )
        },
      )
      console.log({ nextSession })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', sessionId], nextSession)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, deletedSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ context })
      queryClient.setQueryData(['session', sessionId], context?.previousSession)
    },
    onSuccess: () => {
      console.log('success')
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', sessionId],
      })
    },
  })
}
