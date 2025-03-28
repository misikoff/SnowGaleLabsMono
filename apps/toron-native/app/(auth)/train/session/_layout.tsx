import { useEffect } from 'react'

import { Alert, Button, View } from 'react-native'
import {
  router,
  Slot,
  useLocalSearchParams,
  useNavigation,
  useSegments,
} from 'expo-router'

import { useDeleteSessionMutation } from '@/lib/mutations/sessionMutations'

export default function SessionLayout() {
  const segments = useSegments() // Get the current route segments
  const isSlugRoute = segments[segments.length - 1]?.startsWith('[slug]') // Check if the route is train/session/[slug]

  const navigation = useNavigation()
  const { slug: sessionId } = useLocalSearchParams()
  console.log({ sessionId })
  const deleteSessionMutation = useDeleteSessionMutation()

  useEffect(() => {
    if (isSlugRoute) {
      navigation.setOptions({
        title: 'Active Session',
        headerRight: () => (
          <Button
            title='...'
            onPress={() => {
              // Custom action when the button is pressed
              // show an alert with multiple options, including delete and complete
              Alert.alert('Options', 'Choose an action', [
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    // Handle delete action
                    console.log('Delete pressed')

                    await deleteSessionMutation
                      .mutateAsync({ id: sessionId })
                      .then(() => {
                        console.log('Session deleted!!!!!!!!')
                        router.back()
                      })
                  },
                },
                {
                  text: 'Complete',
                  onPress: () => {
                    // Handle complete action
                    console.log('Complete pressed')
                  },
                },
                { text: 'Cancel', style: 'cancel' },
              ])
            }}
          />
        ),
      })
    }
  }, [deleteSessionMutation, isSlugRoute, navigation, sessionId])

  return (
    <View className='h-full px-4 py-2'>
      <Slot />
    </View>
  )
}
