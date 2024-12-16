import { useCallback, useRef, useMemo } from 'react'

import { Text, View, Button } from 'react-native'
import { useUser } from '@clerk/clerk-expo'
import { BottomSheetFlashList, BottomSheetModal } from '@gorhom/bottom-sheet'

// import Modal3D from '@/components/modal3d'

import { LogoutButton } from '../_layout'
export default function App() {
  const user = useUser()
  const userId = user.user!.id
  // const modalContent = <Text>Example content</Text>

  // hooks
  const sheetRef = useRef<BottomSheetModal>(null)

  // variables
  const data = useMemo(
    () =>
      Array(150)
        .fill(0)
        .map((_, index) => `index-${index}`),
    [],
  )

  const keyExtractor = (item: string) => item
  // render
  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View>
        <Text>{item}</Text>
      </View>
    ),
    [],
  )
  const snapPoints = useMemo(() => ['90%'], [])

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    sheetRef.current?.present()
  }, [])
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index)
  }, [])
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close()
  }, [])

  return (
    // <Modal3D modalContent={modalContent}>
    <View className='mt-12 flex-1 items-start gap-5 p-5'>
      <View className='items-start gap-2 rounded-md bg-gray-300 p-4'>
        <Text className='text-center text-sm font-extrabold'>ID: {userId}</Text>
        <Text className='text-center text-sm font-extrabold'>
          Email: {user.user!.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <View className='flex-row items-center gap-3 rounded-md bg-red-200 px-4 py-2'>
        <Text className='text-lg font-bold'>Log Out</Text>
        <LogoutButton />
      </View>
      <Button title='Snap To 90%' onPress={() => handleSnapPress(2)} />
      <Button title='Snap To 50%' onPress={() => handleSnapPress(1)} />
      <Button title='Snap To 25%' onPress={() => handleSnapPress(0)} />
      <Button title='Close' onPress={() => handleClosePress()} />

      <Button
        onPress={handlePresentModalPress}
        title='Present Modal'
        color='black'
      />
      <BottomSheetModal
        ref={sheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <View className='h-full w-full'>
          <Text>Awesome jkjhkjh</Text>

          <BottomSheetFlashList
            className='h-full w-full'
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={43.3}
          />
        </View>
      </BottomSheetModal>
    </View>
    // </Modal3D>
  )
}
