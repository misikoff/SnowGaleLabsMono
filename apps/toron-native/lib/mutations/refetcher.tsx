import { QueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Session } from '../../../../packages/toron-db/schema'

export function invalidateSessionQueries(
  queryClient: QueryClient,
  sessionId?: string | undefined | null,
) {
  queryClient.invalidateQueries({
    queryKey: ['sessions'],
  })
}

export function sessionRefetcher(
  queryClient: QueryClient,
  updatedSession: Session | null,
  sessionId: string | undefined | null,
  refetchOptions = {
    single: true,
    multiple: true,
  },
) {
  if (!sessionId) {
    return
  }

  if (refetchOptions.single) {
    // queryClient.setQueryData(['session', sessionId], updatedSession)
  }

  if (refetchOptions.multiple) {
    // update session in sessions query
    const previousSessions = queryClient.getQueryData(['sessions']) as Session[]
    const nextSessions = produce(previousSessions, (draft) => {
      // delete or replace session
      if (updatedSession === null) {
        return draft.filter((session: Session) => session.id !== sessionId)
      } else {
        const itemToUpdate = draft.find((session) => session.id === sessionId)
        if (itemToUpdate) {
          Object.assign(itemToUpdate, updatedSession)
        }
      }
    })

    // queryClient.setQueryData(['sessions'], nextSessions)
  }
}

export const invalidateSplitQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(['splits'])
}

export const splitRefetcher = (queryClient: QueryClient, split: any) => {
  queryClient.setQueryData(['splits'], (old: any) =>
    old.map((s: any) => (s.id === split.id ? split : s)),
  )
}

export const invalidateProfileQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(['profile'])
}
