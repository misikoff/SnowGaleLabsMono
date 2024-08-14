'use client'

import React, { useState } from 'react'

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
import { Set } from 'db/users/schema'

export default function PerformanceButton({
  children,
  set,
  onSubmit,
}: {
  children: React.ReactNode
  set: Set
  onSubmit?: (set: Set) => void
}) {
  const [weightValue, setWeightValue] = useState(set.weight ?? 0)
  const [repValue, setRepValue] = useState(set.reps ?? 0)
  // TODO: handle other dififculty methodologies, like RIR
  const [difficultyValue, setDifficultyValue] = useState(set.RPE ?? 5)

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
    const newSet = await updateSet({
      id: set.id,
      reps: repValue,
      weight: weightValue,
      RPE: difficultyValue,
    })
    if (onSubmit) {
      if (newSet.length > 0) {
        onSubmit(newSet[0])
      }
    }
  }

  const clear = async () => {
    const newSet = await updateSet({
      id: set.id,
      reps: 0,
      weight: 0,
      RPE: 0,
    })
    if (onSubmit) {
      if (newSet.length > 0) {
        onSubmit(newSet[0])
      }
    }
  }

  return (
    <Sheet>
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
        <div className='flex flex-col'>
          <div className='flex justify-between'>
            <MinusIcon onClick={decrementWeight} />

            {/* {value} */}
            <AnimatedNumber value={weightValue} />

            <PlusIcon onClick={incrementWeight} />
          </div>
        </div>
        <div className='text-center'>weight</div>

        <div className='flex justify-between'>
          <MinusIcon onClick={decrementRep} />

          {/* {value} */}
          <AnimatedNumber value={repValue} />

          <PlusIcon onClick={incrementRep} />
        </div>
        <div className='text-center'>reps</div>

        <div className='flex justify-between'>
          <MinusIcon onClick={decrementDifficulty} />

          {/* {value} */}
          <AnimatedNumber value={difficultyValue} />

          <PlusIcon onClick={incrementDifficulty} />
        </div>
        <div className='text-center'>Difficulty</div>
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
