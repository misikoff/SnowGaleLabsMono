import { View, LogBox, ActivityIndicator } from 'react-native'
import { useFonts } from 'expo-font'

import InterBold from '@/assets/fonts/Inter-Bold.ttf'
import InterMedium from '@/assets/fonts/Inter-Medium.ttf'
import InterRegular from '@/assets/fonts/Inter-Regular.ttf'
import InterSemiBold from '@/assets/fonts/Inter-SemiBold.ttf'
import MontserratBold from '@/assets/fonts/Montserrat-Bold.ttf'
import MontserratLight from '@/assets/fonts/Montserrat-Light.ttf'
import MontserratMedium from '@/assets/fonts/Montserrat-Medium.ttf'
import MontserratRegular from '@/assets/fonts/Montserrat-Regular.ttf'
import MontserratSemiBold from '@/assets/fonts/Montserrat-SemiBold.ttf'

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

  return (
    <View className='flex-1 items-center justify-center gap-8 p-8'>
      <ActivityIndicator size='large' color='#0000ff' />
    </View>
  )
}
