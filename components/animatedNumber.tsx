'use client'

import { useEffect } from 'react'

import { motion, useSpring, useTransform } from 'framer-motion'

export default function AnimatedNumber({ value }: { value: number }) {
  let spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 })
  let display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(),
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}
