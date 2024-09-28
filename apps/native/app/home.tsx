import { View, Text } from 'react-native'
import { Link } from 'expo-router'

import TestComponent from '../components/test'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Text>Home</Text>
      <Link href='/'>/</Link>
      <TestComponent name='Home3' />
    </View>
  )
}
