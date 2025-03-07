import { Stack } from 'expo-router'

export default function AuthModalLayout() {
  return (
    <Stack
      screenOptions={
        {
          //  presentation: 'modal',
          // headerShown: false,
          // headerStyle: {
          //   backgroundColor: '#f4511e',
          // },
          // headerTintColor: '#fff',
          // headerTitleStyle: {
          //   fontWeight: 'bold',
          // },
        }
      }
    />
  )
}

// import { Stack } from 'expo-router'

// export default function Layout() {
//   return (
//     <Stack initialRouteName='split' screenOptions={{ headerShown: false }}>
//       <Stack.Screen name='split' />
//       <Stack.Screen name='test' />
//     </Stack>
//   )
// }
