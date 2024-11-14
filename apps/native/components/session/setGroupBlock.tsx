import { Text, View } from 'react-native'
import clsx from 'clsx'
import {
  ArrowLeftRightIcon,
  CircleXIcon,
  PlusCircleIcon,
} from 'lucide-react-native'

import { Set, SetGroupWithExerciseAndSets } from '@repo/db/schema'
import AddSetButton from '@/components/session/addSetButton'
import DeleteSetButton from '@/components/session/deleteSetButton'
import DeleteSetGroupButton from '@/components/session/deleteSetGroupButton'
import PerformanceButton from '@/components/session/performanceButton'

import SwapExerciseButton from './swapExerciseButton'

// function getSetLabel(set: Set) {
//   if (set.prescribedWeight && set.prescribedReps && set.prescribedRpe) {
//     return `${set.prescribedWeight}# x ${set.prescribedReps} @ RPE ${set.prescribedRpe}`
//   } else if (set.prescribedWeight && set.prescribedReps) {
//     return `${set.prescribedWeight}# x ${set.prescribedReps}`
//   } else if (set.prescribedWeight && set.prescribedRpe) {
//     return `${set.prescribedWeight}# @ RPE ${set.prescribedRpe}`
//   } else if (set.prescribedReps && set.prescribedRpe) {
//     return `${set.prescribedReps} @ RPE ${set.prescribedRpe}`
//   } else if (set.prescribedWeight) {
//     return `${set.prescribedWeight}#`
//   } else if (set.prescribedReps) {
//     return `${set.prescribedReps} reps`
//   } else if (set.prescribedRpe) {
//     return `RPE ${set.prescribedRpe}`
//   }
// }

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
  // const lastSetId = setGroup.sets[setGroup.sets.length - 1]?.id

  function setRow(set: Set, index: number, isDummy = false) {
    return (
      <View
        key={`${setGroup.id}-${index}`}
        className={clsx(isDummy && 'animate-bounce')}
      >
        <View className='flex flex-row items-center gap-x-2 text-white'>
          <View className='-ml-1.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-blue-400'>
            <Text className='text-indigo-600'>{index + 1}</Text>
          </View>
          {/* <Text>{getSetLabel(set)}</Text> */}

          <PerformanceButton
            set={set}
            disabled={isSetEmpty(set) && set.id !== firstEmptySetId}
          >
            <>
              {set.weight && set.reps && set.rpe ? (
                <Text className='text-white'>
                  Performed {set.weight} x {set.reps} @ RPE {set.rpe}
                </Text>
              ) : (
                <Text
                  className={clsx(
                    'justify-self-end rounded-full text-blue-400 disabled:opacity-50',
                    // set.id === firstEmptySetId && 'animate-pulse',
                  )}
                >
                  Performance
                  {
                    // ' ' + set.setGroupId.substring(0, 5) + ' ' + set.id.substring(0, 5)
                  }
                </Text>
              )}
            </>
          </PerformanceButton>

          {/* {getSetType(set)} */}
          <View className='flex-grow' />
          <View>
            {/* <Text className='text-white' key={set.id}>
              {set.id.substring(0, 5)}: {set.order}
            </Text> */}
            {((setGroup.sets.length > 1 &&
              index === setGroup.sets.length - 1) ||
              set.weight ||
              set.reps ||
              set.rpe) && (
              <View>
                <DeleteSetButton set={set}>
                  <Text>
                    <CircleXIcon color='red' size={24} />
                  </Text>
                </DeleteSetButton>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={clsx(className, 'rounded-xl bg-gray-800 p-4')}>
      <View className='flex justify-between'>
        <View className='relative flex-row items-center justify-between'>
          <SwapExerciseButton setGroup={setGroup}>
            <ArrowLeftRightIcon color='lightblue' size={24} />
          </SwapExerciseButton>
          <Text className='w-2/3 text-2xl text-white'>
            {setGroup.exercise.name}
            {
              // ': ' + setGroup.id.substring(0, 5)
            }
          </Text>
          <DeleteSetGroupButton setGroup={setGroup}>
            <CircleXIcon color='red' size={24} />
          </DeleteSetGroupButton>
        </View>
        {/* <Text className='text-white'>
          Set Group Block: {setGroup.id.substring(0, 5)}
        </Text> */}

        <View className='flex items-center gap-x-3'>
          {/* <InfoPopoverExercise exercise={setGroup.exercise}>
            <InfoIcon className='h-6 w-6 text-gray-400' />
          </InfoPopoverExercise> */}
        </View>
      </View>

      <View className='mb-4 ml-1 mt-2 flex flex-col gap-y-2'>
        {setGroup.sets
          .sort((s1, s2) => {
            if (s1.order && s2.order) {
              return s1.order - s2.order
            } else {
              return 0
            }
          })
          .map((set: Set, index) => setRow(set, index))}
      </View>
      {!locked && (
        <AddSetButton setGroup={setGroup}>
          <Text className='text-white'>
            <PlusCircleIcon color='green' size={24} />
          </Text>
        </AddSetButton>
      )}
    </View>
  )
}
