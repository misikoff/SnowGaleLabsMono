'use client'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSet, createSetGroup, getExercises } from 'app/app/actions'
import { produce } from 'immer'
import { v4 as uuidv4 } from 'uuid'

import {
  Exercise,
  SessionWithSetGroupWithExerciseAndSets,
  Set,
  SetGroup,
  SetGroupWithExerciseAndSets,
} from '@repo/db/schema'
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

  const createSetGroupMutation = useMutation({
    mutationFn: ({
      id,
      exerciseId,
      sessionId,
      order,
    }: Parameters<typeof createSetGroup>[0]) =>
      createSetGroup({
        id,
        exerciseId,
        sessionId,
        order,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSetGroup: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', session.id],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', session.id])
      const nextSession = produce(previousSession, (draft: any) => {
        // fill in missing fields
        // TODO: this is a bit of a hack, but it works for now
        // figure out how to automatically fill in missing fields
        newSetGroup.sets = []
        newSetGroup.exercise = selectedExercise
        draft.setGroups.push(newSetGroup as SetGroup)
      })
      console.log('creating new set', {
        exerciseId: selectedExercise!.id || '',
        sessionId: session.id,
        setGroupId: newSetGroup.id,
      })
      createSetMutation.mutateAsync({
        id: uuidv4(),
        exerciseId: selectedExercise!.id || '',
        sessionId: session.id,
        setGroupId: newSetGroup.id,
      })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', session.id], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSetGroup, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSetGroup, context })
      queryClient.setQueryData(
        ['session', session.id],
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
        queryKey: ['session', session.id],
      })
    },
  })

  const createSetMutation = useMutation({
    mutationFn: ({
      id,
      exerciseId,
      sessionId,
      setGroupId,
    }: Parameters<typeof createSet>[0]) =>
      createSet({
        id,
        exerciseId,
        sessionId,
        setGroupId,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (newSet: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', session.id],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', session.id])
      const nextSession = produce(previousSession, (draft: any) => {
        draft.setGroups = draft.setGroups.map(
          (curSetGroup: SetGroupWithExerciseAndSets) => {
            if (curSetGroup.id === newSet.setGroupId) {
              curSetGroup.sets.push(newSet as Set)
            }
            return curSetGroup
          },
        )
      })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', session.id], nextSession)

      setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ newSet, context })
      queryClient.setQueryData(
        ['session', session.id],
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
        queryKey: ['session', session.id],
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
              disabled={!selectedExercise}
              className='w-full'
              onClick={async () => {
                console.log({ sessionId: session.id })
                if (selectedExercise) {
                  createSetGroupMutation.mutateAsync({
                    id: uuidv4(),
                    exerciseId: selectedExercise?.id,
                    sessionId: session.id,
                    order: nextOrder,
                  })
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
