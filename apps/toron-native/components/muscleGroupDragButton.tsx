import { useEffect, useRef } from 'react'

import { Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { MuscleGroup } from '@repo/toron-db/schema'

function getButton(group: MuscleGroup) {
  return (
    <Text className='rounded-lg bg-blue-400 px-3 py-1 text-center font-bold text-white'>
      {group.name}
    </Text>
  )
}

export default function MuscleGroupDragButton({
  group,
  dragPos,
  onDrag,
  onDrop,
}: {
  group: MuscleGroup
  dragPos: SharedValue<{ x: number; y: number }>
  onDrag: () => void
  onDrop: (group: MuscleGroup, x: number, y: number) => void
}) {
  const pressed = useSharedValue<boolean>(false)
  const offsetX = useSharedValue<number>(0)
  const offsetY = useSharedValue<number>(0)
  const globalX = useSharedValue<number>(0)
  const globalY = useSharedValue<number>(0)

  const pan = Gesture.Pan()
    .onBegin((event) => {
      pressed.value = true
      // TODO: get the center of the button instead of the center of the touch
      globalX.value = event.absoluteX
      globalY.value = event.absoluteY
      runOnJS(onDrag)()
    })
    .onChange((event) => {
      // console.log('onChange', event)
      offsetX.value = event.translationX
      offsetY.value = event.translationY
      dragPos.value = {
        x: globalX.value + offsetX.value,
        y: globalY.value + offsetY.value,
      }
    })
    .onFinalize(() => {
      pressed.value = false

      offsetX.value = withSpring(0)
      offsetY.value = withSpring(0)

      // console.log('finalX', globalX.value + offsetX.value)
      // console.log('finalY', globalY.value + offsetY.value)
      runOnJS(onDrop)(group, globalX.value + offsetX.value, globalY.value)
      dragPos.value = {
        x: globalX.value + offsetX.value,
        y: globalY.value + offsetY.value,
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
    // opacity: pressed.value ? 1 : 0,
    transform: [{ scale: withTiming(pressed.value ? 1 : 0.9) }],
  }))

  return (
    <View className='relative flex-row items-center justify-center'>
      {/* Phantom Button */}
      <Animated.View
        style={phantomStyles}
        className='absolute items-center justify-center'
      >
        {getButton(group)}
      </Animated.View>

      {/* Draggable Button */}
      <GestureDetector key={group.id} gesture={pan}>
        <Animated.View style={[animatedStyles]} className='z-50'>
          {getButton(group)}
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
