import { useEffect, useRef } from 'react'

import { View } from 'react-native'
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'

export default function DropZone({
  className,
  children,
  zoneId,
  dragPos,
  activeDropZoneId,
}: {
  className?: string
  children: React.ReactNode
  zoneId: string
  dragPos: SharedValue<{ x: number; y: number }>
  activeDropZoneId: SharedValue<string | null>
}) {
  const layout = useSharedValue({ x: 0, y: 0, width: 0, height: 0 })
  const viewRef = useRef<View>(null)

  const isInside = (x: number, y: number) => {
    'worklet'
    const { x: lx, y: ly, width, height } = layout.value
    return x >= lx && x <= lx + width && y >= ly && y <= ly + height
  }

  // Use requestAnimationFrame to continuously measure the position of the view
  useEffect(() => {
    let isMounted = true

    const measure = () => {
      if (!isMounted) {
        return
      }
      viewRef.current?.measureInWindow((x, y, width, height) => {
        layout.value = { x, y, width, height }
      })
      requestAnimationFrame(measure) // Schedule the next frame
    }

    measure() // Start measuring

    return () => {
      isMounted = false // Cleanup on unmount
    }
  }, [layout])

  useAnimatedReaction(
    () => dragPos.value,
    (pos) => {
      if (isInside(pos.x, pos.y)) {
        if (activeDropZoneId.value !== zoneId) {
          activeDropZoneId.value = zoneId
        }
      } else {
        if (activeDropZoneId.value === zoneId) {
          activeDropZoneId.value = null
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
    }
  })

  return (
    <Animated.View ref={viewRef} style={animatedStyle} className={className}>
      {children}
    </Animated.View>
  )
}
