'use client'

import { useEffect, useState } from 'react'

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
  onSubmit,
}: {
  setGroup: SetGroupWithExerciseAndSets
  children: any
  onSubmit?: (setGroup: SetGroupWithExerciseAndSets) => void
}) {
  const [open, setOpen] = useState(false)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>()

  useEffect(() => {
    async function fetchData() {
      const exs = await getExercises()
      setExercises(exs)
      console.log({ exs })
      console.log({ setEx: setGroup.exerciseId })
      const ex = exs.find((e) => {
        return e.id === setGroup.exerciseId
      })
      if (ex) {
        setSelectedExercise(ex)
      }
    }
    fetchData()
  }, [setGroup.exerciseId])

  useEffect(() => {
    if (!open) {
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
                const newSetGroupWithSetsAndExercise = {
                  ...newSetGroup[0],
                  exercise: selectedExercise,
                  sets: setGroup.sets,
                }
                if (onSubmit) {
                  onSubmit(
                    newSetGroupWithSetsAndExercise as SetGroupWithExerciseAndSets,
                  )
                }
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
