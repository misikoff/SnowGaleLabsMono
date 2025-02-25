'use client'

import { createExercise, deleteAllExercises } from '@/app/app/adminActions'
import { Button } from '@/components/ui/button'

import { exercisesArray } from '../../../../../packages/toron-db/seedData'

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
