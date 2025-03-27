import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { SessionExercise } from '@repo/toron-db/schema'

import {
  createSessionExercise,
  deleteSessionExercise,
  // createSessionExercise,
  // deleteSessionExercise,
  updateSessionExercise,
  // updateSet,
} from '../dbFunctions'
import { mutationSettings } from './mutationSettings'
import { invalidateSessionQueries, sessionRefetcher } from './refetcher'

export const useCreateSessionExerciseMutation = () => {
  const queryClient = useQueryClient()
  // TODO: add exercise name for optimistic update
  return useMutation({
    mutationFn: createSessionExercise,
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions', vars.sessionId],
      })
      // // Snapshot the previous value
      const previousSession =
        queryClient.getQueryData(['session', vars.sessionId]) ||
        queryClient
          .getQueryData(['sessions'])
          .find((s) => s.id === vars.sessionId)
      const nextSession = produce(previousSession, (draft: any) => {
        // fill in missing fields
        // TODO: this is a bit of a hack, but it works for now
        // figure out how to automatically fill in missing fields
        const newSetGroup = {
          ...vars,
          sets: [],
          exercise: {},
        }
        console.log('draft')
        console.log({ previousSession, draft })
        if (!draft.sessionExercises) {
          draft.sessionExercises = []
        }
        draft.sessionExercises.push(newSetGroup as any)
        console.log({ newSetGroup })
        console.log({ id: newSetGroup.id })
      })
      // console.log('creating new set', {
      //   exerciseId: selectedExercise?.id || '',
      //   sessionId: session.id,
      //   setGroupId: newSetGroup.id,
      // })
      // TODO: get this working instead of running the set creation after the promise
      // createSetMutation.mutateAsync({
      //   id: Crypto.randomUUID(),
      //   exerciseId: selectedExercise?.id || '',
      //   sessionId: session.id,
      //   setGroupId: newSetGroup.id,
      //   order: nextOrder,
      // })

      // Optimistically update to the new value
      sessionRefetcher(queryClient, nextSession, vars.sessionId)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, vars, context) => {
      console.log('error')
      console.log({ err })
      console.log({ vars, context })
      queryClient.setQueryData(
        ['session', vars.sessionId],
        context?.previousSession,
      )
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

export const useUpdateSessionExerciseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSessionExercise,
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions', vars.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        vars.sessionId,
      ])
      const nextSession = produce(previousSession, (draft) => {
        // draft.sessionExercises = draft.sessionExercises.map(
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
      sessionRefetcher(queryClient, nextSession, vars.sessionId)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, vars, context) => {
      console.log('error')
      console.log({ err })
      console.log({ vars, context })
      queryClient.setQueryData(
        ['session', vars.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: (vars) => {
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

export const useDeleteSessionExerciseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      sessionId,
    }: Parameters<typeof deleteSessionExercise>[0] & {
      sessionId: SessionExercise['sessionId'] | null
    }) => deleteSessionExercise({ id }),
    // When mutate is called:
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      if (vars.sessionId) {
        await queryClient.cancelQueries({
          queryKey: ['sessions', vars.sessionId],
        })
      }

      // Snapshot the previous value
      // // Snapshot the previous value
      const previousSession =
        queryClient.getQueryData(['session', vars.sessionId]) ||
        queryClient
          .getQueryData(['sessions'])
          .find((s) => s.id === vars.sessionId)

      console.log({ previousSession })

      const nextSession = produce(previousSession, (draft) => {
        draft.sessionExercises = draft.sessionExercises
          .filter((curSetGroup) => {
            return curSetGroup.id !== vars.id
          })
          .map((setGroup, index) => {
            setGroup.order = index + 1
            return setGroup
          })
      })
      console.log({ nextSession })

      // Optimistically update to the new value
      sessionRefetcher(queryClient, nextSession, vars.sessionId)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, vars, context) => {
      console.log('error')
      console.log({ err })
      console.log({ context })
      if (vars.sessionId) {
        queryClient.setQueryData(
          ['session', vars.sessionId],
          context?.previousSession,
        )
      }
    },
    onSuccess: (x) => {
      console.log('success')
    },
    // Always refetch after error or success:
    onSettled: (x1, x2, vars) => {
      console.log('settled')
      invalidateSessionQueries(queryClient, vars.sessionId)
    },
  })
}

// export const useSwapSetGroupMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async ({
//       id,
//       exerciseId,
//       sessionId,
//       sets,
//     }: Parameters<typeof updateSetGroup>[0] & {
//       sets: Set[]
//       sessionId: string
//     }) => {
//       await updateSetGroup({
//         id,
//         exerciseId,
//       })

//       // change the exercise ids of all the sets in the set group
//       await Promise.all(
//         sets.map((set) => {
//           return updateSet({
//             id: set.id,
//             exerciseId,
//           })
//         }),
//       )
//     },
//     // When mutate is called:
//     // TODO: better typing with a simple set or dummy set, but still may require casting
//     onMutate: async (vars) => {
//       // Cancel any outgoing refetches
//       // (so they don't overwrite our optimistic update)
//       await queryClient.cancelQueries({
//         queryKey: ['sessions', vars.sessionId],
//       })

//       // Snapshot the previous value
//       const previousSession = queryClient.getQueryData([
//         'session',
//         vars.sessionId,
//       ])
//       const nextSession = produce(previousSession, (draft: any) => {
//         draft.sessionExercises = draft.sessionExercises.map(
//           (curSetGroup: SetGroupWithExerciseAndSets) => {
//             if (curSetGroup.id === vars.id) {
//               curSetGroup.exerciseId = vars.exerciseId
//               curSetGroup.exercise = selectedExercise as Exercise
//               curSetGroup.sets = curSetGroup.sets.map((set) => {
//                 set.exerciseId = newSetGroup.exerciseId
//                 return set
//               })
//             }
//             return curSetGroup
//           },
//         )
//       })

//       // Optimistically update to the new value
//       queryClient.setQueryData(['session', vars.sessionId], nextSession)

//       // setOpen(false)

//       // Return a context object with the snapshotted value
//       return { previousSession }
//     },
//     // If the mutation fails,
//     // use the context returned from onMutate to roll back
//     onError: (err, vars, context) => {
//       console.log('error')
//       console.log({ err })
//       console.log({ vars, context })
//       queryClient.setQueryData(
//         ['session', vars.sessionId],
//         context?.previousSession,
//       )
//     },
//     onSuccess: () => {
//       console.log('success')
//       // need to do another mutation to add the first set to the set group
//     },
//     // Always refetch after error or success:
//     onSettled: (x1, x2, vars) => {
//       console.log('settled')
//       invalidateSessionQueries(queryClient, vars.sessionId)
//     },
//   })
// }

// export const useUpdateSetGroupOrderMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async ({
//       index1,
//       index2,
//       sessionId,
//       session,
//     }: {
//       index1: number
//       index2: number
//       session: SessionWithSetGroupWithExerciseAndSets
//       sessionId: SetGroup['sessionId']
//     }) => {
//       const curSession = session!
//       const setGroup1 = curSession.sessionExercises[index1]
//       const setGroup2 = curSession.sessionExercises[index2]
//       const order1 = curSession.sessionExercises[index1].order
//       const order2 = curSession.sessionExercises[index2].order
//       updateSetGroup({ id: setGroup1.id, order: order2 })
//       updateSetGroup({ id: setGroup2.id, order: order1 })
//     },
//     // When mutate is called:
//     // TODO: better typing with a simple set or dummy set, but still may require casting
//     onMutate: async (vars) => {
//       // Cancel any outgoing refetches
//       // (so they don't overwrite our optimistic update)
//       await queryClient.cancelQueries({
//         queryKey: ['sessions', vars.sessionId],
//       })

//       // Snapshot the previous value
//       const previousSession = queryClient.getQueryData([
//         'session',
//         vars.sessionId,
//       ])
//       const nextSession = produce(previousSession, (draft: any) => {
//         const order1 = draft.sessionExercises[vars.index1].order
//         const order2 = draft.sessionExercises[vars.index2].order
//         draft.sessionExercises[vars.index1].order = order2
//         draft.sessionExercises[vars.index2].order = order1
//         draft.sessionExercises = draft.sessionExercises.sort(
//           (a: SetGroupWithExerciseAndSets, b: SetGroupWithExerciseAndSets) => {
//             // handle a.order being undefined
//             if (a.order === null || b.order === null) {
//               return -1
//             }
//             return a.order - b.order
//           },
//         )
//       })
//       // Optimistically update to the new value
//       queryClient.setQueryData(['session', vars.sessionId], nextSession)

//       // Return a context object with the snapshotted value
//       return { previousSession }
//     },
//     // If the mutation fails,
//     // use the context returned from onMutate to roll back
//     onError: (err, vars, context) => {
//       console.log('error')
//       console.log({ err })
//       console.log({ vars, context })
//       queryClient.setQueryData(
//         ['session', vars.sessionId],
//         context?.previousSession,
//       )
//     },
//     onSuccess: () => {
//       console.log('success')
//     },
//     // Always refetch after error or success:
//     onSettled: (x1, x2, vars) => {
//       console.log('settled')
//       invalidateSessionQueries(queryClient, vars.sessionId)
//     },
//   })
// }

// const updateSetMutation = useMutation({
//   mutationFn: ({ id, exerciseId }: Parameters<typeof updateSet>[0]) =>
//     updateSet({
//       id,
//       exerciseId,
//     }),
//   // When mutate is called:
//   // TODO: better typing with a simple set or dummy set, but still may require casting
//   onMutate: async (vars) => {
//     // Cancel any outgoing refetches
//     // (so they don't overwrite our optimistic update)
//     await queryClient.cancelQueries({
//       queryKey: ['sessions', setGroup.sessionId],
//     })

//     // Snapshot the previous value
//     const previousSession = queryClient.getQueryData([
//       'session',
//       setGroup.sessionId,
//     ])
//     const nextSession = produce(
//       previousSession,
//       (draft: SessionWithSetGroupWithExerciseAndSets) => {
//         draft.sessionExercises = draft.sessionExercises.map(
//           (curSetGroup: SetGroupWithExerciseAndSets) => {
//             if (curSetGroup.id === newSet.setGroupId) {
//               curSetGroup.sets.push(newSet as Set)
//             }
//             return curSetGroup
//           },
//         )
//       },
//     )
//     // Optimistically update to the new value
//     queryClient.setQueryData(['session', setGroup.sessionId], nextSession)

//     // Return a context object with the snapshotted value
//     return { previousSession }
//   },
//   // If the mutation fails,
//   // use the context returned from onMutate to roll back
//   onError: (err, vars, context) => {
//     console.log('error')
//     console.log({ err })
//     console.log({ vars, context })
//     queryClient.setQueryData(
//       ['session', vars.sessionId],
//       context?.previousSession,
//     )
//   },
//   onSuccess: () => {
//     console.log('success')
//     // need to do another mutation to add the first set to the set group
//   },
//   // Always refetch after error or success:
//   onSettled: (x1, x2, vars) => {
//     console.log('settled')
//     invalidateSessionQueries(queryClient, vars.sessionId)
//   },
// })
