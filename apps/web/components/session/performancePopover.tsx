'use client'

import React, { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { MinusIcon, PlusIcon } from 'lucide-react'

import AnimatedNumber from 'components/animatedNumber'
import { Button } from 'components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'components/ui/sheet'
import { updateSet } from 'app/app/actions'
import { Set, SetGroupWithExerciseAndSets } from 'db/schema'

export default function PerformanceButton({
  children,
  set,
}: {
  children: React.ReactNode
  set: Set
}) {
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [weightValue, setWeightValue] = useState(
    set.weight ?? set.prescribedWeight ?? 0,
  )
  const [repValue, setRepValue] = useState(set.reps ?? set.prescribedReps ?? 0)
  // TODO: handle other dififculty methodologies, like RIR
  const [difficultyValue, setDifficultyValue] = useState(
    set.RPE ?? set.prescribedRPE ?? 5,
  )

  const updateSetMutation = useMutation({
    mutationFn: ({ id, reps, weight, RPE }: Parameters<typeof updateSet>[0]) =>
      updateSet({
        id,
        reps,
        weight,
        RPE,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (updatedSet) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', set.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        set.sessionId,
      ])
      const nextSession = produce(previousSession, (draft: any) => {
        draft.setGroups = draft.setGroups.map(
          (curSetGroup: SetGroupWithExerciseAndSets) => {
            // TODO: better typing with a simple set or dummy set, but still may require casting
            curSetGroup.sets = curSetGroup.sets.map((curSet: any) => {
              if (curSet.id === set.id) {
                curSet.reps = updatedSet.reps
                curSet.weight = updatedSet.weight
                curSet.RPE = updatedSet.RPE
              }
              return curSet
            })
            return curSetGroup
          },
        )
      })
      // Optimistically update to the new value
      queryClient.setQueryData(['session', set.sessionId], nextSession)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, updatedSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ updatedSet, context })
      queryClient.setQueryData(
        ['session', set.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', set.sessionId],
      })
    },
  })

  useEffect(() => {
    if (!open) {
      setWeightValue(set.weight ?? set.prescribedWeight ?? 0)
      setRepValue(set.reps ?? set.prescribedReps ?? 0)
      setDifficultyValue(set.RPE ?? set.prescribedRPE ?? 5)
    }
  }, [
    open,
    set.RPE,
    set.prescribedRPE,
    set.prescribedReps,
    set.prescribedWeight,
    set.reps,
    set.weight,
  ])

  const weightAdjustment = 5
  function decrementWeight() {
    let newValue = weightValue - weightAdjustment
    newValue = Math.max(newValue, 0)
    setWeightValue(newValue)
  }
  function incrementWeight() {
    let newValue = weightValue + weightAdjustment
    newValue = Math.max(newValue, 0)
    setWeightValue(newValue)
  }

  const repAdjustment = 1
  function decrementRep() {
    let newValue = repValue - repAdjustment
    newValue = Math.max(newValue, 0)
    setRepValue(newValue)
  }
  function incrementRep() {
    let newValue = repValue + repAdjustment
    newValue = Math.max(newValue, 0)
    setRepValue(newValue)
  }

  const difficultyAdjustment = 1
  function decrementDifficulty() {
    let newValue = difficultyValue - difficultyAdjustment
    newValue = Math.max(newValue, 0)
    setDifficultyValue(newValue)
  }
  function incrementDifficulty() {
    let newValue = difficultyValue + difficultyAdjustment
    newValue = Math.max(newValue, 0)
    setDifficultyValue(newValue)
  }

  const save = async () => {
    await updateSetMutation.mutateAsync({
      id: set.id,
      reps: repValue,
      weight: weightValue,
      RPE: difficultyValue,
    })
  }

  const clear = async () => {
    setRepValue(0)
    setWeightValue(0)
    setDifficultyValue(0)
    // because the values haven't been updated yet, these have to be hardcoded as zeroes
    await updateSetMutation.mutateAsync({
      id: set.id,
      reps: 0,
      weight: 0,
      RPE: 0,
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side='bottom'>
        <SheetHeader>
          <SheetTitle>Performance</SheetTitle>
          <SheetDescription>
            This is where you input the results of your set.
          </SheetDescription>
        </SheetHeader>
        <div className='py-4'>
          <div className='flex flex-col'>
            <div className='text-center'>weight</div>
            <div className='flex justify-between'>
              <Button onClick={decrementWeight}>
                <MinusIcon />
              </Button>

              {/* {value} */}
              <AnimatedNumber value={weightValue} />

              <Button onClick={incrementWeight}>
                <PlusIcon />
              </Button>
            </div>
          </div>

          <div className='text-center'>reps</div>
          <div className='flex justify-between'>
            <Button onClick={decrementRep}>
              <MinusIcon />
            </Button>

            {/* {value} */}
            <AnimatedNumber value={repValue} />

            <Button onClick={incrementRep}>
              <PlusIcon />
            </Button>
          </div>

          <div className='text-center'>Difficulty</div>
          <div className='flex justify-between'>
            <Button onClick={decrementDifficulty}>
              <MinusIcon />
            </Button>

            {/* {value} */}
            <AnimatedNumber value={difficultyValue} />

            <Button onClick={incrementDifficulty}>
              <PlusIcon />
            </Button>
          </div>
        </div>
        <div className='flex w-full gap-x-4'>
          <SheetClose asChild className='w-full'>
            <Button variant='destructive' onClick={clear}>
              Clear
            </Button>
          </SheetClose>
          <SheetClose asChild className='w-full'>
            <Button onClick={save}>Done</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
