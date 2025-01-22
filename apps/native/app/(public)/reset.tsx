import { useEffect, useState } from 'react'

import { View, TextInput, Button } from 'react-native'
import { Stack } from 'expo-router'

import { supabase } from '@/utils/supabase'

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState('')

  useEffect(() => {
    /**
     * Step 2: Once the user is redirected back to your application,
     * ask the user to reset their password.
     */
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        const newPassword = prompt(
          'What would you like your new password to be?',
        )
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        })

        if (data) {
          alert('Password updated successfully!')
        }
        if (error) {
          alert('There was an error updating your password.')
        }
      }
    })
  }, [])

  // Request a password reset code by email
  const onRequestReset = async () => {
    const { data, error } =
      await supabase.auth.resetPasswordForEmail(emailAddress)
  }

  return (
    <View className='flex-1 content-center p-5'>
      <Stack.Screen />

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
    </View>
  )
}

export default PwReset
