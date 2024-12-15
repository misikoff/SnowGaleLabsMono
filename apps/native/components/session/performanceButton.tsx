import { useState } from 'react'

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native'
import { Picker as SelectPicker } from '@react-native-picker/picker'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import {
  SessionWithSetGroupWithExerciseAndSets,
  Set,
  SetGroupWithExerciseAndSets,
} from '@repo/db/schema'
import { updateSet } from '@/lib/dbFunctions'

export default function PerformanceButton({
  set,
  disabled = false,
  children,
}: {
  set: Set
  disabled?: boolean
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [showMoveModal, setShowMoveModal] = useState(false)

  const [curWeight, setCurWeight] = useState(set.weight)
  const [curReps, setCurReps] = useState(set.reps)
  const [curRpe, setCurRpe] = useState(set.rpe)

  const updateSetMutation = useMutation({
    mutationFn: ({ id, reps, weight, rpe }: Parameters<typeof updateSet>[0]) =>
      updateSet({
        id,
        reps,
        weight,
        rpe,
      }),

    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (updatedSet: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', set.sessionId],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData([
        'session',
        set.sessionId,
      ])
      const nextSession = produce(
        previousSession,
        (draft: SessionWithSetGroupWithExerciseAndSets) => {
          draft.setGroups.map((sg: SetGroupWithExerciseAndSets) => {
            sg.sets = sg.sets.map((s: Set) => {
              if (s.id === set.id) {
                s.reps = updatedSet.reps
                s.weight = updatedSet.weight
                s.rpe = updatedSet.rpe
              }
              return s
            })
          })
        },
      )

      // Optimistically update to the new value
      queryClient.setQueryData(['session', set.sessionId], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, updatedSet, context) => {
      console.log('error')
      console.log({ err })
      console.log({ updatedSet, context })
      queryClient.setQueryData(
        ['session', set.sessionId],
        context?.previousSession,
      )
    },
    onSuccess: () => {
      console.log('success')
      // need to do another mutation to add the first set to the set group
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log('settled')
      queryClient.invalidateQueries({
        queryKey: ['session', set.sessionId],
      })
    },
  })

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showMoveModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setShowMoveModal(!showMoveModal)
        }}
      >
        <Pressable
          className='absolute inset-0 bg-gray-700 opacity-35'
          onPress={() => {
            setShowMoveModal(false)
          }}
        />
        <View className='flex-grow' />
        <View className='items-center justify-center bg-slate-700'>
          <View className='w-full flex-row justify-between border-b-2 border-gray-200 p-4'>
            <TouchableOpacity onPress={() => setShowMoveModal(!showMoveModal)}>
              <Text className='text-lg text-blue-400'>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                // console.log({ selectedMoveDate })
                // updateSessionMutation.mutateAsync({
                //   id: currentSession!.id,
                //   date: selectedMoveDate,
                // })
                await updateSetMutation.mutateAsync({
                  id: set.id,
                  weight: Number(curWeight),
                  reps: Number(curReps),
                  rpe: Number(curRpe),
                })
                setShowMoveModal(false)
              }}
            >
              <Text className='text-lg font-bold text-blue-400'>Select</Text>
            </TouchableOpacity>
          </View>

          <View className='flex-row justify-between p-4'>
            <View className='w-1/3'>
              <Text className='text-center text-lg text-white'>Weight</Text>

              <SelectPicker
                itemStyle={pickerSelectStyles.pickerItem}
                style={pickerSelectStyles.picker}
                selectedValue={curWeight}
                onValueChange={(itemValue, itemIndex) =>
                  setCurWeight(itemValue)
                }
              >
                {[
                  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
                  85, 90, 95, 100,
                ].map((week, i) => (
                  <SelectPicker.Item
                    key={i}
                    label={week.toString()}
                    value={week}
                  />
                ))}
              </SelectPicker>
            </View>
            <View className='w-1/3'>
              <Text className='text-center text-lg text-white'>Reps</Text>

              <SelectPicker
                itemStyle={pickerSelectStyles.pickerItem}
                style={pickerSelectStyles.picker}
                selectedValue={curReps}
                onValueChange={(itemValue, itemIndex) => setCurReps(itemValue)}
              >
                {[
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                  19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
                  34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
                  49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                ].map((week, i) => (
                  <SelectPicker.Item
                    key={i}
                    label={week.toString()}
                    value={week}
                  />
                ))}
              </SelectPicker>
            </View>
            <View className='w-1/3'>
              <Text className='text-center text-lg text-white'>RIR</Text>
              <SelectPicker
                itemStyle={pickerSelectStyles.pickerItem}
                style={pickerSelectStyles.picker}
                selectedValue={curRpe}
                onValueChange={(itemValue, itemIndex) => setCurRpe(itemValue)}
              >
                {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((week, i) => (
                  <SelectPicker.Item
                    key={i}
                    label={week.toString()}
                    value={week}
                  />
                ))}
              </SelectPicker>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowMoveModal(true)}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  modalView: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    elevation: 2,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})

const pickerSelectStyles = StyleSheet.create({
  picker: {
    width: '100%',
    fontSize: 8,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 0, // to ensure the text is never behind the icon
  },
  pickerItem: {
    color: 'white',
    // backgroundColor: 'black',
  },
})
