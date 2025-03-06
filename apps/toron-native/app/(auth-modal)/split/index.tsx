import { View, Text } from 'react-native'
import { Stack } from 'expo-router'

const ModalScreen = () => {
  return (
    <View className='flex flex-1 items-center justify-center bg-white'>
      <Stack.Screen
        options={{
          title: 'New Split',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          // headerTitle: (props) => <LogoTitle {...props} />,
        }}
      />
      <Text className='text-lg text-black'>
        This is a basic split modal2 screen
      </Text>
    </View>
  )
}

export default ModalScreen
