import React, { useState } from 'react'
// import Modal3D from '@/components/modal3d'

import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/utils/supabase'

import { LogoutButton } from '../_layout'

const DeleteAccountButton = () => {
  const doLogout = async () => {
    const { error } = await supabase.auth.signOut()
    // TODO: clear query cache
    if (error) {
      alert('Error logging out: ' + error.message)
      console.error('Error logging out:', error.message)
      return
    }
  }

  return (
    <Pressable
      onPress={() => {
        Alert.alert(
          'Delete Account?',
          'If you delete your account, all your data will be lost.',
          [
            {
              text: 'No thanks',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                console.log('delete account')

                const {
                  data: { session },
                } = await supabase.auth.getSession()

                if (!session) {
                  Alert.alert('Error', 'User is not authenticated.')
                  return
                }

                const { access_token } = session
                console.log('access_token', access_token)

                try {
                  const response = await fetch(
                    `${process.env.EXPO_PUBLIC_TORON_API_ROOT_URL}/api/deleteUser`,
                    {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                      },
                    },
                  )

                  // const data = await response.json()

                  if (!response.ok) {
                    Alert.alert('Error', 'Failed to delete user.')
                    // throw new Error(data.error || 'Failed to delete user.')
                  }

                  Alert.alert('Success', 'User deleted successfully.')
                  // Perform any additional cleanup or navigation

                  doLogout()
                } catch (error) {
                  Alert.alert('Error', error.message)
                }

                // Haptics.notificationAsync(
                //   Haptics.NotificationFeedbackType.Success,
                // )
                // sessionDeleteMutation.mutateAsync({ id: session.id })
              },
            },
          ],
        )
      }}
      className='mr-3'
    >
      <Ionicons name='skull' size={24} color={'#444'} />
    </Pressable>
  )
}

const FeedbackButton = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [feedback, setFeedback] = useState('')

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Feedback cannot be empty.')
      return
    }

    // Get the current user's ID
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      Alert.alert('Error', 'Failed to retrieve user information.')
      console.error('Error retrieving user:', userError?.message)
      return
    }

    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      content: feedback,
    })

    if (error) {
      Alert.alert('Error', 'Failed to submit feedback.')
      console.error('Error submitting feedback:', error.message)
      return
    }

    Alert.alert('Success', 'Thank you for your feedback!')
    setFeedback('')
    setModalVisible(false)
  }

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        className='flex-row items-center gap-3 rounded-md bg-blue-200 px-4 py-2'
      >
        <Ionicons name='mail' size={24} color={'#444'} />
        <Text className='text-lg font-bold'>Send Feedback</Text>
      </Pressable>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          setFeedback('')
        }}
      >
        <View className='flex-1 items-center justify-center bg-black/50'>
          <View className='w-4/5 rounded-lg bg-white p-6'>
            <Text className='mb-4 text-lg font-bold'>Send Feedback</Text>
            <TextInput
              className='mb-4 h-24 w-full rounded-md border border-gray-300 p-2 text-sm'
              placeholder='Write your feedback here...'
              value={feedback}
              onChangeText={setFeedback}
              multiline
            />
            <View className='flex-row justify-between'>
              <Pressable
                className='flex-1 items-center justify-center rounded-md bg-gray-300 py-2'
                onPress={() => {
                  setModalVisible(false)
                  setFeedback('')
                }}
              >
                <Text className='font-bold text-gray-700'>Cancel</Text>
              </Pressable>
              <Pressable
                className='ml-2 flex-1 items-center justify-center rounded-md bg-blue-500 py-2'
                onPress={submitFeedback}
              >
                <Text className='font-bold text-white'>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default function Profile() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => supabase.auth.getUser(),
  })

  return (
    // <Modal3D modalContent={modalContent}>
    // <ScrollView>
    <View className='flex-1 items-start gap-2 p-5'>
      {/* Account Management Section */}
      <Text className='text-center text-lg font-bold text-gray-700'>
        Account Information
      </Text>
      <View className='items-start gap-2 rounded-md bg-gray-300 p-4'>
        <Text className='text-center text-sm font-extrabold'>
          ID: {user && user.data.user?.id}
        </Text>
        <Text className='text-center text-sm font-extrabold'>
          Email: {user && user.data.user?.email}
        </Text>
      </View>

      {/* Account Management Section */}
      <Text className='mt-8 text-lg font-bold text-gray-700'>
        Account Management
      </Text>
      <View className='flex-row items-center gap-3 rounded-md bg-red-200 px-4 py-2'>
        <Text className='text-lg font-bold'>Log Out</Text>
        <LogoutButton />
      </View>
      <View className='flex-row items-center gap-3 rounded-md bg-red-200 px-4 py-2'>
        <Text className='text-lg font-bold'>Delete Account</Text>
        <DeleteAccountButton />
      </View>

      {/* Data Management Section */}
      <Text className='mt-8 text-lg font-bold text-gray-700'>
        Data Management
      </Text>

      {/* TODO: implement complete data export */}
      <View className='flex-row items-center gap-3 rounded-md bg-blue-200 px-4 py-2'>
        <Text className='text-lg font-bold'>Export Data</Text>
      </View>

      {/* Feedback & Community Section */}
      <Text className='mt-8 text-lg font-bold text-gray-700'>
        Help Improve Toron
      </Text>
      <Text className='mb-4 text-sm text-gray-500'>
        Share your feedback or join our community to help us improve Toron.
      </Text>

      <FeedbackButton />
      {/* TODO: add discord invite button */}
      {/* <DiscordButton /> */}
    </View>
    // </ScrollView>
    // </Modal3D>
  )
}
