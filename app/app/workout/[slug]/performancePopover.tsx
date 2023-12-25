'use client'

import { useState } from 'react'

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

export default function PerformanceButton({
  children,
  weight = 0,
}: {
  children: any
  weight?: any
}) {
  const [value, setValue] = useState(weight)

  const adjustment = 5
  function decrement() {
    let newValue = value - adjustment
    newValue = Math.max(newValue, 0)
    setValue(newValue)
  }
  function increment() {
    let newValue = value + adjustment
    newValue = Math.max(newValue, 0)
    setValue(newValue)
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
            <MinusIcon onClick={decrement} />

            {/* {value} */}
            <AnimatedNumber value={value} />

            <PlusIcon onClick={increment} />
          </div>
        </div>
        <div>weight</div>
        <div>Difficulty</div>
        <div className='flex w-full gap-x-4'>
          <SheetClose className='w-full'>
            <Button className='justify-self-end w-full uppercase font-mono text-gray-400'>
              Clear
            </Button>
          </SheetClose>
          <SheetClose className='w-full'>
            <Button className='justify-self-end w-full uppercase font-mono text-white bg-green-400'>
              Done
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
