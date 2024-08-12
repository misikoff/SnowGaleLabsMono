'use client'

import { Button } from 'components/ui/button'
import PickExerciseDrawer from 'components/workout/pickExerciseDrawer'
import { Session } from 'db/users/schema'

export default function AddExerciseButton({ session }: { session: Session }) {
  return (
    <>
      {session && (
        <PickExerciseDrawer sessionId={session.id}>
          <Button>Add Exercise</Button>
        </PickExerciseDrawer>
      )}
    </>
  )
}
