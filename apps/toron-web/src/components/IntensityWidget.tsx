'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import clsx from 'clsx'
import { motion, AnimatePresence, useTime, useTransform } from 'framer-motion'

function DebugBlock({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const time = useTime()

  // Rotating animation: 0 -> 180 -> 0
  const rotate = useTransform(time, (t) => {
    const normalizedTime = (t / 3000) % 1 // Normalize time to a 0-1 range
    // return Math.sin(normalizedTime * Math.PI) * 360 // Sine wave for smooth back-and-forth motion
    // sine wave from 0 to 180 to 0
    return Math.sin(normalizedTime * Math.PI) * 180
  })

  const rotatingBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${(r + 270) % 360}deg, #bbdefb, #64b5f6)`
  })

  return (
    <motion.div
      className={className}
      style={{
        background: rotatingBg,
      }}
    />
  )
}

export default function IntensityWidget({
  className,
  isActive,
}: {
  className?: string
  isActive?: boolean
}) {
  const getTicks = useMemo(() => {
    const numTicks = 7 // Number of tick marks
    const radius = 4 // Radius of the semicircle in rem (adjust as needed)
    const size = 0.5
    const tickMarks = Array.from(
      {
        length:
          // numTicks
          // 5,
          6,
      },
      (_, i) => {
        const angle = (180 / (numTicks - 1)) * i // Angle for each tick mark
        const x = Math.cos((angle * Math.PI) / 180) * radius
        const y = Math.sin((angle * Math.PI) / 180) * radius

        return (
          <>
            <div
              key={i}
              className='absolute rounded-md bg-gray-400'
              style={{
                width: size + 'rem',
                height: size + 'rem',
                // rotate(${-angle - 90}deg)
                transform: `translate(${x + radius - size / 2}rem, ${-y + 2 * radius - size / 2}rem) `,
              }}
            >
              {/* {angle.toFixed(0)} */}
              {i < 3 && (
                <div className='relative'>
                  <span
                    className='absolute -top-2 left-2 w-8 font-mono'
                    style={{
                      // transform: `translate(30%, -50%)`,
                      fontSize: '0.5rem',
                      // color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {i - numTicks + 7} RIR
                  </span>
                </div>
              )}
            </div>

            {/* <span
              className='absolute'
              style={{
                transform: `translate(${x + radius}rem, ${y + 2 * radius * 0.9}rem) `,

                fontSize: '0.5rem',
                // color: 'white',
                fontWeight: 'bold',
              }}
            >
              {i - numTicks + 7}
            </span> */}
          </>
        )
      },
    )
    return tickMarks
  }, [])

  return (
    <div
      className={clsx(
        className,
        'relative flex w-full items-center justify-center',
      )}
    >
      <div className='h-16 w-32 rounded-t-full bg-blue-500' />

      <div className='absolute bottom-0 z-20 flex h-30 w-30 overflow-hidden'>
        <DebugBlock className='absolute bottom-0 h-full w-full translate-y-1/2 rounded-t-full' />
      </div>
      <div className='absolute bottom-0 h-32 w-32'>{getTicks}</div>
    </div>
  )
}
