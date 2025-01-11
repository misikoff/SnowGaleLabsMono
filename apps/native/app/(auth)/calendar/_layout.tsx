import { Stack } from 'expo-router'
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='addExercise'
        options={{
          headerShown: false,
          presentation: 'formSheet',
          // gestureDirection: 'vertical',
          // animation: 'slide_from_bottom',
          sheetGrabberVisible: true,
          // sheetInitialDetentIndex: 0,
          // sheetAllowedDetents: [0.5, 1.0],
        }}
      />
    </Stack>
  )
}
