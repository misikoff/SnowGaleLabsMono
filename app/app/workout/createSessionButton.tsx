'use client'

import { useRouter } from 'next/navigation'

import { Button } from 'components/ui/button'
import { createSession } from 'app/app/actions'

export default function CreateSessionButton() {
  const router = useRouter()
  return (
    <Button
      onClick={async () => {
        const newSessionId = await createSession({})
        if (newSessionId) {
          router.push(`workout/${newSessionId}`)
        }
      }}
    >
      Click me
    </Button>
  )
}
