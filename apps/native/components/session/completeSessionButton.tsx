import { useState } from 'react'

import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { SessionWithSetGroupWithExerciseAndSets } from '@repo/db/schema'
import { updateSession } from '@/lib/dbFunctions'

export default function CompleteSessionButton({
  session,
  children,
}: {
  session: SessionWithSetGroupWithExerciseAndSets
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)

  const updateSessionMutation = useMutation({
    mutationFn: ({ id, completed }: Parameters<typeof updateSession>[0]) =>
      updateSession({
        id,
        completed,
      }),
    // When mutate is called:
    // TODO: better typing with a simple set or dummy set, but still may require casting
    onMutate: async (updatedSession: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['session', session.id],
      })

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['session', session.id])
      const nextSession = produce(previousSession, (draft: any) => {
        draft.completed = true
      })

      // Optimistically update to the new value
      queryClient.setQueryData(['session', session.id], nextSession)

      // setOpen(false)

      // Return a context object with the snapshotted value
      return { previousSession }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, updatedSession, context) => {
      console.log('error')
      console.log({ err })
      console.log({ updatedSession, context })
      queryClient.setQueryData(
        ['session', session.id],
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
        queryKey: ['session', session.id],
      })
    },
  })

  return (
    <View className='mt-12 items-center justify-center'>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setModalVisible(!modalVisible)
        }}
      >
        <View className='my-8 items-center justify-center'>
          <View
            className='m-5 items-center rounded-3xl bg-slate-50 p-1'
            style={styles.modalView}
          >
            <Text className='my-4 text-center font-bold'>
              Mark session complete?
            </Text>

            <View className='flex w-full flex-row justify-between gap-6'>
              <Pressable
                className='w-1/2 rounded-md rounded-bl-3xl bg-gray-300 p-3'
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className='text-center'>Cancel</Text>
              </Pressable>
              <Pressable
                className='group w-1/2 rounded-md rounded-br-3xl bg-green-400 p-3 transition-colors disabled:bg-gray-600'
                onPress={async () => {
                  console.log({ sessionId: session.id })

                  await updateSessionMutation.mutateAsync({
                    id: session.id,
                    completed: true,
                  })

                  setModalVisible(!modalVisible)

                  router.navigate(`/(auth)/session`)
                }}
              >
                <Text className='text-center transition-colors group-disabled:text-white'>
                  Complete
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <CustomSelect
            options={options}
            selectedValue={selectedValue}
            onSelect={(option) => setSelectedExercise(option.value)}
            placeholder='Select an option'
          />
        </View> */}
      </Modal>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        {children}
      </Pressable>
    </View>
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
})
