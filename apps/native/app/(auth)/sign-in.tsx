import { useCallback, useState } from 'react'

import { Text, TextInput, Button, View } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  // TODO: on sign out invalidate cache, or add user id to query keys
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, signIn, emailAddress, password, setActive, router])

  return (
    <View>
      <TextInput
        autoCapitalize='none'
        value={emailAddress}
        placeholder='Email...'
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder='Password...'
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title='Sign In' onPress={onSignInPress} />
      <View>
        <Text>Don't have an account?</Text>
        <Link href='/sign-up'>
          <Text>Sign up</Text>
        </Link>

        <Link href='/'>
          <Text>Home</Text>
        </Link>
      </View>
    </View>
  )
}
