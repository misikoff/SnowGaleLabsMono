import { Pressable } from 'react-native'
import { Tabs } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

export const LogoutButton = () => {
  const { signOut } = useAuth()

  const doLogout = () => {
    signOut()
  }

  return (
    <Pressable onPress={doLogout} className='mr-3'>
      <Ionicons name='log-out-outline' size={24} color={'#444'} />
    </Pressable>
  )
}
export default function TabLayout() {
  const { isSignedIn } = useAuth()

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Main',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='house-chimney' color={color} />
          ),
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name='session'
        options={{
          title: 'Session',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='dumbbell' color={color} />
          ),
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name='calendar'
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='calendar' color={color} />
          ),
          headerShown: false,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name='sliders' color={color} />
          ),
          headerShown: false,

          // headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  )
}
