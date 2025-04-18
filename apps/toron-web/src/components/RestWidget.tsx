'use client'

import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

const restDay = {
  name: 'Rest',
  isRestDay: true,
  color: '#ff0088',
}

const workouts = [
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

export default function Reordering({
  className,
  isActive,
}: {
  className?: string
  isActive?: boolean
}) {
  const [order, setOrder] = useState(workouts)
  const orderRef = useRef(workouts)

  useEffect(() => {
    orderRef.current = order
  }, [order])

  useEffect(() => {
    const timeout = setTimeout(() => setOrder(shuffle(orderRef.current)), 1000)
    return () => clearTimeout(timeout)
  }, [order])

  if (!isActive) {
    return null
  }

  return (
    <ul
      // style={container}
      className={clsx(
        className,
        'flex h-full w-full flex-row justify-center gap-2',
      )}
    >
      <AnimatePresence>
        {order.map((workout) => (
          <motion.li
            className='flex h-8 w-1/5 items-center justify-center'
            key={workout.name}
            layout
            transition={spring}
            initial={{ opacity: 0, y: -50, scale: 0.5 }} // Entry animation
            animate={{ opacity: 1, y: 0, scale: 1 }} // Animate to visible state
            exit={{ opacity: 0, width: 0 }} // Exit animation
            style={{ ...item, backgroundColor: workout.color }}
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
function shuffle([...array]: string[]) {
  console.log('array', array)
  const restDayIndex = array.findIndex((item) => {
    console.log({ item })
    return item.isRestDay === true
  })
  console.log('restDayIndex', restDayIndex)

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

/**
 * ==============   Styles   ================
 */

const spring = {
  type: 'spring',
  damping: 20,
  stiffness: 300,
}

const container: React.CSSProperties = {
  // listStyle: 'none',
  // padding: 0,
  // margin: 0,
  // position: 'relative',
  // flexDirection: 'row',
  // justifyContent: 'center',
  // alignItems: 'center',
}

const item: React.CSSProperties = {
  borderRadius: '10px',
}
