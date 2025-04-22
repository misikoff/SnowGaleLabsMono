'use client'

import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'
import {
  motion,
  AnimatePresence,
  useTime,
  useTransform,
  useSpring,
} from 'framer-motion'
import { Cloud, X } from 'lucide-react'

type Set = {
  id: number
  weight: number
  reps: number
  rir: number
  synced?: boolean
}

function padTo(num: number, size: number): string {
  const str = num.toString()
  if (str.length >= size) {
    return str // If the number is already long enough, return it as is
  }
  const pad = ' '.repeat(size - str.length) // Calculate the padding
  return pad + str // Add padding to the left
}

function DebugBlock({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const time = useTime()

  // Rotating animation
  // TODO: make this loop around instead of going to inf
  const rotate = useTransform(time, [0, 3000], [0, 360], {
    clamp: false,
  })
  // const rotatingBg = useTransform(rotate, (r) => {
  //   return `conic-gradient(from ${r}deg, #ff4545, #00ff99, #006aff, #ff0095, #ff4545)`
  // })
  // #6461ff
  const rotatingBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r % 360}deg, #64b5f6, #bbdefb, #64b5f6, #bbdefb, #64b5f6)`
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

function SetRow({
  className,
  set,
  isSynced,
}: {
  className?: string
  set: { id: number; weight: number; reps: number; rir: number }
  isSynced?: boolean
}) {
  const time = useTime()

  // Rotating animation
  const rotate = useTransform(time, [0, 3000], [0, 360], {
    clamp: false,
  })
  const rotatingBg = useTransform(rotate, (r) => {
    // return `conic-gradient(from ${r}deg, #ff4545, #00ff99, #006aff, #ff0095, #ff4545)`
    return `conic-gradient(from ${r % 360}deg, #0d47a1, #bbdefb, #0d47a1, #bbdefb, #0d47a1)`
  })

  return (
    <motion.li
      className={clsx(className, 'relative w-full')}
      layout
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      initial={{ opacity: 0, x: -50 }} // Entry animation
      animate={{ opacity: 1, x: 0 }} // Animate to visible state
      exit={{ opacity: 0, x: -50 }} // Exit animation
    >
      <div className='relative z-20 flex h-8 w-full items-center justify-between overflow-hidden rounded-lg bg-gray-700 py-4'>
        <span className='font-bold text-white'>
          <pre>
            {padTo(set.weight, 3)}# x {padTo(set.reps, 2)} @ {set.rir} RIR
          </pre>
        </span>
        <AnimatePresence>
          {!isSynced && (
            <motion.div
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 300,
              }}
              // initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className='flex h-8 items-center rounded-tr-lg rounded-br-lg bg-gray-200 px-2'
            >
              <Cloud className='animate-pulse' />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!isSynced && (
        <motion.div
          className='absolute -inset-[1px] rounded-lg'
          style={{
            background: rotatingBg,
          }}
        />
      )}
    </motion.li>
  )
}

export default function OfflineWidget({
  className,
  isActive,
}: {
  className?: string
  isActive?: boolean
}) {
  const [isOffline, setIsOffline] = useState(true)
  const isOfflineRef = useRef(isOffline)
  const [sets, setSets] = useState<Set[]>([])
  const setsRef = useRef<Set[]>([])

  useEffect(() => {
    setsRef.current = sets
  }, [sets])

  useEffect(() => {
    isOfflineRef.current = isOffline
  }, [isOffline])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const shuffleAndAnimate = () => {
      if (!isActive) {
        setSets([])
        return
      } // Stop the animation if not active

      if (setsRef.current.length > 2) {
        if (isOfflineRef.current) {
          setIsOffline(false)
        }

        //  change the first non synced set to synced
        let changed = false
        const newSets = setsRef.current.map((set, i) => {
          if (!changed && !set.synced) {
            changed = true
            return { ...set, synced: true }
          }
          return set
        })
        setSets(newSets)
        setsRef.current = newSets // Update the ref to match the new state
      } else {
        if (!isOfflineRef.current) {
          setIsOffline(true)
        }

        const randomSet = {
          id: Math.floor(Math.random() * 1000),
          weight: 5 * (Math.floor(Math.random() * 10) + 1),
          reps: 4 + Math.floor(Math.random() * 8) + 1,
          rir: Math.floor(Math.random() * 2) + 1,
          synced: false,
        }
        const newSets = [...setsRef.current, randomSet]
        setSets(newSets)
        setsRef.current = newSets // Update the ref to match the new state
      }

      // Schedule the next animation
      if (isActive) {
        timeout = setTimeout(shuffleAndAnimate, 1000)
      }
    }

    shuffleAndAnimate()

    return () => clearTimeout(timeout) // Cleanup timeout on unmount or when isActive changes
  }, [isActive])

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      {/* <div className='flex gap-2'>
        <DebugBlock className='h-32 w-32 rounded-lg' />
        <DebugBlock className='h-32 w-32 rounded-full' />
      </div> */}

      {/* create a switch for offline mode */}
      <div className='mt-4 flex items-center justify-between rounded-lg bg-gray-700 p-4'>
        <span className='font-bold text-white'>Offline Mode</span>
        <button
          className='rounded-full bg-gray-800 p-2'
          onClick={() => setIsOffline(!isOffline)}
        >
          {isOffline ? (
            <X className='h-4 w-4 text-white' />
          ) : (
            <Cloud className='h-4 w-4 text-white' />
          )}
        </button>
      </div>

      <ul
        className={clsx(className, 'flex w-full flex-row justify-center gap-2')}
      >
        <div className='flex min-h-64 w-full items-center justify-center gap-2'>
          <div className='flex h-48 w-72 flex-col gap-3.5 rounded-md bg-gray-800 bg-gradient-to-br from-white/5 to-65% p-3 font-mono ring-[0.25rem] ring-gray-950/50'>
            <span className='font-bold text-white'>Bicep Curl</span>
            <AnimatePresence>
              {sets.length > 0 && (
                <ul className='flex flex-col items-start justify-start gap-2'>
                  {sets.map((set, i) => (
                    <SetRow key={set.id} set={set} isSynced={set.synced} />
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ul>
    </div>
  )
}
