import { Stack } from 'expo-router'

export default function AuthModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='add-exercise'
        options={{
          title: 'Add Exercise',
        }}
      />
      <Stack.Screen
        name='split'
        options={{
          title: 'Split',
        }}
      />
    </Stack>
  )
}
