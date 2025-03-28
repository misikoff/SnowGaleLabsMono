import { Stack } from 'expo-router'

export default function TrainLayout() {
  return (
    <Stack
      screenOptions={{
        title: 'Train',
        headerShown: true,
        headerStyle: { backgroundColor: '#f8f9fa' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackButtonDisplayMode: 'minimal',
      }}
    />
  )
}
