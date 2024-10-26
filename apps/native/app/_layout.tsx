import '@/global.css'
import {
  //  Platform,
  //  StatusBar,
  View,
} from 'react-native'
import { Slot } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (item) {
        console.log(`${key} was used 🔐 \n`)
      } else {
        console.log('No values stored under key: ' + key)
      }
      return item
    } catch (error) {
      console.error('SecureStore get item error: ', error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      console.error('SecureStore save item error: ', err)
      return
    }
  },
  async clearToken(key: string) {
    console.log('clear called!!')
    console.log('key: ', key)
    try {
      await SecureStore.deleteItemAsync(key)
      return
    } catch (err) {
      console.error('SecureStore delete item error: ', err)
      return
    }
  },
}

export const queryClient = new QueryClient()
// const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight

// need to call this on sign out
// tokenCache.clearToken('__clerk_client_jwt')

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

export default function HomeLayout() {
  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <View
          // style={{ height: STATUS_BAR_HEIGHT, backgroundColor: '#0D87E1' }}
          >
            {/* <StatusBar
              translucent
              backgroundColor={'#0D87E1'}
              barStyle='light-content'
            /> */}
          </View>
          <Slot />
          {/* <Stack>
            <Stack.Screen name='(home)' options={{ headerShown: false }} />
          </Stack> */}
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
