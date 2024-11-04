import { useState } from 'react'

import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  // Alert,
} from 'react-native'
import { Link } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'
import Spinner from 'react-native-loading-spinner-overlay'

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) {
      return
    }
    setLoading(true)
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId })
    } catch (err: any) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='flex-1 content-center p-5'>
      <Spinner visible={loading} />

      <TextInput
        autoCapitalize='none'
        placeholder='example@domain.com'
        value={emailAddress}
        onChangeText={setEmailAddress}
        className='my-4 h-14 rounded-md border-2 border-purple-600 bg-white p-4'
      />
      <TextInput
        placeholder='password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className='my-4 h-14 rounded-md border-2 border-purple-600 bg-white p-4'
      />

      <Button onPress={onSignInPress} title='Login' color={'#6c47ff'} />

      <Link href='/reset' asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href='/register' asChild>
        <Pressable style={styles.button}>
          <Text>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    alignItems: 'center',
  },
})

export default Login
