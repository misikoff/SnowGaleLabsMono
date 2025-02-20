import clsx from 'clsx'
import { InfoIcon, ArrowRightLeftIcon } from 'lucide-react'

import { Set, SetGroupWithExerciseAndSets } from '../../../../packages/toron-db/schema'
import AddSetButton from '@/components/session/addSetButton'
import InfoPopoverExercise from '@/components/session/infoPopoverExercise'
import PerformanceButton from '@/components/session/performancePopover'
import RemoveSetButton from '@/components/session/removeSetButton'
import RemoveSetGroupButton from '@/components/session/removeSetGroupButton'
import SwapExerciseButtonDrawer from '@/components/session/swapExerciseButtonDrawer'
import { Button } from '@/components/ui/button'

function getSetLabel(set: Set) {
  if (set.prescribedWeight && set.prescribedReps && set.prescribedRpe) {
    return `${set.prescribedWeight}# x ${set.prescribedReps} @ RPE ${set.prescribedRpe}`
  } else if (set.prescribedWeight && set.prescribedReps) {
    return `${set.prescribedWeight}# x ${set.prescribedReps}`
  } else if (set.prescribedWeight && set.prescribedRpe) {
    return `${set.prescribedWeight}# @ RPE ${set.prescribedRpe}`
  } else if (set.prescribedReps && set.prescribedRpe) {
    return `${set.prescribedReps} @ RPE ${set.prescribedRpe}`
  } else if (set.prescribedWeight) {
    return `${set.prescribedWeight}#`
  } else if (set.prescribedReps) {
    return `${set.prescribedReps} reps`
  } else if (set.prescribedRpe) {
    return `RPE ${set.prescribedRpe}`
  }
}

function isSetEmpty(set: Set) {
  return !set.weight && !set.reps && !set.rpe
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

  function setRow(set: Set, index: number, isDummy = false) {
    return (
      <div
        key={`${setGroup.id}-${index}`}
        className={clsx(isDummy && 'animate-bounce')}
      >
        <div className='flex gap-x-2 items-center text-white'>
          <div className='flex h-8 w-8 flex-shrink-0 items-center text-blue-400 justify-center rounded-full border-2 bg-black border-black'>
            <span className='text-indigo-600'>{index + 1}</span>
          </div>
          <div className='flex'>{getSetLabel(set)}</div>
          <br />
          {set.weight && set.reps && set.rpe && (
            <div>
              Performed {set.weight} x {set.reps} @ RPE {set.rpe}
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
    )
  }

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
            <ArrowRightLeftIcon className='w-6 h-6 text-gray-400' />
          </SwapExerciseButtonDrawer>
        </div>
      </div>

      <div className='ml-1 mt-2 flex flex-col gap-y-2 mb-4'>
        {setGroup.sets.map((set: Set, index) => setRow(set, index))}
      </div>
      {!locked && <AddSetButton setGroup={setGroup} />}
    </div>
  )
}
