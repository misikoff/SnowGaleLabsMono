'use client'

import { Button } from 'components/ui/button'
import PickExerciseDrawer from 'components/workout/pickExerciseDrawer'
import { Session, SetGroupWithExerciseAndSets } from 'db/users/schema'

export default function AddExerciseButton({
  session,
  onSubmit,
}: {
  session: Session
  onSubmit?: (setGroup: SetGroupWithExerciseAndSets) => void
}) {
  return (
    <>
      {session && (
        <PickExerciseDrawer sessionId={session.id} onSubmit={onSubmit}>
          <Button>Add Exercise</Button>
        </PickExerciseDrawer>
      )}
    </>
  )
}
