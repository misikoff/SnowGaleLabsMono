import { useEffect, useRef, useState } from 'react'

import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
} from 'react-native'
import * as Crypto from 'expo-crypto'
import { useNavigation } from 'expo-router'
import { Picker } from '@react-native-picker/picker'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { PencilIcon } from 'lucide-react-native'
import { useSharedValue } from 'react-native-reanimated'

import DropZone from '@/components/dropZone'
import MuscleGroupDragButton from '@/components/muscleGroupDragButton'
import { createSessionExercise, getMuscleGroups } from '@/lib/dbFunctions'
import { useCreateSessionMutation } from '@/lib/mutations/sessionMutations'
import { useCreateSplitMutation } from '@/lib/mutations/splitMutations'

const ModalScreen = () => {
  const [splitName, setSplitName] = useState('')
  const [rirTarget, setRirTarget] = useState(1)
  const [trainingDays, setTrainingDays] = useState<
    { id: string; name: string; order: number; muscleGroups?: string[] }[]
  >([])
  const [numTrainingDays, setNumTrainingDays] = useState(0)
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [editingDayName, setEditingDayName] = useState<string>('')
  const [selectedTrainingDayId, setSelectedTrainingDayId] = useState<
    string | null
  >(null)
  const [selectedMuscleGroupId, setSelectedMuscleGroupId] = useState<
    string | null
  >(null)

  const [dragging, setDragging] = useState(false)
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

  const handleTrainingDayNameChange = (id: string, name: string) => {
    setTrainingDays(
      trainingDays.map((day) => (day.id === id ? { ...day, name } : day)),
    )
  }

  const handleMuscleGroupChange = (id: string, muscleGroupId: string) => {
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
    setSelectedTrainingDayId(null)
    setSelectedMuscleGroupId(null)
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

      {muscleGroups && (
        <View className='flex flex-row flex-wrap gap-2 p-2'>
          {/* <Text>{dragPos.value.x}</Text>
          <Text>{dragPos.value.y}</Text> */}
          {muscleGroups.map((group) => (
            <MuscleGroupDragButton
              key={group.id}
              dragPos={dragPos}
              group={group}
              onDrag={() => {
                console.log('dragging')
                setDragging(true)
              }}
              onDrop={(group, x, y) => {
                setDragging(false)
                console.log('dropped', group, x, y)
                // handleDrop(group, x, y)
              }}

              // onPress={() => {
              //   if (selectedTrainingDayId) {
              //     handleMuscleGroupChange(selectedTrainingDayId, group.id)
              //   }
              // }}
            />
            // <TouchableOpacity
            //   key={group.id}
            //   onPress={() =>
            //     // setFilteredMuscleGroupId(
            //     //   filteredMuscleGroupId === group.id ? null : group.id,
            //     // )
            //     console.log('muscle group pressed')
            //   }
            //   className={'rounded-full bg-gray-300 px-4 py-2'}
            // >
            //   <Text className={'text-sm font-bold text-black'}>
            //     {group.name}
            //   </Text>
            // </TouchableOpacity>
          ))}
        </View>
      )}

      <View className='h-10 w-full flex-row items-center justify-between'>
        <Text className='text-lg font-bold'>Training Days:</Text>
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

      <View className='mt-2 flex flex-row items-center justify-between rounded-md bg-gray-400 p-2'>
        <FlashList
          data={trainingDays}
          keyExtractor={(item) => item.id}
          extraData={{
            editingDayName,
            editingDayId,
            selectedTrainingDayId,
            activeDropZoneId,
          }}
          renderItem={({ item, index }) => (
            <View
              key={item.id}
              className='flex justify-between'
              // onLayout={(event) => handleLayout(event, item.id)} // Capture layout
            >
              <DropZone
                zoneId={item.id}
                activeDropZoneId={activeDropZoneId}
                dragPos={dragPos}
              >
                <View
                  className={clsx(
                    'flex flex-row items-center justify-between',
                    // item.id === activeDropZoneId
                    //     ? 'bg-sky-600'
                    //     : 'bg-green-400',
                  )}
                >
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
                    <>
                      <View>
                        {/* {dragging ? (
                          <>
                            <Text>woww</Text>
                          </>
                        ) : (
                          <></>
                        )} */}
                        <Text>
                          {item.name ? item.name : 'Day ' + (index + 1)}:
                          {item.id.slice(0, 5)}
                        </Text>

                        <TouchableOpacity
                          // title='Edit'
                          onPress={() =>
                            handleEditTrainingDay(item.id, item.name)
                          }
                        >
                          <PencilIcon size={16} />
                        </TouchableOpacity>
                      </View>
                    </>
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
              </DropZone>
              <View className=''>
                {/* show all muscle groups */}
                <View className='flex gap-2'>
                  {item.muscleGroups?.map((groupId) => (
                    <Text key={groupId}>
                      {muscleGroups?.find((g) => g.id === groupId)?.name}
                    </Text>
                  ))}
                </View>
              </View>
              <Button
                title='+'
                onPress={() => setSelectedTrainingDayId(item.id)}
              />
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
      <Modal
        visible={!!selectedTrainingDayId}
        transparent={true}
        animationType='slide'
      >
        <View className='flex-1 justify-end'>
          <View className='w-full rounded-t-md bg-white p-4'>
            <Text className='text-lg font-bold'>Select Muscle Group</Text>
            <Picker
              selectedValue={selectedMuscleGroupId}
              onValueChange={(value) => setSelectedMuscleGroupId(value)}
              style={{ height: 200, width: '100%' }}
            >
              <Picker.Item label='Select Muscle Group' value={null} />
              {muscleGroups?.map((group) => (
                <Picker.Item
                  key={group.id}
                  label={group.name}
                  value={group.id}
                />
              ))}
            </Picker>
            <View className='mt-4 flex-row justify-between'>
              <Button
                title='Cancel'
                onPress={() => {
                  setSelectedTrainingDayId(null)
                  setSelectedMuscleGroupId(null)
                }}
              />
              <Button
                title='Add'
                onPress={() => {
                  if (selectedTrainingDayId && selectedMuscleGroupId) {
                    handleMuscleGroupChange(
                      selectedTrainingDayId,
                      selectedMuscleGroupId,
                    )
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
