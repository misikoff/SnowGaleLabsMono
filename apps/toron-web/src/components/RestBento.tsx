'use client'

import { useState } from 'react'

import clsx from 'clsx'

import RestWidget from '@/components/RestWidget'

export default function RestBento({ className }: { className?: string }) {
  const [isActive, setIsActive] = useState(false)

  return (
    <div
      className={clsx(
        className,
        'group flex flex-col items-start justify-start rounded-lg bg-white p-6 shadow-md transition-colors hover:shadow-xl',
      )}
      onMouseEnter={() => setIsActive(true)} // Activate RestWidget on mouse enter
      onMouseLeave={() => setIsActive(false)} // Deactivate RestWidget on mouse leave
    >
      <h4 className='text-center text-lg font-semibold'>
        Dynamic or Scheduled Rest Days
      </h4>
      <p className='mt-2 mb-8 text-sm text-gray-600'>
        Rest when you need it, not when you don{"'"}t. Toron
        {"'"}s calendar is flexible, so small deviations don{"'"}t derail your
        progress.
      </p>
      <RestWidget className='mt-8' isActive={isActive} />
    </div>
  )
}
