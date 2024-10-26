import { View, Text } from 'react-native'
import { Link } from 'expo-router'

export default function Tab() {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text>Welcome</Text>
      <Link href='/app/session'>
        <Text>Start a Session</Text>
      </Link>
    </View>
  )
}
