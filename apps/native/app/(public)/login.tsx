import { View, Pressable, Text } from 'react-native'
import { Link } from 'expo-router'

import Auth from '@/components/auth'

const Login = () => {
  return (
    <View className='flex-1 content-center p-5'>
      <Auth />

      <Link href='/reset' asChild>
        <Pressable className='m-2 items-center'>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      {/* <Link href='/sign-up' asChild>
        <Pressable className='m-2 items-center'>
          <Text>Create Account</Text>
        </Pressable>
      </Link> */}
    </View>
  )
}

export default Login
