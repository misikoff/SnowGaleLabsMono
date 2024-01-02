import clsx from 'clsx'
import { InfoIcon, ArrowRightLeftIcon } from 'lucide-react'

import { Button } from 'components/ui/button'
import { Exercise, Set } from 'db/test/schema'

import InfoPopoverExercise from './infoPopoverExercise'
import PerformanceButton from './performancePopover'
import SwapButton from './swapPopover'

export default function SetGroupBlock({
  className = '',
  setGroup,
}: {
  className?: string
  setGroup: { exercise: Exercise; sets: Set[]; id: number }
}) {
  return (
    <div className={clsx(className, 'bg-gray-800 rounded-xl p-4')}>
      <div className='flex justify-between'>
        <div className='text-2xl text-white'>{setGroup.exercise.name}</div>
        <div className='flex gap-x-3'>
          <InfoPopoverExercise>
            <InfoIcon className='w-6 h-6 text-gray-400' />
          </InfoPopoverExercise>
          <SwapButton>
            <ArrowRightLeftIcon className='w-6 h-6 text-gray-400' />
          </SwapButton>
        </div>
      </div>
      <div className='ml-1 mt-2 flex flex-col gap-y-2'>
        {setGroup.sets.map((set: Set, index) => (
          <div key={`${setGroup.id}-${index}`}>
            <div className='flex items-center gap-x-2 text-white'>
              <span className='flex h-8 w-8 flex-shrink-0 items-center text-blue-400 justify-center rounded-full border-2 bg-black border-black'>
                <span className='text-indigo-600'>{index + 1}</span>
              </span>
              {set.prescribedWeight} x {set.prescribedReps}
              {/* {getSetType(set)} */}
              <div className='flex-grow' />
              <PerformanceButton weight={set.prescribedWeight}>
                <Button className='justify-self-end rounded-full text-blue-400'>
                  Performance
                </Button>
              </PerformanceButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
