import { useState } from 'react'

import { View, StyleSheet, TextInput, Button } from 'react-native'
import { Stack } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const { signIn, setActive } = useSignIn()

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      })
      setSuccessfulCreation(true)
    } catch (err: any) {
      alert(err.errors[0].message)
    }
  }

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      console.log(result)
      alert('Password reset successfully')

      // Set the user session active, which will log in the user automatically
      await setActive({ session: result.createdSessionId })
    } catch (err: any) {
      alert(err.errors[0].message)
    }
  }

  return (
    <View className='flex-1 content-center p-5'>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {!successfulCreation && (
        <>
          <TextInput
            autoCapitalize='none'
            placeholder='example@domain.com'
            value={emailAddress}
            onChangeText={setEmailAddress}
            className='my-4 h-14 rounded-md border-2 border-purple-600 bg-white p-4'
          />

          <Button
            onPress={onRequestReset}
            title='Send Reset Email'
            color={'#6c47ff'}
          />
        </>
      )}

      {successfulCreation && (
        <>
          <View className='flex-1 content-center p-5'>
            <TextInput
              value={code}
              placeholder='Code...'
              className='my-4 h-14 rounded-md border-2 border-purple-600 bg-white p-4'
              onChangeText={setCode}
            />
            <TextInput
              placeholder='New password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className='my-4 h-14 rounded-md border-2 border-purple-600 bg-white p-4'
            />
          </View>
          <Button
            onPress={onReset}
            title='Set new Password'
            color={'#6c47ff'}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    alignItems: 'center',
  },
})

export default PwReset
