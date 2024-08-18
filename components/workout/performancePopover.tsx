'use client'

import React, { useEffect, useState } from 'react'

import { MinusIcon, PlusIcon } from 'lucide-react'

import AnimatedNumber from 'components/animatedNumber'
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
import { updateSet } from 'app/app/actions'
import { Set } from 'db/schema'

export default function PerformanceButton({
  children,
  set,
  onSubmit,
}: {
  children: React.ReactNode
  set: Set
  onSubmit?: (set: Set) => void
}) {
  const [open, setOpen] = useState(false)
  const [weightValue, setWeightValue] = useState(set.weight ?? 0)
  const [repValue, setRepValue] = useState(set.reps ?? 0)
  // TODO: handle other dififculty methodologies, like RIR
  const [difficultyValue, setDifficultyValue] = useState(set.RPE ?? 5)

  useEffect(() => {
    if (!open) {
      setWeightValue(set.weight ?? 0)
      setRepValue(set.reps ?? 0)
      setDifficultyValue(set.RPE ?? 5)
    }
  }, [open, set.RPE, set.reps, set.weight])

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

  const sendUpdate = async ({
    reps,
    weight,
    RPE,
  }: {
    reps: number
    weight: number
    RPE: number
  }) => {
    const newSet = await updateSet({
      id: set.id,
      reps,
      weight,
      RPE,
    })
    if (onSubmit) {
      if (newSet.length > 0) {
        onSubmit(newSet[0])
      }
    }
  }

  const save = async () => {
    await sendUpdate({
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
    await sendUpdate({ reps: 0, weight: 0, RPE: 0 })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side='bottom'>
        <SheetHeader>
          <SheetTitle>Performance</SheetTitle>
          {/* <SheetDescription>
          This action cannot be undone. This will permanently
          delete your account and remove your data from our
          servers.
        </SheetDescription> */}
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
          <SheetClose className='w-full'>
            <Button
              onClick={clear}
              className='justify-self-end w-full uppercase font-mono text-gray-400'
            >
              Clear
            </Button>
          </SheetClose>
          <SheetClose className='w-full'>
            <Button
              onClick={save}
              className='justify-self-end w-full uppercase font-mono text-white bg-green-400'
            >
              Done
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
