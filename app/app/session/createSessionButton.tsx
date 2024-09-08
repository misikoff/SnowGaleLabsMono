'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from 'components/ui/button'
import { createSession } from 'app/app/actions'

export default function CreateSessionButton() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const createSessionMutation = useMutation({
    mutationFn: () => createSession({}),
    onSuccess: () => {
      console.log('session created')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
  return (
    <Button
      onClick={async () => {
        const newSessionId = await createSessionMutation.mutateAsync()
        if (newSessionId) {
          router.push(`session/${newSessionId}`)
        }
      }}
    >
      New Session
    </Button>
  )
}
