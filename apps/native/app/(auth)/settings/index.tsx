import { Text, View } from 'react-native'
// import Modal3D from '@/components/modal3d'
import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/utils/supabase'

import { LogoutButton } from '../_layout'
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
    </View>
    // </Modal3D>
  )
}
