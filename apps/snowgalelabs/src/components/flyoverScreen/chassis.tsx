'use client'
import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

import imageLaptop from '@/images/pixel-background.png'

function getRandomPath() {
  // Example: generate a random path (customize as needed)
  return [
    { x: 0, y: 0 },
    { x: 100 + Math.random() * 500, y: -40 + Math.random() * 40 },
    { x: 200 + Math.random() * 500, y: Math.random() * 40 - 20 },
    { x: 440, y: 0 },
  ]
}
gsap.registerPlugin(MotionPathPlugin)
import OverheadOwl from './overheadOwl'

export default function FlyoverScreen({ className }: { className?: string }) {
  const owlRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)

  // Store the current GSAP tweens so we can kill/restart them
  const owlTween = useRef<gsap.core.Tween | null>(null)
  const shadowTween = useRef<gsap.core.Tween | null>(null)

  // Store the current path in state
  const [path, setPath] = useState(getRandomPath())

  // Function to start the tweens
  const startTweens = (newPath: any) => {
    if (owlRef.current) {
      if (owlTween.current) {
        owlTween.current.kill()
      }
      gsap.set(owlRef.current, { x: 0, y: 0 })
      owlTween.current = gsap.to(owlRef.current, {
        repeat: 0,
        duration: 4,
        motionPath: {
          path: newPath,
          curviness: 1.2,
          autoRotate: true,
        },
        ease: 'none',
        onComplete: () => {
          const nextPath = getRandomPath()
          setPath(nextPath)
        },
      })
    }
    if (shadowRef.current) {
      if (shadowTween.current) {
        shadowTween.current.kill()
      }
      gsap.set(shadowRef.current, { x: 0, y: 0 })
      shadowTween.current = gsap.to(shadowRef.current, {
        repeat: 0,
        duration: 4,
        motionPath: {
          path: newPath,
          curviness: 1.2,
          autoRotate: false,
        },
        ease: 'none',
      })
    }
  }

  // Start the animation on mount and whenever the path changes
  useEffect(() => {
    startTweens(path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (owlTween.current) {
        owlTween.current.kill()
      }
      if (shadowTween.current) {
        shadowTween.current.kill()
      }
    }
  }, [])

  return (
    <div
      className={`${className} flex flex-col items-center justify-center gap-4 bg-amber-200 p-4`}
    >
      <div className='overflow-hidden rounded-lg border border-gray-400 bg-white shadow-lg'>
        <div className='relative h-64 w-96 max-w-screen'>
          <Image src={imageLaptop} alt='snowy background' />
          <div
            ref={owlRef}
            className='absolute top-1/2 -left-12 z-10 h-12 w-12'
          >
            <OverheadOwl className='h-12 w-12 rotate-90' />
          </div>
          <div ref={shadowRef} className='absolute top-1/2 -left-12 z-10'>
            <svg className='mt-12 ml-2' width='120' height='40'>
              <ellipse
                cx='20'
                cy='10'
                rx='20'
                ry='10'
                fill='gray'
                opacity='0.5'
              />
            </svg>
          </div>
        </div>
      </div>
      <p>hello wow</p>
    </div>
  )
}
