'use client'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Exercise, SetGroupWithExerciseAndSets } from '@repo/db/schema'
import { getExercises, updateSet, updateSetGroup } from '@/app/app/actions'
import { Button } from '@/components/ui/button'
import {
  // Drawer,
  // DrawerClose,
  // DrawerContent,
  DrawerDescription,
  // DrawerFooter,
  // DrawerHeader,
  DrawerTitle,
  // DrawerTrigger,
} from '@/components/ui/drawer'

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
    mutationFn: async ({
      id,
      exerciseId,
    }: {
      id: string
      exerciseId: string
    }) => {
      updateSetGroup({
        id,
        exerciseId,
      })
      setGroup.sets.forEach(async (set) => {
        await updateSet({ id: set.id, exerciseId })
      })
    },
    onMutate: async (sg) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', setGroup.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        setGroup.sessionId,
      ])
      const nextSession = produce(previousSession, (draft: any) => {
        draft.setGroups.map((curSetGroup: SetGroupWithExerciseAndSets) => {
          if (curSetGroup.id === sg.id) {
            curSetGroup.exerciseId = sg.exerciseId
            curSetGroup.exercise = {
              ...curSetGroup.exercise,
              id: sg.exerciseId,
              name: selectedExercise!.name,
            }
          }
          curSetGroup.sets = curSetGroup.sets.map((curSet) => {
            curSet.exerciseId = sg.exerciseId
            return curSet
          })
          return curSetGroup
        })
      })

      // Optimistically update to the new value
      queryClient.setQueryData(['session', setGroup.sessionId], nextSession)

      setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, updatedSetGroup, context) => {
      console.log('error')
      console.log({ err })
      console.log({ updatedSetGroup, context })
      queryClient.setQueryData(
        ['session', setGroup.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', setGroup.sessionId],
      })
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
                  updateSetGroupMutation.mutateAsync({
                    id: setGroup.id,
                    exerciseId: selectedExercise.id,
                  })
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
