import { QueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Session } from '@repo/db/schema'

export function invalidateSessionQueries(
  queryClient: QueryClient,
  sessionId?: string | undefined | null,
) {
  queryClient.invalidateQueries({
    queryKey: ['session'],
  })
  if (sessionId) {
    queryClient.invalidateQueries({
      queryKey: ['session', sessionId],
    })
  }
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
    queryClient.setQueryData(['session', sessionId], updatedSession)
  }

  if (refetchOptions.multiple) {
    // update session in sessions query
    const previousSessions = queryClient.getQueryData(['sessions']) as Session[]
    const nextSessions = produce(previousSessions, (draft: any) => {
      // delete or replace session
      if (updatedSession === null) {
        return draft.filter((session: Session) => session.id !== sessionId)
      } else {
        draft.map((session: Session) => {
          if (session.id === sessionId) {
            return updatedSession
          }
          return session
        })
      }
    })
    queryClient.setQueryData(['sessions'], nextSessions)
  }
}
