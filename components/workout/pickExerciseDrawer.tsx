'use client'

import { useEffect, useState } from 'react'

import { Button } from 'components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from 'components/ui/drawer'
import { createSetGroup, getExercises } from 'app/app/actions'
import { Exercise, Session } from 'db/users/schema'

export default function PickExerciseDrawer({
  sessionId,
  children,
}: {
  sessionId: Session['id']
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>()

  useEffect(() => {
    async function fetchData() {
      const exs = await getExercises()
      setExercises(exs)
      console.log({ exs })
    }
    fetchData()
  }, [])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pick Exercise</DrawerTitle>
          <DrawerDescription>This is the exercise to pick</DrawerDescription>

          <select
            value={selectedExercise?.id}
            onChange={(e) => {
              setSelectedExercise(
                exercises.find((exercise) => {
                  return exercise.id === parseInt(e.target.value)
                }),
              )
            }}
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            onClick={async () => {
              console.log({ sessionId })
              await createSetGroup({
                exerciseId: selectedExercise.id,
                sessionId,
              })
              setOpen(false)
            }}
          >
            Submit {selectedExercise?.name}
          </Button>
          <DrawerClose>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
