import '@/global.css'
import { useEffect, useState } from 'react'

import { useRouter, useSegments, Stack } from 'expo-router'
import { Session } from '@supabase/supabase-js'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import queryClient from '@/lib/queryClient'
import { supabase } from '@/utils/supabase'

const InitialLayout = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const isSignedIn = session && session.user
  const isLoaded = session !== null

  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    // console.log('in useEffect')
    // console.log({ isLoaded, isSignedIn, segments })
    // if (!isLoaded) {
    //   return
    // }

    const inTabsGroup =
      segments[0] === '(auth)' || segments[0] === '(auth-modal)'

    // console.log('User changed: ', isSignedIn)

    if (isSignedIn && !inTabsGroup) {
      router.replace('/calendar')
    } else if (!isSignedIn && inTabsGroup) {
      router.replace('/login')
    } else if (!isSignedIn && segments.length === 0) {
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
              // headerBackTitle: 'Back',
            }}
          />
        </Stack>
      </InitialLayout>
    </GestureHandlerRootView>
  )
}
