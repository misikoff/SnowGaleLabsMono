import '@/global.css'
import { Text, View } from 'react-native'
import { Link, Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

export default function HomeLayout() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <View className='flex-1 bg-gray-100'>
        {/* Header */}
        <View className='h-16 items-center justify-center bg-blue-600'>
          <StatusBar style='auto' />
          <Text className='text-lg font-bold text-white'>Header</Text>
        </View>

        {/* Dynamic Slot */}
        <View className='flex-1 items-center justify-center p-4'>
          <Slot />
        </View>

        {/* Footer */}
        <View className='h-16 flex-row items-center justify-center bg-blue-600'>
          <Text className='text-lg font-bold text-white'>Footer</Text>
          <Link href='/' className='hover:text-red-500'>
            root
          </Link>
        </View>
      </View>
    </QueryClientProvider>
  )
}
