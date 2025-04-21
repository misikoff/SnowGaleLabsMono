'use client'

import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

type Workout = {
  name: string
  isRestDay: boolean
  color: string
}

const restDay: Workout = {
  name: 'Rest',
  isRestDay: true,
  color: '#ff0088',
}

const workouts: Workout[] = [
  {
    name: 'Push',
    isRestDay: false,
    color: '#dd00ee',
  },
  {
    name: 'Pull',
    isRestDay: false,
    color: '#9911ff',
  },
  {
    name: 'Legs',
    isRestDay: false,
    color: '#0d63f8',
  },
]
// TODO handle animation issue with gap
// gap causes the animation to be choppy as the element is added and removed
export default function Reordering({
  className,
  isActive,
}: {
  className?: string
  isActive?: boolean
}) {
  const [order, setOrder] = useState<Workout[]>(workouts)
  const orderRef = useRef<Workout[]>(workouts)

  useEffect(() => {
    orderRef.current = order
  }, [order])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const shuffleAndAnimate = () => {
      if (!isActive) {
        // if not active remove the rest days
        setOrder(workouts)
        return
      } // Stop the animation if not active

      const shuffledOrder = shuffle(orderRef.current)
      setOrder(shuffledOrder)
      orderRef.current = shuffledOrder // Update the ref to match the new state

      // Schedule the next shuffle
      if (isActive) {
        timeout = setTimeout(shuffleAndAnimate, 1000)
      }
    }

    shuffleAndAnimate()

    return () => clearTimeout(timeout) // Cleanup timeout on unmount or when isActive changes
  }, [isActive])

  return (
    <ul
      className={clsx(
        className,
        'flex w-full flex-row justify-center',
        // 'gap-2',
      )}
    >
      <AnimatePresence>
        {order.map((workout, i) => (
          // in order to avoid gap issue, issue on exit animation, use margins animate them
          <motion.li
            className={clsx(
              'flex h-8 w-1/5 items-center justify-center rounded-lg',
              // if not followed by a rest day, add a gap
              // i < order.length - 1 && !order[i + 1].isRestDay && 'mr-2',
              // if not preceded by a rest day, add a gap
              // i > 0 && !order[i - 1].isRestDay && 'ml-2',
            )}
            key={workout.name}
            layout
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            initial={{
              opacity: 0,
              y: -50,
              scale: 0.5,
              marginLeft: '0rem',
              marginRight: '0rem',
            }} // Entry animation
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              marginLeft: '0.25rem',
              marginRight: '0.25rem',
            }} // Animate to visible state
            exit={{
              opacity: 0,
              width: 0,
              marginLeft: '0rem',
              marginRight: '0rem',
            }} // Exit animation
            style={{ backgroundColor: workout.color }}
          >
            <span className='font-bold text-white'>{workout.name}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

/**
 * ==============   Utils   ================
 */
function shuffle([...array]: Workout[]) {
  const restDayIndex = array.findIndex((item) => item.isRestDay === true)

  if (restDayIndex !== -1) {
    // Remove the rest day if it exists
    array = array.filter((item) => !item.isRestDay)
  } else {
    // Add the rest day to a random position, including the end of the array
    const randomIndex = Math.floor(Math.random() * (array.length + 1)) // +1 to include the end
    array.splice(randomIndex, 0, restDay)
  }

  return array
}
