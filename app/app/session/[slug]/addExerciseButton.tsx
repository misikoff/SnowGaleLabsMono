import { Button } from 'components/ui/button'
import PickExerciseDrawer from '@/components/session/pickExerciseDrawer'
import { Session } from 'db/schema'

export default function AddExerciseButton({ session }: { session: Session }) {
  return (
    <PickExerciseDrawer session={session}>
      <Button className='w-fit'>Add Exercise</Button>
    </PickExerciseDrawer>
  )
}
