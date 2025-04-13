import { useEffect, useState } from 'react'

import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import * as Crypto from 'expo-crypto'
import { useQuery } from '@tanstack/react-query'
import { PencilIcon } from 'lucide-react-native'
import { useSharedValue } from 'react-native-reanimated'

import { MuscleGroup, Session } from '@repo/toron-db/schema'
import DragButton from '@/components/dragButton'
import DropZone from '@/components/dropZone'
import { getMuscleGroups } from '@/lib/dbFunctions'

const defaultDragPos = { x: -999, y: -999 }

function getButton(group: MuscleGroup) {
  return (
    <Text className='rounded-lg bg-blue-400 px-3 py-1 text-center font-bold text-white'>
      {group.name}
    </Text>
  )
}
const SplitDayInput = ({
  plannedRestDays,
  numTrainingDays,
  trainingDays,
  setTrainingDays,
}: {
  plannedRestDays: boolean
  numTrainingDays: number
  trainingDays: {
    id: string
    name: string
    order: number
    muscleGroups?: string[]
  }[]
  setTrainingDays: React.Dispatch<
    React.SetStateAction<
      { id: string; name: string; order: number; muscleGroups?: string[] }[]
    >
  >
}) => {
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [editingDayName, setEditingDayName] = useState<string>('')

  const dragPos = useSharedValue(defaultDragPos)
  const activeDropZoneId = useSharedValue<string | null>(null)

  const resetDragPos = () => {
    dragPos.value = defaultDragPos
    activeDropZoneId.value = null
  }

  // console.log({ trainingDays })
  // console.log({
  //   0: trainingDays[0].muscleGroups,
  //   1: trainingDays[1].muscleGroups,
  //   2: trainingDays[2].muscleGroups,
  // })

  useEffect(() => {
    setTrainingDays((prev) => {
      if (numTrainingDays < prev.length) {
        // Reduce the number of training days
        return prev.slice(0, numTrainingDays)
      } else if (numTrainingDays > prev.length) {
        // Add new training days
        const newDays = Array.from(
          { length: numTrainingDays - prev.length },
          (_, i) => ({
            id: Crypto.randomUUID(),
            name: '',
            order: prev.length + i,
          }),
        )
        return [...prev, ...newDays]
      }
      return prev // No changes
    })
  }, [numTrainingDays, setTrainingDays])

  const {
    data: muscleGroups,
    // isLoading: muscleGroupsLoading,
    // isError: muscleGroupsError,
  } = useQuery({
    queryKey: ['muscleGroups'],
    queryFn: async () => getMuscleGroups(),
  })

  const handleTrainingDayNameChange = (id: Session['id'], name: string) => {
    setTrainingDays(
      trainingDays.map((day) => (day.id === id ? { ...day, name } : day)),
    )
  }

  const handleMuscleGroupChange = (
    id: Session['id'],
    muscleGroupId: string,
  ) => {
    setTrainingDays(
      trainingDays.map((day) =>
        day.id === id
          ? {
              ...day,
              muscleGroups: day.muscleGroups
                ? [...day.muscleGroups, muscleGroupId]
                : [muscleGroupId],
            }
          : day,
      ),
    )
    console.log('muscle group added to training day')
    resetDragPos()
  }

  const handleRemovingMuscleGroup = (
    id: Session['id'],
    muscleGroupId: string,
    muscleGroupIndex: number,
  ) => {
    setTrainingDays(
      trainingDays.map((day) =>
        day.id === id
          ? {
              ...day,
              muscleGroups: day.muscleGroups?.filter(
                (groupId, index) =>
                  !(groupId === muscleGroupId && index === muscleGroupIndex),
              ),
            }
          : day,
      ),
    )
    console.log('muscle group removed from training day')
    resetDragPos()
  }

  const handleSwapMuscleGroupFromDayToDay = (
    dayToRemoveId: Session['id'],
    dayToAddId: Session['id'],
    muscleGroupId: MuscleGroup['id'],
    muscleGroupIndex: number,
  ) => {
    const dayToRemove = trainingDays.find((day) => day.id === dayToRemoveId)
    const dayToAdd = trainingDays.find((day) => day.id === dayToAddId)
    console.log('swapping muscle group', {
      dayToRemoveId,
      dayToAddId,
      muscleGroupId,
      muscleGroupIndex,
    })
    if (dayToRemove && dayToAdd) {
      const newTrainingDays = trainingDays.map((day) =>
        day.id === dayToRemoveId
          ? {
              ...day,
              muscleGroups: day.muscleGroups?.filter(
                (groupId, index) =>
                  !(groupId === muscleGroupId && index === muscleGroupIndex),
              ),
            }
          : day.id === dayToAddId
            ? {
                ...day,
                muscleGroups: day.muscleGroups
                  ? [...day.muscleGroups, muscleGroupId]
                  : [muscleGroupId],
              }
            : day,
      )
      console.log(
        'new training days',
        newTrainingDays.map((day) => {
          return { dayId: day.id, muscleGroups: day.muscleGroups?.length }
        }),
      )
      setTrainingDays(newTrainingDays)
    }
    resetDragPos()
  }

  const handleEditTrainingDay = (id: string, name: string) => {
    setEditingDayId(id)
    setEditingDayName(name)
  }

  const handleSaveTrainingDayName = (id: string) => {
    handleTrainingDayNameChange(id, editingDayName || '')
    setEditingDayId(null)
    setEditingDayName('')
  }

  // const muscleGroupFrequency = muscleGroups?.reduce(
  //   (acc, group) => {
  //     const count = trainingDays.reduce((count, day) => {
  //       return count + (day.muscleGroups?.includes(group.id) ? 1 : 0)
  //     }, 0)
  //     if (count > 0) {
  //       acc[group.name] = count
  //     }
  //     return acc
  //   },
  //   {} as Record<string, number>,
  // )

  return (
    <View className='flex flex-1 items-center gap-2 p-4'>
      {muscleGroups && (
        <View className='flex flex-row flex-wrap justify-center gap-2 p-2'>
          {muscleGroups.map((group) => (
            <DragButton
              key={'muscle' + group.id}
              dragPos={dragPos}
              activeDropZoneId={activeDropZoneId}
              onDrop={(x, y) => {
                console.log('dropped', group, x, y)
                if (activeDropZoneId.value) {
                  handleMuscleGroupChange(activeDropZoneId.value, group.id)
                }
                // have to make sure this runs after the dropzone has updated
                setTimeout(() => {
                  activeDropZoneId.value = null
                }, 10)
              }}
              showPhantom
            >
              {getButton(group)}
            </DragButton>
          ))}
        </View>
      )}

      <ScrollView contentContainerClassName='mt-2 p-4 flex flex-row flex-wrap items-center justify-center rounded-md gap-4 bg-gray-200'>
        {trainingDays.map((item, index) => {
          return (
            <DropZone
              key={'day' + index + item.id}
              className='rounded-lg'
              zoneId={item.id}
              activeDropZoneId={activeDropZoneId}
              dragPos={dragPos}
            >
              <View className='flex flex-row items-center justify-between'>
                {editingDayId === item.id ? (
                  <>
                    <TextInput
                      placeholder='Name'
                      value={editingDayName || ''}
                      onChangeText={(text) => setEditingDayName(text)}
                      style={{
                        borderWidth: 1,
                        padding: 5,
                        marginVertical: 5,
                      }}
                    />
                    <Button
                      title='Save'
                      onPress={() => handleSaveTrainingDayName(item.id)}
                    />
                  </>
                ) : (
                  <View className='flex items-center justify-between'>
                    <Text className='text-lg font-bold'>
                      {item.name ? item.name : 'Day ' + (index + 1)}: order:
                      {item.order}
                    </Text>
                    {plannedRestDays &&
                      (item.muscleGroups?.length || 0) === 0 && (
                        <Text className='text-lg font-bold text-gray-500'>
                          Rest Day
                        </Text>
                      )}
                    <TouchableOpacity
                      // title='Edit'
                      onPress={() => handleEditTrainingDay(item.id, item.name)}
                    >
                      <PencilIcon size={16} />
                    </TouchableOpacity>
                  </View>
                )}

                <Button
                  title='-'
                  onPress={() => {
                    setTrainingDays(
                      trainingDays.filter((day) => day.id !== item.id),
                    )
                  }}
                />
              </View>
              {muscleGroups && (
                <View className='flex gap-2'>
                  {item.muscleGroups?.map((groupId, i) => (
                    // TODO: fix z-index issues with other buttons and scroll container
                    <DragButton
                      key={'day' + index + 'index' + i + groupId}
                      dragPos={dragPos}
                      activeDropZoneId={activeDropZoneId}
                      onDrop={(x, y) => {
                        const group = muscleGroups?.find(
                          (g) => g.id === groupId,
                        ) as MuscleGroup
                        console.log('dropped', group, x, y)
                        if (!activeDropZoneId.value) {
                          handleRemovingMuscleGroup(item.id, group.id, i)
                        } else if (
                          activeDropZoneId.value &&
                          activeDropZoneId.value !== item.id
                        ) {
                          handleSwapMuscleGroupFromDayToDay(
                            item.id,
                            activeDropZoneId.value,
                            group.id,
                            i,
                          )
                        }
                      }}
                    >
                      {getButton(
                        muscleGroups?.find(
                          (g) => g.id === groupId,
                        ) as MuscleGroup,
                      )}
                    </DragButton>
                  ))}
                </View>
              )}
            </DropZone>
          )
        })}
      </ScrollView>

      {/* {muscleGroupsLoading && <Text>Loading muscle groups...</Text>}
      {muscleGroupsError && <Text>Error loading muscle groups...</Text>}
      <View className='mt-4 w-full'>
        <Text className='text-lg font-bold text-black'>
          Muscle Group Frequency:
        </Text>
        {muscleGroupFrequency &&
          Object.entries(muscleGroupFrequency).map(([name, count]) => (
            <View key={name} className='flex flex-row justify-between'>
              <Text>{name}</Text>
              <Text>{count}</Text>
            </View>
          ))}
      </View> */}
    </View>
  )
}

export default SplitDayInput
