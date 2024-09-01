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

import ExerciseSuperScroller from './exerciseSuperScroller'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DrawerTitle>Pick Exercise</DrawerTitle>
          <DrawerDescription>This is the exercise to pick</DrawerDescription>
        </DialogHeader>
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
        <DialogFooter>
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
            <DialogClose asChild>
              <Button variant='outline' className='w-full'>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
