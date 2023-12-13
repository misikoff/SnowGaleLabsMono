'use client'

import { use, useState } from 'react'
import { MouseEvent } from 'react'

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
  CircleDashed,
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
    left: 200,
    top: 100,
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
]

export default function Block({ className = '' }) {
  const [done, setDone] = useState(false)
  const [points, setPoints] = useState<Point[]>(basePoints)
  const [currentIndex, setCurrentIndex] = useState(1) // useState<Point>(points[1])
  const onClick = () => {
    setPoints(basePoints.map((point) => ({ ...point, done: false })))
    setCurrentIndex(0)
    setDone(false)

    const nextPoint = points[0]
    const ydiff = Math.abs(nextPoint.top - 0)
    const xdiff = Math.abs(nextPoint.left - 384 / 2)
    let nextDegrees = Math.atan2(ydiff, xdiff) * (180 / Math.PI)
    const dir = nextPoint.left - 384 / 2 > 0 ? 1 : -1
    degrees.set(135 + dir * (nextDegrees + 90))
  }
  // let mouseX = useMotionValue(0)
  // let mouseY = useMotionValue(0)

  let degrees = useMotionValue(0)

  // function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
  //   let { left, top } = currentTarget.getBoundingClientRect()
  //   console.log('mouse moved')
  //   mouseX.set((clientX - left) % 360)
  //   mouseY.set(clientY - top)
  //   console.log(mouseX.current)
  // }

  // function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
  //   console.log('mouse moved')
  //   mouseX.set((clientX - left) % 360)
  //   mouseY.set(clientY - top)
  //   console.log(mouseX.current)
  // }

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
      />
      <span className='z-10'> degrees:{degrees.current}</span> */}

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
            // background: useMotionTemplate`linear-gradient(${mouseX}deg, #000000 1%, #2989d8 50%, #207cca 51%, #000000 100%)`,
            // background: useMotionTemplate`linear-gradient(${mouseX}deg, rgba(0,0,0,0) 1%, rgba(0,0,130,0.8) 50%, rgba(0,0,0,0) 100%)`,

            // background: useMotionTemplate`
            // radial-gradient(
            //   circle farthest-corner at ${mouseX}px ${mouseY}px,
            //   rgba(255, 255, 233, 0.85),
            //   transparent 80%
            // )
            // `,

            background: 'radial-gradient(farthest-side at bottom, blue, #0000)',
            mask: useMotionTemplate`conic-gradient(from ${degrees}deg at bottom, #0000 0deg, #0008 45deg, #0000 90deg)`,
            // mask: useMotionTemplate`conic-gradient(from ${mouseX}deg at bottom, #0000, #000 181deg 180deg, #0000 271deg)`,

            // background: useMotionTemplate`
            // radial-gradient(
            //   farthest-side at top,
            //   rgba(255, 255, 233, 0.85),
            //   transparent 80%
            // )
            // `,
            // mask: useMotionTemplate`conic-gradient(from ${mouseX}deg at top,#0000, #000 1deg 90deg, #0000 91deg);`,
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
          transition={{ duration: 0.5 }}
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
                const ydiff = Math.abs(nextPoint.top - 0)
                const xdiff = Math.abs(nextPoint.left - 384 / 2)
                let nextDegrees = Math.atan2(ydiff, xdiff) * (180 / Math.PI)
                const dir = nextPoint.left - 384 / 2 > 0 ? 1 : -1

                animate(degrees, 135 + dir * (nextDegrees + 90), {
                  duration: 0.5,
                })
                // degrees.set(135 + dir * (nextDegrees + 90))
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
