import { useState } from 'react'

import { Button, Text, TextInput, View } from 'react-native'
import { Stack } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo'
import Spinner from 'react-native-loading-spinner-overlay'

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  // const [pendingVerification, setPendingVerification] = useState(false)
  // const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }
    setLoading(true)

    try {
      // Create the user on Clerk
      const signup = await signUp.create({
        emailAddress,
        password,
      })

      // TODO get email verification
      // Send verification Email
      // await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // change the UI to verify the email address
      // setPendingVerification(true)

      console.log({ signup })
      await setActive({ session: signup.createdSessionId })
    } catch (err: any) {
      console.log({ err })
      console.log({ x: err[0] })
      alert(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  // Verify the email address
  // const onPressVerify = async () => {
  //   if (!isLoaded) {
  //     return
  //   }
  //   setLoading(true)

  //   try {
  //     const completeSignUp = await signUp.attemptEmailAddressVerification({
  //       code,
  //     })

  //     await setActive({ session: completeSignUp.createdSessionId })
  //   } catch (err: any) {
  //     alert(err.errors[0].message)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <View className='flex-1 content-center p-5'>
      <Stack.Screen
      // options={{ headerBackVisible: !pendingVerification }}
      />
      {/* {loading && <Text>Loading...</Text>} */}
      <Spinner visible={loading} />

      <Text>{isLoaded}</Text>

      {/* {!pendingVerification && (
        <> */}
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

      <Button onPress={onSignUpPress} title='Sign up' color={'#6c47ff'} />
      {/* </>
      )} */}

      {/* {pendingVerification && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder='Code...'
              className='my-4 h-14 rounded-md border-2 border-purple-600 bg-white p-4'
              onChangeText={setCode}
            />
          </View>
          <Button
            onPress={onPressVerify}
            title='Verify Email'
            color={'#6c47ff'}
          />
        </>
      )} */}
    </View>
  )
}

export default Register
