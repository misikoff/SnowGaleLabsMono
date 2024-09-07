'use client'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from 'components/ui/button'
import {
  // Drawer,
  // DrawerClose,
  // DrawerContent,
  DrawerDescription,
  // DrawerFooter,
  // DrawerHeader,
  DrawerTitle,
  // DrawerTrigger,
} from 'components/ui/drawer'
import { createSet, createSetGroup, getExercises } from 'app/app/actions'
import { Exercise, SessionWithSetGroupWithExerciseAndSets } from 'db/schema'

import ExerciseSuperScroller from './exerciseSuperScroller'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'

export default function AddExerciseButtonDrawer({
  session,
  children,
}: {
  session: SessionWithSetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>()
  const [nextOrder, setNextOrder] = useState(0)
  const {
    data: exercises,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getExercises(),
  })

  useEffect(() => {
    if (session) {
      let newMax =
        session.setGroups.length > 0
          ? Math.max(
              ...session.setGroups.map((setGroup) => setGroup.order || 0),
            ) + 1
          : 0

      setNextOrder(newMax)
    }
  }, [session])

  console.log({ nextOrder })

  const createSetGroupMutation = useMutation({
    mutationFn: () =>
      createSetGroup({
        exerciseId: selectedExercise?.id,
        sessionId: session.id,
        order: nextOrder,
      }),
    onSuccess: async (newSetGroup) => {
      if (newSetGroup.length > 0) {
        // maybe useful for optimistic updates
        // const newSet =
        await createSet({
          exerciseId: selectedExercise?.id || '',
          sessionId: session.id,
          setGroupId: newSetGroup[0].id,
        })
        // maybe useful for optimistic updates
        // const extendedSetGroup: SetGroupWithExerciseAndSets = {
        //   ...newSetGroup[0],
        //   exercise: selectedExercise,
        //   sets: newSet,
        // }
      }
      queryClient.invalidateQueries({ queryKey: ['session', session.id] })
      setOpen(false)
    },
  })

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
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error</div>}
        {exercises && exercises.length === 0 && <div>No exercises</div>}
        {exercises && exercises.length > 0 && (
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
        )}
        <DialogFooter>
          <div className='flex w-full space-x-4'>
            <Button
              disabled={!selectedExercise}
              className='w-full'
              onClick={async () => {
                console.log({ sessionId: session.id })
                if (selectedExercise) {
                  createSetGroupMutation.mutateAsync()
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
