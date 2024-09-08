'use client'

import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import { Session } from '@/db/schema'
import { deleteSession, getSessions } from 'app/app/actions'

import CreateSessionButton from './createSessionButton'

export default function SessionPage() {
  const queryClient = useQueryClient()

  const deleteSessionMutation = useMutation({
    mutationFn: (id: Session['id']) => deleteSession(id),
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
                await deleteSessionMutation.mutate(s.id)
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
