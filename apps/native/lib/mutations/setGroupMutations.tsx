import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import {
  SessionWithSetGroupWithExerciseAndSets,
  SetGroupWithExerciseAndSets,
} from '@repo/db/schema'

import { createSetGroup, deleteSetGroup, updateSetGroup } from '../dbFunctions'

export const useCreateSetGroupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      exerciseId,
      sessionId,
      order,
      userId,
    }: Parameters<typeof createSetGroup>[0]) =>
      createSetGroup({
        id,
        exerciseId,
        sessionId,
        order,
        userId,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSetGroup) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      // await queryClient.cancelQueries({
      //   queryKey: ['session', session.id],
      // })
      // // Snapshot the previous value
      // const previousSession = queryClient.getQueryData(['session', session.id])
      // const nextSession = produce(previousSession, (draft: any) => {
      //   // fill in missing fields
      //   // TODO: this is a bit of a hack, but it works for now
      //   // figure out how to automatically fill in missing fields
      //   newSetGroup.sets = []
      //   newSetGroup.exercise = selectedExercise
      //   console.log('draft')
      //   console.log({ previousSession, draft })
      //   if (!draft.setGroups) {
      //     draft.setGroups = []
      //   }
      //   draft.setGroups.push(newSetGroup as SetGroup)
      // })
      // console.log({ newSetGroup })
      // console.log({ id: newSetGroup.id })
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
      // queryClient.setQueryData(['session', session.id], nextSession)
      // setOpen(false)
      // Return a context object with the snapshotted value
      // return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSetGroup, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSetGroup, context })
      queryClient.setQueryData(
        ['session', newSetGroup.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: ({ sessionId }) => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', sessionId],
      })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

export const useUpdateSetGroupMutation = (sessionId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      exerciseId,
    }: Parameters<typeof updateSetGroup>[0]) => {
      // update all set groups with new order
    },
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSetGroup) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', sessionId])
      const nextSession = produce(previousSession, (draft) => {
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
      queryClient.setQueryData(['session', sessionId], nextSession)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSetGroup, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSetGroup, context })
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

export const useDeleteSetGroupMutation = (sessionId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Parameters<typeof deleteSetGroup>[0]) =>
      deleteSetGroup(id),
    // When mutate is called:
    onMutate: async () => {
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
          draft.setGroups = draft.setGroups.filter(
            (curSetGroup: SetGroupWithExerciseAndSets) => {
              return curSetGroup.id !== setGroup.id
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
    onError: (err, deletedSetGroup, context) => {
      console.log('error')
      console.log({ err })
      console.log({ context })
      queryClient.setQueryData(['session', sessionId], context?.previousSession)
    },
    onSuccess: (x) => {
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
