'use client'
import { useEffect, useRef } from 'react'

import Image from 'next/image'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

import imageLaptop from '@/images/pixel-background.png'

gsap.registerPlugin(MotionPathPlugin)
import OverheadOwl from './overheadOwl'
import { StylizedImage } from '../StylizedImage'
const path = [
  { x: 0, y: 0 },
  // { x: 100, y: -40 },
  // { x: 200, y: 0 },
  { x: 200, y: -20 },
  // { x: 0, y: 0 },
  { x: 300, y: -10 },
  { x: 440, y: 0 },
  // { x: -40, y: 0 },
]

export default function FlyoverScreen() {
  const owlRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (owlRef.current) {
      gsap.to(owlRef.current, {
        repeat: -1,
        // yoyo: true,
        duration: 4,
        motionPath: {
          path,
          curviness: 1.2,
          autoRotate: true,
        },
        ease: 'none',
      })
    }

    if (shadowRef.current) {
      gsap.to(shadowRef.current, {
        repeat: -1,
        // yoyo: true,
        duration: 4,
        motionPath: {
          path,
          curviness: 1.2,
          autoRotate: false,
        },
        ease: 'none',
      })
    }
  }, [])

  return (
    <div className='flex flex-col items-center justify-center gap-4 bg-gray-200 p-4'>
      <div className='text-4xl font-bold text-black'>Flyover Screen</div>
      <div className='overflow-hidden rounded-lg border border-gray-400 bg-white shadow-lg'>
        <div className='relative h-64 w-96 bg-gray-300'>
          {/* <img
          className='absolute top-0 left-0 h-full w-full'
          src={imageLaptop}
          alt='Pokemon Title Screen Background'
        /> */}
          <Image
            src={imageLaptop}
            // sizes='(min-width: 1024px) 41rem, 31rem'
            // className='justify-center lg:justify-end'
          />
          <div
            ref={owlRef}
            className='absolute top-1/2 -left-12 z-10 h-12 w-12'
            // style={{ position: 'absolute', left: '50%', top: '60%' }}
          >
            {/* <div> */}
            <OverheadOwl className='h-12 w-12 rotate-90' />
            {/* drop a shadow ellipse */}

            {/* <div className='absolute -bottom-2 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-gray-500 opacity-50 shadow-lg' /> */}
            {/* </div> */}
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
    </div>
  )
}
