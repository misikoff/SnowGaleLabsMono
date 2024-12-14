import '@/global.css'
import { useEffect } from 'react'

import { Slot, useRouter, useSegments } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import {
  ClerkProvider,
  // ClerkLoaded,
  useAuth,
} from '@clerk/clerk-expo'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      console.log(err)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      console.log(err)
      return
    }
  },
}

// TODO: consider moving this to within (auth)
export const queryClient = new QueryClient()

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    console.log('in useEffect')
    console.log({ isLoaded, isSignedIn, segments })
    if (!isLoaded) {
      return
    }

    const inTabsGroup = segments[0] === '(auth)'

    console.log('User changed: ', isSignedIn)

    if (isSignedIn && !inTabsGroup) {
      // console.log('replacing to /session')
      router.replace('/session')
    } else if (!isSignedIn && inTabsGroup) {
      // console.log('replacing to /login')
      router.replace('/login')
    } else if (!isSignedIn && segments.length === 0) {
      // console.log('replacing to /login')
      router.replace('/login')
    }
  }, [isLoaded, isSignedIn, router, segments])

  return (
    <QueryClientProvider client={queryClient}>
      {/* {!isSignedIn && <Text> not signed in</Text>}
        {isSignedIn && <Text> signed in!!!</Text>} */}
      <Slot />
    </QueryClientProvider>
  )
}

export default function HomeLayout() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView>
        <InitialLayout />
        {/* <ClerkLoaded> */}
        {/* <QueryClientProvider client={queryClient}> */}
        {/* <SafeAreaView className='flex-1'> */}
        {/* <View
          style={{ height: STATUS_BAR_HEIGHT, backgroundColor: '#0D87E1' }}
          >
          <StatusBar
          translucent
          backgroundColor={'#0D87E1'}
          barStyle='light-content'
          />
          </View> */}
        {/* <Slot /> */}
        {/* <Stack>
            <Stack.Screen name='(home)' options={{ headerShown: false }} />
            </Stack> */}
        {/* </SafeAreaView> */}
        {/* </QueryClientProvider> */}
        {/* </ClerkLoaded> */}
      </GestureHandlerRootView>
    </ClerkProvider>
  )
}
