import '@/global.css'
import { useEffect, useState } from 'react'

import { Slot, useRouter, useSegments } from 'expo-router'
import { Session } from '@supabase/supabase-js'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import queryClient from '@/lib/queryClient'
import { supabase } from '@/utils/supabase'

const InitialLayout = () => {
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

    const inTabsGroup = segments[0] === '(auth)'

    // console.log('User changed: ', isSignedIn)

    if (isSignedIn && !inTabsGroup) {
      // console.log('replacing to /session')
      router.replace('/calendar')
    } else if (!isSignedIn && inTabsGroup) {
      // console.log('replacing to /login')
      router.replace('/login')
    }
    // TODO: fix this. not sure if the condition is wrong or should be removed
    else if (!isSignedIn && segments.length === 0) {
      // console.log('replacing to /login')
      router.replace('/login')
    }
  }, [isLoaded, isSignedIn, router, segments])

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  )
}

export default function HomeLayout() {
  return (
    <GestureHandlerRootView>
      <InitialLayout />
    </GestureHandlerRootView>
  )
}
