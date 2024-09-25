import TestComponent from '@/components/test'
import { Link } from 'expo-router'
import { View, Text } from 'react-native'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Text>Home</Text>
      <Link href="/">/</Link>
      <TestComponent name="Home3" />
    </View>
  )
}
