'use client'

import { useState } from 'react'

import clsx from 'clsx'

export default function Bento({
  className,
  children,
  Widget,
}: {
  className?: string
  children: React.ReactNode
  // react component with className and isActive prop
  Widget?: React.ComponentType<{ className?: string; isActive?: boolean }>
}) {
  const [isActive, setIsActive] = useState(false)

  return (
    <div
      className={clsx(
        className,
        'group flex flex-col items-start justify-start rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl',
      )}
      onMouseEnter={() => setIsActive(true)} // Activate RestWidget on mouse enter
      onMouseLeave={() => setIsActive(false)} // Deactivate RestWidget on mouse leave
    >
      {children}
      {Widget && <Widget className='mt-4' isActive={isActive} />}
    </div>
  )
}
