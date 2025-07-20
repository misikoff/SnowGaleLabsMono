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
  const [isLoaded, setIsLoaded] = useState(false)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session)
        setIsLoaded(true)
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
    const handleAppStateChange = (state: string) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh().catch(() => {})
      } else {
        supabase.auth.stopAutoRefresh().catch(() => {})
      }
    }
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    )
    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) {
      return
    }
    const isSignedIn = session && session.user
    const inTabsGroup =
      Array.isArray(segments) &&
      (segments[0] === '(auth)' || segments[0] === '(auth-modal)')
    if (isSignedIn && !inTabsGroup) {
      router.replace('/train')
    } else if (!isSignedIn && inTabsGroup) {
      router.replace('/login')
    } else if (
      !isSignedIn &&
      Array.isArray(segments) &&
      segments.length === 0
    ) {
      router.replace('/login')
    }
  }, [isLoaded, session, router, segments])

  if (!isLoaded) {
    return null
  }
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
          <Stack.Screen name='(public)' options={{ headerShown: false }} />
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
