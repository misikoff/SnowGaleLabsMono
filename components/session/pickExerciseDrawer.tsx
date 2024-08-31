'use client'

import { use, useEffect, useState } from 'react'

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

import ExerciseSuperScroller from './exerciseSuperScroller'
import SuperScroller from '../ui/superScroller'

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

  useEffect(() => {
    if (!open) {
      setSelectedExercise(null)
    }
  }, [open])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pick Exercise</DrawerTitle>
          <DrawerDescription>This is the exercise to pick</DrawerDescription>
        </DrawerHeader>
        <ExerciseSuperScroller
          options={exercises}
          onSelect={(exerciseId: string) => {
            setSelectedExercise(
              exercises.find((e) => {
                return e.id === exerciseId
              }),
            )
          }}
        />
        <DrawerFooter>
          <div className='flex w-full space-x-4'>
            <Button
              disabled={!selectedExercise}
              className='w-full'
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
              Add {selectedExercise?.name}
            </Button>
            <DrawerClose asChild>
              <Button variant='outline' className='w-full'>
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
