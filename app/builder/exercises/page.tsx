'use client'

import { Button } from 'components/ui/button'
import { createExercise, deleteAllExercises } from 'app/app/actions'
import { exercisesArray } from 'db/seedData'

export default function Home() {
  return (
    <div>
      <Button
        onClick={async () => {
          await deleteAllExercises()
          alert('deleted all exercises')
        }}
      >
        delete all exercises
      </Button>

      <Button
        onClick={async () => {
          exercisesArray.forEach(async ({ id, name, equipment }) => {
            await createExercise({ id, name, equipment: equipment as any })
          })

          alert('created all exercises')
        }}
      >
        add all exercises
      </Button>
    </div>
  )
}
