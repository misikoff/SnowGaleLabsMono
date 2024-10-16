'use client'

import { exercisesArray } from '@repo/db/seedData'
import { createExercise, deleteAllExercises } from '@/app/app/actions'
import { Button } from '@/components/ui/button'

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
          exercisesArray.forEach(async ({ id, name, equipmentType }) => {
            await createExercise({
              name,
              equipmentType: equipmentType,
            })
          })

          alert('created all exercises')
        }}
      >
        add all exercises
      </Button>
    </div>
  )
}
