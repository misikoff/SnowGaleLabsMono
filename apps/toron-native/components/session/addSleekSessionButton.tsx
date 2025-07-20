import React from 'react'

import { Pressable } from 'react-native'
import * as Crypto from 'expo-crypto'

import { useCreateSleekSessionMutation } from '@/lib/mutations/sessionMutations'

interface AddSleekSessionButtonProps {
  children: React.ReactNode
  date: string
  onCreate?: (sessionId: string, isSleek?: boolean) => void
}

export default function AddSleekSessionButton({
  children,
  date,
  onCreate,
}: AddSleekSessionButtonProps) {
  const createSleekSessionMutation = useCreateSleekSessionMutation()

  const handlePress = async () => {
    const sessionId = Crypto.randomUUID()

    try {
      await createSleekSessionMutation.mutateAsync({
        id: sessionId,
        name: 'Sleek Session',
        date,
      })

      if (onCreate) {
        onCreate(sessionId, true)
      }
    } catch (error) {
      console.error('Error creating sleek session:', error)
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={createSleekSessionMutation.isPending}
    >
      {children}
    </Pressable>
  )
}
