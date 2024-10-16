'use client'

import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Session } from '@repo/db/schema'
import { deleteSession, getSessions } from '@/app/app/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import CreateSessionButton from './createSessionButton'

export default function SessionPage() {
  const queryClient = useQueryClient()

  const deleteSessionMutation = useMutation({
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

  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => getSessions(),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !sessions) {
    return <div>Error</div>
  }

  return (
    <div>
      <h1>Sessions</h1>
      <CreateSessionButton />
      {/* list all the most recent sessions or scheduled sessions here */}
      <div className='flex flex-col space-y-4'>
        {sessions.map((s) => (
          <div key={`session-${s.id}`} className='flex space-x-4 items-center'>
            <Link href={`session/${s.id}`} className='block'>
              {s.id}
            </Link>
            {s.completed && <Badge variant='outline'>complete</Badge>}
            <Button
              onClick={async () => {
                await deleteSessionMutation.mutateAsync(s.id)
              }}
            >
              delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
