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
import { getExercises, updateSet, updateSetGroup } from 'app/app/actions'
import { Exercise, SetGroupWithExerciseAndSets } from 'db/schema'

import ExerciseSuperScroller from './exerciseSuperScroller'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'

export default function SwapExerciseButtonDrawer({
  setGroup,
  children,
}: {
  setGroup: SetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>()

  const {
    data: exercises,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getExercises(),
  })

  useEffect(() => {
    if (setGroup && exercises) {
      const curExercise = exercises.find((e) => {
        return e.id === setGroup.exerciseId
      })
      setSelectedExercise(curExercise)
    }
  }, [exercises, setGroup])

  const updateSetGroupMutation = useMutation({
    mutationFn: () =>
      updateSetGroup({
        id: setGroup.id,
        exerciseId: selectedExercise?.id,
      }),
    onSuccess: async (newSetGroup) => {
      //  maybe handle optimistic updates here
      if (newSetGroup.length > 0) {
        // maybe useful for optimistic updates
        //  update all sets to new exercise id
        setGroup.sets.forEach(async (set) => {
          await updateSet({ id: set.id, exerciseId: selectedExercise?.id })
        })
        // maybe useful for optimistic updates
        // const extendedSetGroup: SetGroupWithExerciseAndSets = {
        //   ...newSetGroup[0],
        //   exercise: selectedExercise,
        //   sets: newSet,
        // }
      }
      queryClient.invalidateQueries({
        queryKey: ['session', setGroup.sessionId],
      })
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
              disabled={
                !selectedExercise || selectedExercise.id === setGroup.exerciseId
              }
              className='w-full'
              onClick={async () => {
                console.log({ sessionId: setGroup.sessionId })
                if (selectedExercise) {
                  updateSetGroupMutation.mutateAsync()
                }
              }}
            >
              Swap to {selectedExercise?.name}
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
