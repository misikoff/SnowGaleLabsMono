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

export default function RestWidget({
  className,
  isActive,
}: {
  className?: string
  isActive?: boolean
}) {
  const [order, setOrder] = useState<Workout[]>(workouts)
  const orderRef = useRef<Workout[]>(workouts)
  const lastRestDayIndexRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    orderRef.current = order
  }, [order])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const shuffleAndAnimate = () => {
      if (!isActive) {
        setOrder(workouts)
        lastRestDayIndexRef.current = undefined
        return
      }

      const { array: shuffledOrder, restDayIndex } = shuffle(
        orderRef.current,
        lastRestDayIndexRef.current,
      )
      setOrder(shuffledOrder)
      orderRef.current = shuffledOrder
      lastRestDayIndexRef.current = restDayIndex

      if (isActive) {
        timeout = setTimeout(shuffleAndAnimate, 1000)
      }
    }

    shuffleAndAnimate()

    return () => clearTimeout(timeout)
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
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              marginLeft: '0.25rem',
              marginRight: '0.25rem',
            }}
            exit={{
              opacity: 0,
              width: 0,
              marginLeft: '0rem',
              marginRight: '0rem',
            }}
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
function shuffle([...array]: Workout[], lastRestDayIndex?: number) {
  const restDayIndex = array.findIndex((item) => item.isRestDay === true)

  if (restDayIndex !== -1) {
    // Remove the rest day if it exists
    array = array.filter((item) => !item.isRestDay)
  }

  // Add the rest day to a random position, not the same as the last one
  let randomIndex: number
  do {
    randomIndex = Math.floor(Math.random() * (array.length + 1))
  } while (
    typeof lastRestDayIndex === 'number' &&
    array.length > 0 &&
    randomIndex === lastRestDayIndex
  )
  array.splice(randomIndex, 0, restDay)

  return { array, restDayIndex: randomIndex }
}
