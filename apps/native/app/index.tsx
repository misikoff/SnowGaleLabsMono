// import { registerRootComponent } from 'expo'

// import App from './App'

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in the Expo client or in a native build,
// // the environment is set up appropriately
// registerRootComponent(App)

import {
  View,
  Text,
  LogBox,
  // StyleSheet,
  Pressable,
} from 'react-native'
import { useFonts } from 'expo-font'
import { Link } from 'expo-router'
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'

import InterBold from '@/assets/fonts/Inter-Bold.ttf'
import InterMedium from '@/assets/fonts/Inter-Medium.ttf'
import InterRegular from '@/assets/fonts/Inter-Regular.ttf'
import InterSemiBold from '@/assets/fonts/Inter-SemiBold.ttf'
import MontserratBold from '@/assets/fonts/Montserrat-Bold.ttf'
import MontserratLight from '@/assets/fonts/Montserrat-Light.ttf'
import MontserratMedium from '@/assets/fonts/Montserrat-Medium.ttf'
import MontserratRegular from '@/assets/fonts/Montserrat-Regular.ttf'
import MontserratSemiBold from '@/assets/fonts/Montserrat-SemiBold.ttf'

// function Shape() {
//   return (
//     <MotiView
//       from={{
//         translateY: -100,
//       }}
//       animate={{
//         translateY: 0,
//       }}
//       transition={{
//         loop: true,
//         type: 'timing',
//         duration: 1500,
//         delay: 100,
//       }}
//       style={styles.shape}
//     />
//   )
// }

// const styles = StyleSheet.create({
//   shape: {
//     justifyContent: 'center',
//     height: 250,
//     width: 250,
//     borderRadius: 25,
//     marginRight: 10,
//     backgroundColor: 'white',
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     backgroundColor: '#9c1aff',
//   },
// })

export default function App() {
  LogBox.ignoreLogs(['Warning: ...'])
  LogBox.ignoreAllLogs()

  const { user } = useUser()
  // const c = useClerk()
  const auth = useAuth()

  const signOut = async () => {
    // await c.signOut()
    await auth.signOut()
  }

  const [loaded] = useFonts({
    Bold: InterBold,
    SemiBold: InterSemiBold,
    Medium: InterMedium,
    Regular: InterRegular,

    MBold: MontserratBold,
    MSemiBold: MontserratSemiBold,
    MMedium: MontserratMedium,
    MRegular: MontserratRegular,
    MLight: MontserratLight,
  })
  // not loading for some reason because of imports instead of requires
  if (!loaded) {
    return false
  }

  return (
    <View className='flex-1 items-center gap-8 p-8'>
      <Text>Welcome to Centurion</Text>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Link
          href='/app'
          className='overflow-hidden rounded-lg bg-blue-400 px-2 py-3 font-extrabold text-white shadow-2xl'
        >
          Proceed To App
        </Link>
        <Pressable onPress={signOut}>
          <Text>sign out 123</Text>
        </Pressable>
      </SignedIn>
      <SignedOut>
        <Link href='/(auth)/sign-in'>
          <Text>Sign In</Text>
        </Link>
        <Link href='/(auth)/sign-up'>
          <Text>Sign Up</Text>
        </Link>
      </SignedOut>
      {/* <View className='h-24 w-24'>
        <MotiView style={styles.container}>
          <Shape />
        </MotiView>
      </View> */}
    </View>
  )
}
