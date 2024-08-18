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
import { createSet, createSetGroup, getExercises } from 'app/app/actions'
import { Exercise, Session, SetGroupWithExerciseAndSets } from 'db/schema'

export default function PickExerciseDrawer({
  sessionId,
  onSubmit,
  children,
}: {
  sessionId: Session['id']
  onSubmit?: (setGroup: SetGroupWithExerciseAndSets) => void
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
      setSelectedExercise(exs[0])
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
              if (selectedExercise) {
                const newSetGroup = await createSetGroup({
                  exerciseId: selectedExercise?.id,
                  sessionId,
                })
                if (newSetGroup.length > 0) {
                  const newSet = await createSet({
                    exerciseId: selectedExercise?.id,
                    sessionId,
                    setGroupId: newSetGroup[0].id,
                  })
                  const extendedSetGroup: SetGroupWithExerciseAndSets = {
                    ...newSetGroup[0],
                    exercise: selectedExercise,
                    sets: newSet,
                  }
                  if (onSubmit) {
                    onSubmit(extendedSetGroup)
                  }
                  setOpen(false)
                }
              }
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
