import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import {
  Session,
  SessionWithSetGroupWithExerciseAndSets,
  SetGroupWithExerciseAndSets,
} from '@repo/db/schema'

import { createSetGroup, deleteSetGroup, updateSetGroup } from '../dbFunctions'
import { mutationSettings } from './mutationSettings'

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
      if (!mutationSettings.optimisticUpdate) {
        return
      }
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

export const useUpdateSetGroupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      exerciseId,
      sessionId,
    }: Parameters<typeof updateSetGroup>[0] & { sessionId: string }) => {
      // update all set groups with new order
    },
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', vars.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        vars.sessionId,
      ])
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
      queryClient.setQueryData(['session', vars.sessionId], nextSession)

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
      queryClient.invalidateQueries({
        queryKey: ['session', vars.sessionId],
      })
    },
  })
}

export const useDeleteSetGroupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      sessionId,
    }: {
      id: Parameters<typeof deleteSetGroup>[0]
      sessionId?: Session['id']
    }) => deleteSetGroup(id),
    // When mutate is called:
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      if (vars.sessionId) {
        await queryClient.cancelQueries({
          queryKey: ['session', vars.sessionId],
        })
      }

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        vars.sessionId,
      ])

      const nextSession = produce(
        previousSession,
        (draft: SessionWithSetGroupWithExerciseAndSets) => {
          draft.setGroups = draft.setGroups.filter(
            (curSetGroup: SetGroupWithExerciseAndSets) => {
              return curSetGroup.id !== vars.id
            },
          )
        },
      )
      console.log({ nextSession })
      // Optimistically update to the new value
      if (vars.sessionId) {
        queryClient.setQueryData(['session', vars.sessionId], nextSession)
      }

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, args, context) => {
      console.log('error')
      console.log({ err })
      console.log({ context })
      if (args.sessionId) {
        queryClient.setQueryData(
          ['session', args.sessionId],
          context?.previousSession,
        )
      }
    },
    onSuccess: (x) => {
      console.log('success')
    },
    // Always refetch after error or success:
    onSettled: (x1, x2, args) => {
      console.log('settled')
      if (args.sessionId) {
        queryClient.invalidateQueries({
          queryKey: ['session', args.sessionId],
        })
      }
    },
  })
}
