import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Set } from '../../../../packages/toron-db/schema'
import { createSet, deleteSet, updateSet } from '../dbFunctions'
import { mutationSettings } from './mutationSettings'
import { invalidateSessionQueries } from './refetcher'

export const useCreateSetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSet,
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    // onMutate: async (vars) => {
    //   if (!mutationSettings.optimisticUpdate) {
    //     return
    //   }

    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({
    //     queryKey: ['sessions', vars.sessionId],
    //   })

    //   // Snapshot the previous value
    //   const previousSession = queryClient.getQueryData([
    //     'session',
    //     vars.sessionId,
    //   ])
    //   const nextSession = produce(
    //     previousSession,
    //     (draft: SessionWithSetGroupWithExerciseAndSets) => {
    //       draft.setGroups = draft.setGroups.map(
    //         (curSetGroup: SetGroupWithExerciseAndSets) => {
    //           if (curSetGroup.id === vars.setGroupId) {
    //             curSetGroup.sets.push(vars as Set)
    //           }
    //           return curSetGroup
    //         },
    //       )
    //     },
    //   )
    //   // Optimistically update to the new value
    //   // queryClient.setQueryData(['session', vars.sessionId], nextSession)

    //   // setOpen(false)

    //   // Return a context object with the snapshotted value
    //   return { previousSession }
    // },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, vars, context) => {
      console.log('error')
      console.log({
        err,
        sessionId: vars.sessionId,
        exerciseId: vars.exerciseId,
      })
      console.log({ vars, context })
      // queryClient.setQueryData(
      //   ['session', vars.sessionId],
      //   context?.previousSession,
      // )
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: (x1, x2, vars) => {
      console.log('settled')
      invalidateSessionQueries(queryClient, vars.sessionId)
    },
  })
}

export const useUpdateSetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      reps,
      weight,
      rir,
      sessionId,
      order,
      sessionExerciseId,
    }: Parameters<typeof updateSet>[0] & { sessionId: string }) =>
      updateSet({
        id,
        reps,
        weight,
        rir,
        order,
        sessionExerciseId,
        sessionId,
      }),

    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    // onMutate: async (vars) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({
    //     queryKey: ['sessions', vars.sessionId],
    //   })

    //   // Snapshot the previous value
    //   const previousSession = queryClient.getQueryData([
    //     'session',
    //     vars.sessionId,
    //   ])
    //   const nextSession = produce(
    //     previousSession,
    //     (draft: SessionWithSetGroupWithExerciseAndSets) => {
    //       draft.setGroups.map((sg: SetGroupWithExerciseAndSets) => {
    //         sg.sets = sg.sets.map((s: Set) => {
    //           if (s.id === vars.id) {
    //             if (vars.reps) {
    //               s.reps = vars.reps
    //             }
    //             if (vars.weight) {
    //               s.weight = vars.weight
    //             }
    //             if (vars.rir) {
    //               s.rir = vars.rir
    //             }
    //           }
    //           return s
    //         })
    //       })
    //     },
    //   )

    //   // Optimistically update to the new value
    //   queryClient.setQueryData(['session', vars.sessionId], nextSession)

    //   // setOpen(false)

    //   // Return a context object with the snapshotted value
    //   return { previousSession }
    // },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, vars, context) => {
      console.log('error')
      console.log({ err })
      console.log({ vars, context })
      // queryClient.setQueryData(
      //   ['session', vars.sessionId],
      //   context?.previousSession,
      // )
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: (vars) => {
      console.log('settled')
      invalidateSessionQueries(queryClient, vars.sessionId)
    },
  })
}

export const useDeleteSetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      sessionExerciseId,
      sessionId,
    }: Parameters<typeof deleteSet>[0] & {
      sessionExerciseId: Set['exerciseId']
      sessionId: Set['sessionId']
    }) => deleteSet({ id }),
    // When mutate is called:
    // onMutate: async (vars) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({
    //     queryKey: ['sessions', vars.sessionId],
    //   })

    //   // Snapshot the previous value
    //   const previousSession = queryClient.getQueryData([
    //     'session',
    //     vars.sessionId,
    //   ])

    //   const nextSession = produce(
    //     previousSession,
    //     (draft: SessionWithSetGroupWithExerciseAndSets) => {
    //       draft.setGroups = draft.setGroups.map(
    //         (curSetGroup: SetGroupWithExerciseAndSets) => {
    //           if (curSetGroup.id === vars.setGroupId) {
    //             curSetGroup.sets = curSetGroup.sets.filter(
    //               (curSet) => curSet.id !== vars.id,
    //             )
    //           }
    //           return curSetGroup
    //         },
    //       )
    //     },
    //   )
    //   console.log({ nextSession })
    //   // Optimistically update to the new value
    //   queryClient.setQueryData(['session', vars.sessionId], nextSession)

    //   // Return a context object with the snapshotted value
    //   return { previousSession }
    // },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, vars, context) => {
      console.log('error')
      console.log({ err })
      console.log({ context })
      queryClient.setQueryData(
        ['session', vars.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
    },
    // Always refetch after error or success:
    onSettled: (x1, x2, vars) => {
      console.log('settled')
      invalidateSessionQueries(queryClient, vars.sessionId)
    },
  })
}
