import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Session } from '@repo/db/schema'

import { createSession, deleteSession, updateSession } from '../dbFunctions'

export const useCreateSessionMutation = (date) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      createdAt,
      updatedAt,
      userId,
    }: Parameters<typeof createSession>[0]) =>
      createSession({
        id,
        date,
        createdAt,
        updatedAt,
        userId,
      }),
    onMutate: async ({ id, date, createdAt, updatedAt }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData(['sessions'])

      const nextSessions = produce(previousSessions, (draft: Session[]) => {
        draft.push({ id, date, createdAt, updatedAt, setGroups: [] } as Session)
      })
      // console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session created')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
    onError: (error, variables, context) => {
      console.error('error creating session', error)
      queryClient.setQueryData(['sessions'], context.previousSessions)
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
    onMutate: async ({ id, date }) => {
      // // Cancel any outgoing refetches
      // // (so they don't overwrite our optimistic update)
      // await queryClient.cancelQueries({
      //   queryKey: ['session', id],
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

      const nextSessions = previousSessions.map((s) => {
        if (s.id === id) {
          return { ...s, date }
        } else {
          return s
        }
      })

      console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
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
    // onSettled: () => {
    //   console.log('settled')
    //   // queryClient.invalidateQueries({
    //   //   queryKey: ['session', session.id],
    //   // })
    // },
    onSuccess: () => {
      console.log('session updated')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

export const useDeleteSessionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Session['id']) => deleteSession(id),
    onMutate: async (id) => {
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
        console.log({ a: id, b: s.id, res: s.id !== id })
        return s.id !== id
      })

      console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session deleted')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}
