'use client'

import { useState } from 'react'

import clsx from 'clsx'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion'
import {
  BirdIcon,
  CarIcon,
  CrosshairIcon,
  LucideIcon,
  TruckIcon,
  XIcon,
} from 'lucide-react'

type Point = {
  icon: LucideIcon
  left: number
  top: number
  done: boolean
  doneClasses: string
}

const basePoints: Point[] = [
  {
    icon: XIcon,
    left: 20,
    top: 20,
    done: false,
    doneClasses: 'text-blue-600',
  },
  {
    icon: CarIcon,
    left: 90,
    top: 120,
    done: false,
    doneClasses: 'text-gray-600',
  },
  {
    icon: TruckIcon,
    left: 80,
    top: 300,
    done: false,
    doneClasses: 'text-blue-600',
  },
  {
    icon: BirdIcon,
    left: 360,
    top: 50,
    done: false,
    doneClasses: 'text-red-600',
  },
  {
    icon: BirdIcon,
    left: 200,
    top: 100,
    done: false,
    doneClasses: 'text-red-600',
  },
  {
    icon: BirdIcon,
    left: 50,
    top: 360,
    done: false,
    doneClasses: 'text-red-600',
  },
  {
    icon: BirdIcon,
    left: 192,
    top: 192,
    done: false,
    doneClasses: 'text-red-600',
  },
  {
    icon: BirdIcon,
    left: 360,
    top: 360,
    done: false,
    doneClasses: 'text-red-600',
  },
]

export default function Block({ className = '' }) {
  const [done, setDone] = useState(false)
  const [points, setPoints] = useState<Point[]>(basePoints)
  const [currentIndex, setCurrentIndex] = useState(1) // useState<Point>(points[1])
  const [delay, setDelay] = useState(0)

  const onClick = () => {
    setPoints(basePoints.map((point) => ({ ...point, done: false })))
    setCurrentIndex(0)
    setDone(false)

    const nextPoint = points[0]
    setDegrees(nextPoint)
  }

  const setDegrees = (point: Point) => {
    const ydiff = Math.abs(point.top - 0)
    const xdiff = Math.abs(point.left - 384 / 2)
    let nextDegrees = Math.atan2(ydiff, xdiff) * (180 / Math.PI)
    const dir = point.left - 384 / 2 > 0 ? 1 : -1
    let time = 0
    let res = 0
    if (dir < 1) {
      res = 45 - nextDegrees
    } else {
      res = nextDegrees - 135
    }

    // 1 rev per second
    time = 3 * (Math.abs(degrees.current - res) / 360)
    console.log({ time })
    animate(degrees, res, {
      duration: time,
    })
    console.log('current', degrees.current)
    console.log('nextDegrees', res)

    setDelay(time)
  }

  let degrees = useMotionValue(0)

  return (
    <div className='flex mt-96 flex-col justify-center items-center mx-auto'>
      {/* make range input from 0 to 360 */}
      {/* <input
        className='z-10'
        type='range'
        min='0'
        max='270'
        // value={degrees.current}
        onChange={(e) => {
          degrees.set(-Number(e.target.value) + 90)
          console.log(e.target.value)
        }}
      /> */}
      {/* <span className='z-10'> degrees:{degrees.current}</span> */}

      <button className='p-8 bg-blue-400 w-24 text-white' onClick={onClick}>
        click me
      </button>
      <div
        className={clsx(
          className,
          'bg-gray-400 group w-96 h-96 relative overflow-hidden',
        )}
        // onMouseMove={handleMouseMove}
      >
        {/* <div className='h-[200%] w-[200%] absolute bg-gray-200 rounded-full -translate-y-1/2 -translate-x-1/4' /> */}
        {/* <div className='h-[150%] w-[150%] absolute bg-blue-600 rounded-full -translate-y-1/2 -translate-x-[17%]' /> */}

        <div className='h-full w-full absolute opacity-50 bg-gray-500 rounded-full -translate-y-1/2 scale-[200%]' />
        <div className='h-full w-full absolute opacity-50 bg-gray-400 rounded-full -translate-y-1/2 scale-[175%]' />
        <div className='h-full w-full absolute opacity-50 bg-gray-300 rounded-full -translate-y-1/2 scale-150' />
        <div className='h-full w-full absolute opacity-50 bg-gray-200 rounded-full -translate-y-1/2 scale-125' />
        <div className='h-full w-full absolute opacity-50 bg-gray-100 rounded-full -translate-y-1/2' />

        <motion.div
          className='pointer-events-none absolute -inset-px rotate-[180deg] rounded-xl x:opacity-0 transition duration-300 translate-y-1/2 group-hover:opacity-100 scale-[200%]'
          style={{
            background: 'radial-gradient(farthest-side at bottom, blue, #0000)',
            mask: useMotionTemplate`conic-gradient(from ${degrees}deg at bottom, #0000 0deg, #0004 45deg, #0000 90deg)`,
          }}
        />

        {/* points */}
        {points.map((point, index) => (
          <div
            className='absolute block -translate-x-1/2 -translate-y-1/2'
            key={`point-${index}`}
            style={{ left: `${point.left}px`, top: `${point.top}px` }}
          >
            <point.icon
              className={clsx(
                'h-4 w-4 transform duration-1000',
                point.done && point.doneClasses,
              )}
            />
          </div>
        ))}

        {/* cursor */}
        <motion.div
          initial={{ left: `${points[0].left}px`, top: `${points[0].top}px` }}
          animate={{
            left: `${points[currentIndex].left}px`,
            top: `${points[currentIndex].top}px`,
          }}
          transition={{ duration: delay }}
          className='absolute -translate-x-1/2 -translate-y-1/2'
          onAnimationComplete={() => {
            console.log('animation completed')
            setPoints(
              points.map((point, index) => {
                if (index === currentIndex) {
                  return { ...point, done: true }
                } else {
                  return point
                }
              }),
            )
            setTimeout(() => {
              if (currentIndex < points.length - 1) {
                setCurrentIndex(currentIndex + 1)
                const nextPoint = points[currentIndex + 1]
                setDegrees(nextPoint)
              } else {
                setDone(true)
              }
            }, 700)
          }}
        >
          <CrosshairIcon
            className={clsx(
              'hover:rotate-90 h-12 w-12 transform duration-700 hover:scale-150',
              done && 'rotate-90 scale-75',
            )}
          />
        </motion.div>
      </div>
    </div>
  )
}
