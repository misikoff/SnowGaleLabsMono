import React, { useState } from 'react'

import { Button, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

export default function Modal3D({
  children,
  modalContent,
}: {
  children: React.ReactNode
  modalContent: React.ReactNode
}) {
  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value }, // Zoom out effect
      { translateY: translateY.value }, // Pan away effect
      // opacity
    ],
    opacity: opacity.value,
  }))

  const [isModalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
    if (isModalVisible) {
      reverseAnimation()
    } else {
      triggerAnimation()
    }
  }

  const scaleVar = 0.8
  const translateYVar = 50
  const opacityVar = 0.2
  const triggerAnimation = () => {
    // Animate to zoom out and pan away
    scale.value = withTiming(scaleVar, { duration: 500 }) // Scale down to 90%
    translateY.value = withTiming(translateYVar, { duration: 500 }) // Move down slightly
    // change opacity
    opacity.value = withTiming(opacityVar, { duration: 500 })
  }

  const reverseAnimation = () => {
    // Animate to zoom in and pan back
    scale.value = withTiming(1, { duration: 500 }) // Scale back to 100%
    translateY.value = withTiming(0, { duration: 500 }) // Move back to original position
    // change opacity
    opacity.value = withTiming(1, { duration: 500 })
  }

  const dynamicAnimation = (proportion: number) => {
    scale.value = withTiming(1 - proportion * (1 - scaleVar), {
      duration: 0,
    })
    translateY.value = withTiming(
      translateYVar - (1 - proportion) * translateYVar,
      {
        duration: 0,
      },
    )
    // change opacity
    opacity.value = withTiming(1 - proportion * (1 - opacityVar), {
      duration: 0,
    })
  }

  return (
    <>
      <Animated.View
        className='flex-1 items-center justify-center rounded-lg bg-gray-300'
        style={animatedStyle}
      >
        {children}
        <Button title='Show modal' onPress={toggleModal} />
      </Animated.View>
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => {
          console.log('swipe complete')
          setModalVisible(false)
          reverseAnimation()
        }}
        swipeDirection='down'
        hasBackdrop={false}
        onSwipeMove={(proportion) => {
          console.log(proportion)
          console.log('swipe')
          dynamicAnimation(proportion)
        }}
      >
        <View className='-mx-6 -mb-8 mt-32 flex-1 rounded-lg bg-blue-400'>
          <TouchableOpacity onPress={toggleModal}>
            <View className='m-4 rounded-lg p-4'>
              <Text className='text-xl text-white'>{'<'} Back</Text>
            </View>
          </TouchableOpacity>
          <View className='items-center'>{modalContent}</View>
          <TouchableOpacity onPress={toggleModal}>
            <Text className='mx-auto text-xl text-white'>Hide me!</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}
