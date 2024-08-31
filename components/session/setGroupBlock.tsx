import clsx from 'clsx'
import { InfoIcon, ArrowRightLeftIcon } from 'lucide-react'

import { Button } from 'components/ui/button'
import { Set, SetGroupWithExerciseAndSets } from 'db/schema'

import AddSetButton from './addSetButton'
import InfoPopoverExercise from './infoPopoverExercise'
import PerformanceButton from './performancePopover'
import RemoveSetButton from './removeSetButton'
import RemoveSetGroupButton from './removeSetGroupButton'
import SwapButton from './swapPopover'

export default function SetGroupBlock({
  className = '',
  setGroup,
  locked = false,
  onSubmit,
  onSetRemoved,
  onSetGroupRemoved,
  onSetUpdated,
  onSetGroupUpdated,
}: {
  className?: string
  setGroup: SetGroupWithExerciseAndSets
  locked?: boolean
  onSubmit?: (set: Set) => void
  onSetRemoved?: (id: string) => void
  onSetGroupRemoved?: (id: string) => void
  onSetUpdated?: (set: Set) => void
  onSetGroupUpdated?: (setGroup: SetGroupWithExerciseAndSets) => void
}) {
  return (
    <div className={clsx(className, 'bg-gray-800 rounded-xl p-4')}>
      <div className='flex justify-between'>
        <div className='text-2xl text-white'>{setGroup.exercise.name}</div>
        <div className='flex gap-x-3'>
          <RemoveSetGroupButton
            setGroup={setGroup}
            onSetGroupRemoved={onSetGroupRemoved}
          />
          <InfoPopoverExercise exercise={setGroup.exercise}>
            <InfoIcon className='w-6 h-6 text-gray-400' />
          </InfoPopoverExercise>
          <SwapButton setGroup={setGroup} onSubmit={onSetGroupUpdated}>
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
              <br />
              {set.weight !== 0 && set.reps !== 0 && set.RPE !== 0 && (
                <>
                  Performed {set.weight} x {set.reps} @ RPE {set.RPE}
                </>
              )}
              {/* {getSetType(set)} */}
              <div className='flex-grow' />
              {setGroup.sets.length > 1 && (
                <RemoveSetButton set={set} onSetRemoved={onSetRemoved} />
              )}
              <PerformanceButton set={set} onSubmit={onSetUpdated}>
                <Button className='justify-self-end rounded-full text-blue-400'>
                  Performance
                </Button>
              </PerformanceButton>
            </div>
          </div>
        ))}
      </div>
      {!locked && <AddSetButton setGroup={setGroup} onSubmit={onSubmit} />}
    </div>
  )
}
