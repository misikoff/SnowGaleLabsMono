import { useEffect, useState } from 'react'

import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native'
import * as Crypto from 'expo-crypto'
import { useNavigation } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { PencilIcon } from 'lucide-react-native'
import { useSharedValue } from 'react-native-reanimated'

import { MuscleGroup, Session } from '@repo/toron-db/schema'
import DropZone from '@/components/dropZone'
import MuscleGroupDragButton from '@/components/muscleGroupDragButton'
import { createSessionExercise, getMuscleGroups } from '@/lib/dbFunctions'
import { useCreateSessionMutation } from '@/lib/mutations/sessionMutations'
import { useCreateSplitMutation } from '@/lib/mutations/splitMutations'

const ModalScreen = () => {
  const [splitName, setSplitName] = useState('')
  const [rirTarget, setRirTarget] = useState(1)
  const [restDayType, setRestDayType] = useState<'Planned' | 'Dynamic'>(
    'Planned',
  )
  const [trainingDays, setTrainingDays] = useState<
    { id: string; name: string; order: number; muscleGroups?: string[] }[]
  >([])
  const [numTrainingDays, setNumTrainingDays] = useState(0)
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [editingDayName, setEditingDayName] = useState<string>('')

  const dragPos = useSharedValue({ x: -999, y: -999 })
  const activeDropZoneId = useSharedValue<string | null>(null)

  const createSplitMutation = useCreateSplitMutation()
  const createSessionMutation = useCreateSessionMutation()
  const navigation = useNavigation()

  const {
    data: muscleGroups,
    isLoading: muscleGroupsLoading,
    isError: muscleGroupsError,
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
  }

  // TODO handle index instead of muscle group
  const handleRemovingMuscleGroup = (
    id: Session['id'],
    muscleGroupId: string,
  ) => {
    setTrainingDays(
      trainingDays.map((day) =>
        day.id === id
          ? {
              ...day,
              muscleGroups: day.muscleGroups?.filter(
                (groupId) => groupId !== muscleGroupId,
              ),
            }
          : day,
      ),
    )
    console.log('muscle group removed from training day')
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

  const handleIncrementRir = () => {
    setRirTarget((prev) => Math.min(prev + 1, 5))
  }

  const handleDecrementRir = () => {
    setRirTarget((prev) => Math.max(prev - 1, 1))
  }

  const handleIncrementTrainingDays = () => {
    setTrainingDays([
      ...trainingDays,
      { id: Crypto.randomUUID(), name: '', order: trainingDays.length },
    ])
  }

  const handleDecrementTrainingDays = () => {
    setTrainingDays(trainingDays.slice(0, -1))
  }

  const handleSubmit = async () => {
    const splitId = Crypto.randomUUID()

    await new Promise((resolve, reject) => {
      createSplitMutation.mutate(
        { id: splitId, name: splitName, rirTarget },
        {
          onSuccess: resolve,
          onError: reject,
        },
      )
    })

    // TODO: make this all parallel
    // Create all training days and their associated muscle groups
    const trainingDayPromises = trainingDays.map(async (day, dayIndex) => {
      const sessionId = Crypto.randomUUID()

      // Create the session for the training day
      await createSessionMutation.mutateAsync({
        id: sessionId,
        splitTemplateId: splitId,
        name: day.name,
        order: dayIndex,
      })

      // Create muscle groups for the session
      if (day.muscleGroups) {
        const muscleGroupPromises = day.muscleGroups.map(
          (muscleGroupId, muscleGroupIndex) =>
            createSessionExercise({
              sessionId,
              muscleGroupId,
              order: muscleGroupIndex,
            }),
        )

        // Wait for all muscle group creations to complete
        return muscleGroupPromises
      }
    })

    // Wait for all training day promises to complete
    await Promise.all(trainingDayPromises)
    console.log('training days created')

    navigation.goBack() // Dismiss the route / pop the stack

    // createSplitMutation.mutate(
    //   { id: splitId, name: splitName, rirTarget },
    //   {
    //     onSuccess: () => {
    //       trainingDays.forEach((day, dayIndex) => {
    //         console.log('creating training day123', day.name)
    //         createSessionMutation.mutate(
    //           {
    //             id: sessionId,
    //             splitTemplateId: splitId,
    //             name: day.name,
    //             order: dayIndex,
    //           },
    //           {
    //             onError: (error) => {
    //               console.error('Error creating training day', error)
    //             },
    //             onSettled: () => {
    //               console.log('training day creation settled')
    //             },
    //             onSuccess: async () => {
    //               console.log('training day created')
    //               // create template session and then session muscle groups
    //               // Create muscle groups for the session
    //               if (day.muscleGroups) {
    //                 const muscleGroupPromises = day.muscleGroups.map(
    //                   (muscleGroupId, muscleGroupIndex) =>
    //                     createSessionMuscleGroup({
    //                       sessionId,
    //                       muscleGroupId,
    //                       order: muscleGroupIndex,
    //                     }),
    //                 )

    //                 // Wait for all muscle group creations to complete
    //                 await Promise.all(muscleGroupPromises)
    //               }
    //             },
    //           },
    //         )
    //       })
    //       navigation.goBack() // Dismiss the route / pop the stack
    //     },
    //     onError: (error) => {
    //       console.error('Error creating split', error)
    //     },
    //     onSettled: () => {
    //       // console.log('split creation settled')
    //     },
    //   },
    // )
  }

  useEffect(() => {
    // start with 3 training days
    setTrainingDays([
      { id: Crypto.randomUUID(), name: '', order: 0 },
      { id: Crypto.randomUUID(), name: '', order: 1 },
      { id: Crypto.randomUUID(), name: '', order: 2 },
    ])
  }, [])

  useEffect(() => {
    setNumTrainingDays(trainingDays.length)
  }, [trainingDays])

  const muscleGroupFrequency = muscleGroups?.reduce(
    (acc, group) => {
      const count = trainingDays.reduce((count, day) => {
        return count + (day.muscleGroups?.includes(group.id) ? 1 : 0)
      }, 0)
      if (count > 0) {
        acc[group.name] = count
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <View className='flex flex-1 items-center gap-5 p-4'>
      <View className='w-full text-left'>
        <Text className='text-lg font-bold text-black'>Split Name:</Text>
        <TextInput
          className='mt-5 h-10 border border-gray-400 px-2'
          placeholder='Push / Pull / Legs'
          value={splitName}
          onChangeText={setSplitName}
        />
      </View>
      <View className='h-10 w-full flex-row items-center justify-between'>
        <Text className='text-lg font-bold'>RIR Target:</Text>
        <View className='flex-row items-center gap-2'>
          <Button
            title='-'
            onPress={handleDecrementRir}
            disabled={rirTarget <= 0}
          />
          <Text className='mt-1 w-8 text-center text-lg'>{rirTarget}</Text>
          <Button
            title='+'
            onPress={handleIncrementRir}
            disabled={rirTarget >= 5}
          />
        </View>
      </View>

      <View className='h-10 w-full flex-row items-center justify-between'>
        <Text className='text-lg font-bold'>Rest Days:</Text>
        <View className='flex-row items-center gap-2'>
          <Button
            title='Planned'
            onPress={() => setRestDayType('Planned')}
            disabled={restDayType === 'Planned'}
          />
          <Button
            title='Dynamic'
            onPress={() => setRestDayType('Dynamic')}
            disabled={restDayType === 'Dynamic'}
          />
        </View>
      </View>

      {muscleGroups && (
        <View className='flex flex-row flex-wrap justify-center gap-2 p-2'>
          {muscleGroups.map((group) => (
            <MuscleGroupDragButton
              key={group.id}
              dragPos={dragPos}
              activeDropZoneId={activeDropZoneId}
              group={group}
              onDrop={(group, x, y) => {
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
            />
          ))}
        </View>
      )}

      <View className='h-10 w-full flex-row items-center justify-between'>
        <Text className='text-lg font-bold'>
          {restDayType === 'Planned' ? 'Cycle Length' : 'Training Days'}
        </Text>
        <View className='flex-row items-center gap-2'>
          <Button
            title='-'
            onPress={handleDecrementTrainingDays}
            disabled={numTrainingDays <= 1}
          />
          <Text className='mt-1 w-8 text-center text-lg'>
            {numTrainingDays}
          </Text>
          <Button
            title='+'
            onPress={handleIncrementTrainingDays}
            disabled={numTrainingDays >= 10}
          />
        </View>
      </View>

      <View className='mt-2 flex flex-row items-center justify-between rounded-md p-2'>
        <FlashList
          data={trainingDays}
          keyExtractor={(item) => item.id}
          extraData={{
            editingDayName,
            editingDayId,
            activeDropZoneId,
          }}
          renderItem={({ item, index }) => (
            <View className='my-4 flex justify-between px-4'>
              <DropZone
                className='rounded-lg'
                key={item.id}
                zoneId={item.id}
                activeDropZoneId={activeDropZoneId}
                dragPos={dragPos}
              >
                <View className='my-4 flex justify-between px-4'>
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
                      <View className='flex w-full flex-row items-center justify-between'>
                        <Text className='text-lg font-bold'>
                          {item.name ? item.name : 'Day ' + (index + 1)}:{' '}
                        </Text>
                        {restDayType === 'Planned' &&
                          (item.muscleGroups?.length || 0) === 0 && (
                            <Text className='text-lg font-bold text-gray-500'>
                              Rest Day
                            </Text>
                          )}
                        <TouchableOpacity
                          // title='Edit'
                          onPress={() =>
                            handleEditTrainingDay(item.id, item.name)
                          }
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
                  <View className=''>
                    {/* show all muscle groups */}
                    <View className='flex gap-2'>
                      {item.muscleGroups?.map((groupId, i) => (
                        // TODO: fix z-index issues with other buttons and scroll container
                        <MuscleGroupDragButton
                          key={'day' + groupId}
                          dragPos={dragPos}
                          activeDropZoneId={activeDropZoneId}
                          group={
                            muscleGroups?.find(
                              (g) => g.id === groupId,
                            ) as MuscleGroup
                          }
                          onDrop={(group, x, y) => {
                            console.log('dropped', group, x, y)
                            if (
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

                            // have to make sure this runs after the dropzone has updated
                            setTimeout(() => {
                              activeDropZoneId.value = null
                            }, 10)
                          }}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </DropZone>
            </View>
          )}
          estimatedItemSize={50}
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        className='rounded-md bg-green-400 p-4'
      >
        <Text className='text-lg font-bold text-white'>Create Split</Text>
      </TouchableOpacity>
      {muscleGroupsLoading && <Text>Loading muscle groups...</Text>}
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
      </View>
    </View>
  )
}

export default ModalScreen
