import { Text, View } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'

export default function Page() {
  const { slug } = useLocalSearchParams()

  return (
    <View>
      <Link href='/app/session'>Back</Link>
      <Text>Session post: {slug}</Text>
    </View>
  )
}
