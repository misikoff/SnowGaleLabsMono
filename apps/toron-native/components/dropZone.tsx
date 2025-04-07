import { useEffect, useRef } from 'react'

import { Text, View } from 'react-native'
import Animated, {
  useAnimatedReaction,
  runOnJS,
  useSharedValue,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'

// import { dragPos, activeDropZoneId } from './shared'

export default function DropZone({
  zoneId,
  dragPos,
  activeDropZoneId,
  // onHoverChange,
  children,
}: {
  zoneId: string
  dragPos: SharedValue<{ x: number; y: number }>
  activeDropZoneId: SharedValue<string | null>
  // onHoverChange?: (isHovered: boolean) => void
  children: React.ReactNode
}) {
  const layout = useSharedValue({ x: 0, y: 0, width: 0, height: 0 })

  const isInside = (x, y) => {
    'worklet'
    const { x: lx, y: ly, width, height } = layout.value
    return x >= lx && x <= lx + width && y >= ly && y <= ly + height
  }

  const viewRef = useRef(null)

  useEffect(() => {
    // need to use setTimeout to wait for the view to be rendered
    // and then measure it
    setTimeout(() => {
      viewRef.current?.measureInWindow((x, y, width, height) => {
        layout.value = { x, y, width, height }
      })
    }, 100)
  }, [layout])

  useAnimatedReaction(
    () => dragPos.value,
    (pos) => {
      if (isInside(pos.x, pos.y)) {
        console.log('dragPos', pos, layout.value)
        console.log('inside', zoneId)
        if (activeDropZoneId.value !== zoneId) {
          activeDropZoneId.value = zoneId
          // onHoverChange  && runOnJS(onHoverChange)(true)
        }
      } else {
        // console.log('outside', zoneId)
        // console.log('dragPos', pos, layout.value)

        if (activeDropZoneId.value === zoneId) {
          activeDropZoneId.value = null
          //   onHoverChange && runOnJS(onHoverChange)(false)
        }
      }
    },
  )

  const animatedStyle = useAnimatedStyle(() => {
    const isActive = activeDropZoneId.value === zoneId
    return {
      backgroundColor: isActive
        ? 'rgba(0, 128, 255, 0.5)'
        : 'rgba(0, 255, 128, 0.5)',
      borderColor: isActive ? 'blue' : 'green',
      // borderWidth: isActive ? 2 : 1,
    }
  })

  return (
    <Animated.View ref={viewRef} className='bg-red-800' style={animatedStyle}>
      {children}
    </Animated.View>
  )
}
