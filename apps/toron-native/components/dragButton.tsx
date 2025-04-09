import { useCallback, useEffect, useRef } from 'react'

import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export default function DragButton({
  dragPos,
  activeDropZoneId,
  // onDrag,
  onDrop,
  showPhantom = false,
  children,
}: {
  dragPos: SharedValue<{ x: number; y: number }>
  activeDropZoneId?: SharedValue<string | null> | null
  // onDrag: () => void
  onDrop: (x: number, y: number) => void
  showPhantom?: boolean
  children: React.ReactNode
}) {
  const pressed = useSharedValue<boolean>(false)
  const offsetX = useSharedValue<number>(0)
  const offsetY = useSharedValue<number>(0)
  const globalX = useSharedValue<number>(0)
  const globalY = useSharedValue<number>(0)

  const buttonRef = useRef<View>(null)

  // Function to measure the global position of the button
  const measurePosition = useCallback(() => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      globalX.value = x + width / 2 // Center X
      globalY.value = y + height / 2 // Center Y
    })
  }, [globalX, globalY])

  // Use requestAnimationFrame to continuously monitor the position
  useEffect(() => {
    let isMounted = true

    const updatePosition = () => {
      if (isMounted) {
        measurePosition()
        requestAnimationFrame(updatePosition) // Schedule the next frame
      }
    }

    updatePosition() // Start monitoring

    return () => {
      isMounted = false // Stop monitoring on unmount
    }
  }, [measurePosition])

  const pan = Gesture.Pan()
    .onBegin(() => {
      // activeDropZoneId.value = null
      pressed.value = true
      // TODO: get the center of the button instead of the center of the touch
      // runOnJS(onDrag)()
    })
    .onChange((event) => {
      offsetX.value = event.translationX
      offsetY.value = event.translationY
      dragPos.value = {
        x: globalX.value + offsetX.value,
        y: globalY.value + offsetY.value,
      }
    })
    .onFinalize(() => {
      pressed.value = false

      const finalX = globalX.value + offsetX.value
      const finalY = globalY.value + offsetY.value

      runOnJS(onDrop)(finalX, finalY)

      dragPos.value = { x: finalX, y: finalY }

      if (activeDropZoneId?.value) {
        offsetX.value = 0
        offsetY.value = 0
      } else {
        // Spring back if not inside a drop zone
        offsetX.value = withSpring(0)
        offsetY.value = withSpring(0)
      }
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: withTiming(pressed.value ? 1.2 : 1) },
    ],
    opacity: pressed.value ? 0.8 : 1,
  }))

  const phantomStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 1 : 0.9) }],
  }))

  return (
    <View className='relative flex-row items-center justify-center'>
      {/* Phantom Button */}
      {showPhantom && (
        <Animated.View
          style={phantomStyles}
          className='absolute items-center justify-center'
        >
          {children}
        </Animated.View>
      )}

      {/* Draggable Button */}
      <GestureDetector gesture={pan}>
        <Animated.View
          ref={buttonRef}
          style={[animatedStyles]}
          className='z-50'
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
