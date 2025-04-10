import { useState } from 'react'

import { Alert, View, AppState, TextInput, Button, Text } from 'react-native'

import { getSupabase } from '@/utils/supabase'
const supabase = getSupabase()

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    // setLoading(true)
    console.log('signInWithEmail', { email, password })
    // const session = (await supabase.auth.getSession()) || { blah: 'blah' }
    // console.log('session', session)
    const { error } = await supabase.auth.signInWithPassword({
      email: 'tmisikoff+blue1@gmail.com', // email,
      password: '123123', //password,
    })

    console.log('done')

    if (error) {
      console.log({ error })
      Alert.alert(error.message)
    }
    // setLoading(false)
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

  return (
    <View className='mt-10 p-3'>
      <View className='mt-20 self-stretch py-1'>
        <Text>Email</Text>
        {/* <TextInput
          // label='Email'
          // leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='email@address.com'
          autoCapitalize={'none'}
        /> */}
      </View>
      <View className='self-stretch py-1'>
        <Text>Password</Text>
        {/* <TextInput
          // label='Password'
          // leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder='Password'
          autoCapitalize={'none'}
        /> */}
      </View>
      <View className='mt-20 self-stretch py-1'>
        <Button
          title='Sign in as tmisikoff+blue1@gmail.com'
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
    </View>
  )
}
