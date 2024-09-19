// import { registerRootComponent } from 'expo'

// import App from './App'

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in the Expo client or in a native build,
// // the environment is set up appropriately
// registerRootComponent(App)

import { useFonts } from 'expo-font'
import { View, StatusBar, Platform, Text } from 'react-native'
import { LogBox } from 'react-native'
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Link } from 'expo-router';

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
  );
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
});



export default function App() {
  LogBox.ignoreLogs(['Warning: ...'])
  LogBox.ignoreAllLogs()

  const [loaded] = useFonts({
    Bold: require('../src/assets/fonts/Inter-Bold.ttf'),
    SemiBold: require('../src/assets/fonts/Inter-SemiBold.ttf'),
    Medium: require('../src/assets/fonts/Inter-Medium.ttf'),
    Regular: require('../src/assets/fonts/Inter-Regular.ttf'),

    MBold: require('../src/assets/fonts/Montserrat-Bold.ttf'),
    MSemiBold: require('../src/assets/fonts/Montserrat-SemiBold.ttf'),
    MMedium: require('../src/assets/fonts/Montserrat-Medium.ttf'),
    MRegular: require('../src/assets/fonts/Montserrat-Regular.ttf'),
    MLight: require('../src/assets/fonts/Montserrat-Light.ttf'),
  })
  if (!loaded) {
    return false;
  }

  const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: '#0D87E1' }}>
        <StatusBar
          translucent
          backgroundColor={'#0D87E1'}
          barStyle='light-content'
        />
      </View>
      <Text>Onward1</Text>
      <Link href="/home">home</Link>
      <MotiView style={styles.container}>
      <Shape />
    </MotiView>
    </View>
  )
}
