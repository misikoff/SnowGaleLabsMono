import { StyleSheet, Pressable, View } from 'react-native'

import { SetGroupWithExerciseAndSets } from '@repo/db/schema'
// import { useUpdateSetGroupMutation } from '@/lib/mutations/setGroupMutations'

export default function ReorderExerciseButton({
  setGroup,
  direction = 'up',
  children,
}: {
  setGroup: SetGroupWithExerciseAndSets
  direction: 'up' | 'down'
  children: React.ReactNode
}) {
  // const updateSetGroupMutation = useUpdateSetGroupMutation(
  //   setGroup.sessionId || '',
  // )

  return (
    <View className='mt-12 items-center justify-center'>
      <Pressable
        style={styles.button}
        onPress={() => {
          console.log('pressed')
        }}
      >
        {children}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    elevation: 2,
  },
})
