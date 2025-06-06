import { Text, TouchableOpacity, View } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

import { useSupabaseUser } from '@/lib/dbFunctions'
import { supabase } from '@/utils/supabase'

export const LogoutButton = () => {
  const doLogout = async () => {
    const { error } = await supabase.auth.signOut()
    console.log('Logging out...')
    // TODO: clear query cache
    if (error) {
      alert('Error logging out: ' + error.message)
      console.error('Error logging out:', error.message)
      return
    }
  }

  return (
    <TouchableOpacity onPress={doLogout} className='mr-3'>
      <View className='flex-row items-center gap-3 rounded-md bg-red-200 px-4 py-2'>
        <Text className='text-lg font-bold'>Log Out</Text>
        <Ionicons name='log-out-outline' size={24} color={'#444'} />
      </View>
    </TouchableOpacity>
  )
}

export default function TabLayout() {
  const { data: user, isLoading, isError } = useSupabaseUser()

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name='plan'
        options={{
          title: 'Plan',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='table-columns' color={color} />
          ),
          // headerShown: false,

          // headerRight: () => <LogoutButton />,
        }}
        redirect={isError}
      />

      <Tabs.Screen
        name='progress'
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='signal' color={color} />
          ),
        }}
        redirect={isError}
      />

      <Tabs.Screen
        name='train'
        options={{
          headerShown: false,
          title: 'Train',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='dumbbell' color={color} />
          ),
        }}
        redirect={isError}
      />

      <Tabs.Screen
        name='library'
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='book' color={color} />
          ),
          // headerShown: false,
        }}
        redirect={isError}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='gear' color={color} />
          ),
          // headerShown: false,

          // headerRight: () => <LogoutButton />,
        }}
        redirect={isError}
      />
    </Tabs>
  )
}
