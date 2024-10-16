import { View, Text, Pressable } from 'react-native'
import * as Crypto from 'expo-crypto'
import { Link, router } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'

import { Session } from '@repo/db/schema'
import { createSession, deleteSession, getSessions } from '@/lib/dbFunctions'

export default function App() {
  const user = useUser()
  const userId = user.user!.id
  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => getSessions({ userId }),
  })

  const queryClient = useQueryClient()
  const createSessionMutation = useMutation({
    mutationFn: ({
      id,
      createdAt,
      updatedAt,
      userId,
    }: Parameters<typeof createSession>[0]) =>
      createSession({
        id,
        createdAt,
        updatedAt,
        userId,
      }),
    onMutate: async ({ id, createdAt, updatedAt }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData(['sessions'])

      const nextSessions = produce(previousSessions, (draft: Session[]) => {
        draft.push({ id, createdAt, updatedAt } as Session)
      })
      // console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session created')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  const deleteSessionMutation = useMutation({
    mutationFn: (id: Session['id']) => deleteSession(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sessions'],
      })

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData([
        'sessions',
      ]) as Session[]

      const nextSessions = previousSessions.filter((s) => {
        console.log({ a: id, b: s.id, res: s.id !== id })
        return s.id !== id
      })

      console.log({ nextSessions })
      // Optimistically update to the new value
      queryClient.setQueryData(['sessions'], nextSessions)

      // Return a context object with the snapshotted value
      return { previousSessions }
    },
    onSuccess: () => {
      console.log('session deleted')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  return (
    <View className='w-full flex-1'>
      <Text>Sessions</Text>
      <Link href='/'>/</Link>
      <Pressable
        onPress={async () => {
          console.log('create session')
          const newSessionId = Crypto.randomUUID()
          createSessionMutation
            .mutateAsync({
              id: newSessionId,
              createdAt: new Date(),
              updatedAt: new Date(),
              userId,
            })
            .then(() => {
              router.navigate(`/app/session/${newSessionId}`)
            })
        }}
      >
        <Text>New Session</Text>
      </Pressable>

      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}

      {sessions?.map((session) => (
        <View key={session.id} className='flex-row gap-4'>
          <Link href={`/app/session/${session.id}`}>{session.id}</Link>
          <Pressable
            onPress={async () => {
              console.log('delete session')
              deleteSessionMutation.mutateAsync(session.id)
            }}
          >
            <Text className='bg-red-500'>Delete</Text>
          </Pressable>
        </View>
      ))}
    </View>
  )
}
