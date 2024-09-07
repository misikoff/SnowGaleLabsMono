import clsx from 'clsx'
import { InfoIcon, ArrowRightLeftIcon } from 'lucide-react'

import { Button } from 'components/ui/button'
import { Set, SetGroupWithExerciseAndSets } from 'db/schema'

import AddSetButton from './addSetButton'
import InfoPopoverExercise from './infoPopoverExercise'
import PerformanceButton from './performancePopover'
import RemoveSetButton from './removeSetButton'
import RemoveSetGroupButton from './removeSetGroupButton'
import SwapExerciseButtonDrawer from './swapExerciseButtonDrawer'
import SwapButton from './swapPopover'

function getSetLabel(set: Set) {
  if (set.prescribedWeight && set.prescribedReps && set.prescribedRPE) {
    return `${set.prescribedWeight}# x ${set.prescribedReps} @ RPE ${set.prescribedRPE}`
  } else if (set.prescribedWeight && set.prescribedReps) {
    return `${set.prescribedWeight}# x ${set.prescribedReps}`
  } else if (set.prescribedWeight && set.prescribedRPE) {
    return `${set.prescribedWeight}# @ RPE ${set.prescribedRPE}`
  } else if (set.prescribedReps && set.prescribedRPE) {
    return `${set.prescribedReps} @ RPE ${set.prescribedRPE}`
  } else if (set.prescribedWeight) {
    return `${set.prescribedWeight}#`
  } else if (set.prescribedReps) {
    return `${set.prescribedReps} reps`
  } else if (set.prescribedRPE) {
    return `RPE ${set.prescribedRPE}`
  }
}

function isSetEmpty(set: Set) {
  return !set.weight && !set.reps && !set.RPE
}

export default function SetGroupBlock({
  className = '',
  setGroup,
  locked = false,
}: {
  className?: string
  setGroup: SetGroupWithExerciseAndSets
  locked?: boolean
}) {
  const firstEmptySetId = setGroup.sets.find((set) => isSetEmpty(set))?.id

  return (
    <div className={clsx(className, 'bg-gray-800 rounded-xl p-4')}>
      <div className='flex justify-between'>
        <div className='text-2xl text-white'>{setGroup.exercise.name}</div>
        <div className='flex gap-x-3 items-center'>
          <RemoveSetGroupButton setGroup={setGroup} />
          <InfoPopoverExercise exercise={setGroup.exercise}>
            <InfoIcon className='w-6 h-6 text-gray-400' />
          </InfoPopoverExercise>
          <SwapExerciseButtonDrawer setGroup={setGroup}>
            <ArrowRightLeftIcon className='hover:cursor-pointer w-6 h-6 text-gray-400' />
          </SwapExerciseButtonDrawer>
        </div>
      </div>
      <div className='ml-1 mt-2 flex flex-col gap-y-2 mb-4'>
        {setGroup.sets.map((set: Set, index) => (
          <div key={`${setGroup.id}-${index}`}>
            <div className='flex gap-x-2 items-center text-white'>
              <div className='flex h-8 w-8 flex-shrink-0 items-center text-blue-400 justify-center rounded-full border-2 bg-black border-black'>
                <span className='text-indigo-600'>{index + 1}</span>
              </div>
              <div className='flex'>{getSetLabel(set)}</div>
              <br />
              {set.weight && set.reps && set.RPE && (
                <div>
                  Performed {set.weight} x {set.reps} @ RPE {set.RPE}
                </div>
              )}
              {/* {getSetType(set)} */}
              <div className='flex-grow' />
              {setGroup.sets.length > 1 && <RemoveSetButton set={set} />}
              <PerformanceButton set={set}>
                <Button
                  disabled={isSetEmpty(set) && set.id !== firstEmptySetId}
                  className={clsx(
                    'justify-self-end rounded-full text-blue-400 disabled:opacity-50',
                    set.id === firstEmptySetId && 'animate-pulse',
                  )}
                >
                  Performance
                </Button>
              </PerformanceButton>
            </div>
          </div>
        ))}
      </div>
      {!locked && <AddSetButton setGroup={setGroup} />}
    </div>
  )
}
