// import { registerRootComponent } from 'expo'

// import App from './App'

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in the Expo client or in a native build,
// // the environment is set up appropriately
// registerRootComponent(App)

import {
  View,
  //  StatusBar,
  //  Platform,
  Text,
} from 'react-native'
import { LogBox } from 'react-native'
import { StyleSheet } from 'react-native'
import { useFonts } from 'expo-font'
import { Link } from 'expo-router'
import { MotiView } from 'moti'

import * as InterBold from '../src/assets/fonts/Inter-Bold.ttf'
import * as InterMedium from '../src/assets/fonts/Inter-Medium.ttf'
import * as InterRegular from '../src/assets/fonts/Inter-Regular.ttf'
import * as InterSemiBold from '../src/assets/fonts/Inter-SemiBold.ttf'
import * as MontserratBold from '../src/assets/fonts/Montserrat-Bold.ttf'
import * as MontserratLight from '../src/assets/fonts/Montserrat-Light.ttf'
import * as MontserratMedium from '../src/assets/fonts/Montserrat-Medium.ttf'
import * as MontserratRegular from '../src/assets/fonts/Montserrat-Regular.ttf'
import * as MontserratSemiBold from '../src/assets/fonts/Montserrat-SemiBold.ttf'

function Shape() {
  return (
    <MotiView
      from={{
        translateY: -100,
      }}
      animate={{
        translateY: 0,
      }}
      transition={{
        loop: true,
        type: 'timing',
        duration: 1500,
        delay: 100,
      }}
      style={styles.shape}
    />
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#9c1aff',
  },
})

export default function App() {
  LogBox.ignoreLogs(['Warning: ...'])
  LogBox.ignoreAllLogs()

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
  if (!loaded) {
    return false
  }

  // const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: '#0D87E1' }}>
        <StatusBar
          translucent
          backgroundColor={'#0D87E1'}
          barStyle='light-content'
        />
      </View> */}
      <Text>Onward34343</Text>
      <Link href='/home'>home</Link>
      <MotiView style={styles.container}>
        <Shape />
      </MotiView>
    </View>
  )
}
