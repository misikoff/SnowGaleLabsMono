import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Session } from '../../../../packages/toron-db/schema'
import { createSession, deleteSession, updateSession } from '../dbFunctions'
import { mutationSettings } from './mutationSettings'
import { invalidateSessionQueries, sessionRefetcher } from './refetcher'
// TODO: add debug variable to turn on/off console logs
// TODO: add debug variable to turn on/off optimistic updates
// There should be a global variable and one per data type
export const useCreateSessionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      date,
      createdAt,
      updatedAt,
    }: Parameters<typeof createSession>[0]) =>
      createSession({
        id,
        date,
        createdAt,
        updatedAt,
      }),
    onMutate: async ({ id, date, createdAt, updatedAt }) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData(['sessions'])

      const nextSessions = produce(previousSessions, (draft: Session[]) => {
        draft.push({
          id,
          date,
          createdAt,
          updatedAt,
          setGroups: [],
        } as any as Session)
      })
      // console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session created')
    },
    onError: (error, variables, context) => {
      console.error('error creating session', error)
      queryClient.setQueryData(['sessions'], context?.previousSessions)
    },
    onSettled: (x1, x2, vars) => {
      console.log('session settled')
      invalidateSessionQueries(queryClient, vars.id)
    },
  })
}

export const useUpdateSessionDateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, date }: Parameters<typeof updateSession>[0]) =>
      updateSession({
        id,
        date,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      // // Cancel any outgoing refetches
      // // (so they don't overwrite our optimistic update)
      // await queryClient.cancelQueries({
      //   queryKey: ['sessions', id],
      // })
      // // Snapshot the previous value
      // const previousSession = queryClient.getQueryData(['session', id])
      // const nextSession = produce(previousSession, (draft: any) => {
      //   draft.completed = true
      // })
      // // Optimistically update to the new value
      // queryClient.setQueryData(['session', id], nextSession)
      // // setOpen(false)
      // // Return a context object with the snapshotted value
      // return { previousSession }

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData([
        'sessions',
      ]) as Session[]

      const nextSession = previousSessions.map((s) => {
        if (s.id === vars.id) {
          return { ...s, date: vars.date }
        } else {
          return s
        }
      }) as any as Session

      console.log({ nextSession })
      // Optimistically update to the new value
      sessionRefetcher(queryClient, nextSession, vars.id)
    },
    // // If the mutation fails,
    // // use the context returned from onMutate to roll back
    // onError: (err, updatedSession, context) => {
    //   console.log('error')
    //   console.log({ err })
    //   console.log({ updatedSession, context })
    //   queryClient.setQueryData(
    //     ['session', updatedSession.id],
    //     context?.previousSession,
    //   )
    // },
    // onSuccess: () => {
    //   console.log('success')
    //   // need to do another mutation to add the first set to the set group
    // },
    // // Always refetch after error or success:
    // onSettled: (x1, x2, vars) => {
    //   console.log('settled')
    //   invalidateSessionQueries(queryClient, vars.id)
    // },
    onSuccess: ({ x1, vars, x2 }) => {
      console.log('session updated')
    },
    onSettled: ({ x1, x2, vars }) => {
      console.log('session updated')
      invalidateSessionQueries(queryClient, vars.id)
    },
  })
}

export const useDeleteSessionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: Parameters<typeof deleteSession>[0]) =>
      deleteSession({ id }),
    onMutate: async (vars) => {
      if (!mutationSettings.optimisticUpdate) {
        return
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData([
        'sessions',
      ]) as Session[]

      const nextSessions = previousSessions.filter((s) => {
        // console.log({ a: id, b: s.id, res: s.id !== vars.id })
        return s.id !== vars.id
      })

      console.log({ nextSessions })
      // Optimistically update to the new value
      sessionRefetcher(queryClient, null, vars.id)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session deleted')
    },
    onSettled: (x1, x2, vars) => {
      invalidateSessionQueries(queryClient, vars.id)
    },
  })
}

export const useCompleteSessionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, completed }: Parameters<typeof updateSession>[0]) =>
      updateSession({
        id,
        completed,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (vars) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions', vars.id],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', vars.id])
      const nextSession = produce(previousSession, (draft: any) => {
        draft.completed = true
      }) as Session

      // Optimistically update to the new value
      sessionRefetcher(queryClient, nextSession, vars.id)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, vars, context) => {
      console.log('error')
      console.log({ err })
      console.log({ vars, context })
      queryClient.setQueryData(['session', vars.id], context?.previousSession)
    },
    onSuccess: (x1, vars, x2) => {
      console.log('success')
      console.log({ x1, x2, vars })
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: (x1, x2, vars) => {
      console.log('settled')
      invalidateSessionQueries(queryClient, vars.id)
    },
  })
}
