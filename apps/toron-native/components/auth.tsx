import { useState } from 'react'

import { Alert, View, TextInput, Button, Text } from 'react-native'

import { supabase } from '@/utils/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    console.log('signInWithEmail', { email, password })
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('done')

    if (error) {
      console.log({ error })
      Alert.alert(error.message)
    }
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
    }
    if (!session) {
      Alert.alert('Please check your inbox for email verification!')
    }
    setLoading(false)
  }

  async function signInAsDefaultUser() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: 'tmisikoff+blue1@gmail.com',
      password: '123123',
    })

    console.log('done')

    if (error) {
      console.log({ error })
      Alert.alert(error.message)
    }
    setLoading(false)
  }

  return (
    <View className='mt-10 p-3'>
      <View className='mt-20 self-stretch py-1'>
        <Text>Email</Text>
        <TextInput
          // label='Email'
          // leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='email@address.com'
          autoCapitalize={'none'}
        />
      </View>
      <View className='self-stretch py-1'>
        <Text>Password</Text>
        <TextInput
          // label='Password'
          // leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder='Password'
          autoCapitalize={'none'}
        />
      </View>
      <View className='mt-20 self-stretch py-1'>
        <Button
          title='Sign in'
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View className='self-stretch py-1'>
        <Button
          title='Sign up'
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
      <View className='mt-2 self-stretch py-1'>
        <Button
          title='Sign in as default user'
          disabled={loading}
          onPress={() => signInAsDefaultUser()}
        />
      </View>
    </View>
  )
}
