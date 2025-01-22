import { Stack } from 'expo-router'

const PublicLayout = () => {
  return (
    <Stack
      screenOptions={{
        // headerStyle: {
        //   backgroundColor: '#6c47ff',
        // },
        // headerTintColor: '#fff',
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name='login'
        options={{
          headerTitle: 'Log In',
        }}
      />
      <Stack.Screen
        name='reset'
        options={{
          headerTitle: 'Reset Password',
        }}
      />
    </Stack>
  )
}

export default PublicLayout
