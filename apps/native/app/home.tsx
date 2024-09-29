import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import TestComponent from '@/components/test'
import { supabase } from '@/utils/supabase'

export default function App() {
  const {
    data: exercises,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .limit(10)
      if (error) {
        console.error('Error fetching exercises:', error)
        return []
      }
      console.log({ data, test: 'test' })
      return data as { id: string; name: string }[]
    },
  })

  return (
    <View className='w-full flex-1'>
      <Text>Home123</Text>
      <Link href='/'>/</Link>
      <TestComponent name='Home3' />
      {/* button to call function x */}

      {/* show all exercises */}
      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error</Text>}
      {exercises?.map((exercise) => (
        <View key={exercise.id}>
          <Text>{exercise.name}</Text>
        </View>
      ))}
    </View>
  )
}
