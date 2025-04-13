import '@/global.css'
import { useEffect, useState } from 'react'

import { AppState } from 'react-native'
import { useRouter, useSegments, Stack } from 'expo-router'
import { Session } from '@supabase/supabase-js'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import queryClient from '@/lib/queryClient'
import { supabase } from '@/utils/supabase'

const InitialLayout = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session)
      }
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
      }
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Tells Supabase Auth to continuously refresh the session automatically if
    // the app is in the foreground. When this is added, you will continue to receive
    // `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
    // if the user's session is terminated. This should only be registered once.
    const handleAppStateChange = (state: string) => {
      if (state === 'active') {
        console.log('Starting auto-refresh')
        supabase.auth.startAutoRefresh().catch((error) => {
          console.error('Error starting auto-refresh', error)
        })
      } else {
        console.log('Stopping auto-refresh')
        supabase.auth.stopAutoRefresh().catch((error) => {
          console.error('Error stopping auto-refresh', error)
        })
      }
    }

    // Add the event listener
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    )
    // Start the auto-refresh when the app is active

    // Cleanup the event listener on unmount
    return () => {
      subscription.remove()
    }
  }, [])

  const isSignedIn = session && session.user
  const isLoaded = session !== null

  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inTabsGroup =
      segments[0] === '(auth)' || segments[0] === '(auth-modal)'

    if (isSignedIn && !inTabsGroup) {
      router.replace('/(auth)/train')
    } else if (!isSignedIn && inTabsGroup) {
      router.replace('/login')
    }

    // @ts-expect-error: segments.length can be 0 when the app is opened for the first time
    else if (!isSignedIn && segments.length === 0) {
      router.replace('/login')
    }
  }, [isLoaded, isSignedIn, router, segments])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default function HomeLayout() {
  return (
    <GestureHandlerRootView>
      <InitialLayout>
        <Stack>
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          <Stack.Screen
            name='(auth-modal)'
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </InitialLayout>
    </GestureHandlerRootView>
  )
}
