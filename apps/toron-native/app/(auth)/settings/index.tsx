import { Alert, Pressable, Text, View } from 'react-native'
// import Modal3D from '@/components/modal3d'
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
                // fetch from localhost
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

export default function App() {
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
    <View className='mt-12 flex-1 items-start gap-5 p-5'>
      <View className='items-start gap-2 rounded-md bg-gray-300 p-4'>
        <Text className='text-center text-sm font-extrabold'>
          ID: {user && user.data.user?.id}
        </Text>
        <Text className='text-center text-sm font-extrabold'>
          Email: {user && user.data.user?.email}
        </Text>
      </View>

      <View className='flex-row items-center gap-3 rounded-md bg-red-200 px-4 py-2'>
        <Text className='text-lg font-bold'>Log Out</Text>
        <LogoutButton />
      </View>
      <View className='flex-row items-center gap-3 rounded-md bg-red-200 px-4 py-2'>
        <Text className='text-lg font-bold'>Delete Account</Text>
        <DeleteAccountButton />
      </View>
    </View>
    // </Modal3D>
  )
}
