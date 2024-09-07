'use client'

import { useEffect, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from 'components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'components/ui/sheet'
import { getExercises, updateSet, updateSetGroup } from 'app/app/actions'
import { Exercise, SetGroupWithExerciseAndSets } from 'db/schema'

export default function SwapButton({
  setGroup,
  children,
}: {
  setGroup: SetGroupWithExerciseAndSets
  children: any
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
    if (exercises) {
      const ex = exercises.find((e) => {
        return e.id === setGroup.exerciseId
      })
      if (ex) {
        setSelectedExercise(ex)
      }
    }
  }, [exercises, setGroup.exerciseId])

  useEffect(() => {
    if (!open && exercises) {
      setSelectedExercise(
        exercises.find((e) => {
          return e.id === setGroup.exerciseId
        }),
      )
    }
  }, [exercises, open, setGroup.exerciseId])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side='bottom'>
        <SheetHeader>
          <SheetTitle>Swap</SheetTitle>
          {/* <SheetDescription>
          This action cannot be undone. This will permanently
          delete your account and remove your data from our
          servers.
        </SheetDescription> */}
        </SheetHeader>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error</div>}
        {exercises && exercises.length === 0 && <div>No exercises</div>}
        {exercises && exercises.length > 0 && (
          <select
            value={selectedExercise?.id}
            onChange={(e) => {
              setSelectedExercise(
                exercises.find((exercise) => {
                  return exercise.id === e.target.value
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
        )}

        <div className='flex w-full gap-x-4'>
          <SheetClose className='w-full'>
            <Button className='justify-self-end w-full uppercase font-mono text-gray-400'>
              Back
            </Button>
          </SheetClose>
          <SheetClose className='w-full'>
            <Button
              onClick={async () => {
                const newSetGroup = await updateSetGroup({
                  id: setGroup.id,
                  exerciseId: selectedExercise?.id,
                  order: setGroup.order,
                })
                if (newSetGroup.length > 0) {
                  // update exercise id of all sets
                  await Promise.all(
                    setGroup.sets.map((set) => {
                      return updateSet({
                        id: set.id,
                        exerciseId: selectedExercise?.id,
                      })
                    }),
                  )
                }
                // maybe useful for optimistic updates
                // const newSetGroupWithSetsAndExercise = {
                //   ...newSetGroup[0],
                //   exercise: selectedExercise,
                //   sets: setGroup.sets,
                // }
                queryClient.invalidateQueries({
                  queryKey: ['session', setGroup.sessionId],
                })
              }}
              className='justify-self-end w-full uppercase font-mono text-white bg-green-400'
            >
              Swap
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
