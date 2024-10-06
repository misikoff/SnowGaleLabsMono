import { useState } from 'react'

import { TextInput, Button, View, Text } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useClerk, useSignUp } from '@clerk/clerk-expo'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        // TODO: create user in supabase with clerkId
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View>
      <Text>pendingVerification: {pendingVerification}</Text>
      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize='none'
            value={emailAddress}
            placeholder='Email...'
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            value={password}
            placeholder='Password...'
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button title='Sign Up123' onPress={onSignUpPress} />
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput
            value={code}
            placeholder='Code...'
            onChangeText={(code) => setCode(code)}
          />
          <Button title='Verify Email' onPress={onPressVerify} />
        </>
      )}

      <Link href='/'>
        <Text>Home</Text>
      </Link>
    </View>
  )
}
