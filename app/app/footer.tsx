'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { AxeIcon, CogIcon, DnaIcon, GemIcon } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: AxeIcon, current: false },
  { name: 'Workout', href: '/app/workout', icon: GemIcon, current: false },
  { name: 'History', href: '/app//history', icon: DnaIcon, current: false },
  { name: 'Tools', href: '/app//tools', icon: CogIcon, current: false },
]

export default function Footer({ className = '' }: { className?: string }) {
  const pathname = usePathname() || '/'
  navigation.forEach((n) => {
    n.current = pathname.startsWith(n.href)
  })
  function hoverBar(path: string, startsWith = false) {
    const shouldShowBar = startsWith
      ? pathname.startsWith(path)
      : pathname === path

    return (
      <div className='relative hidden sm:flex'>
        <div className='absolute top-[18px] w-full '>
          {shouldShowBar && (
            <motion.div
              layoutId='bottomBar'
              transition={{
                ease: 'easeInOut',
                duration: 0.25,
              }}
            >
              <div className='rounded-full border-b-2 border-indigo-500' />
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  return (
    <footer className={clsx(className, 'p-8 text-sm')}>
      <div className='w-full'>
        <div className='flex h-16 w-full justify-between'>
          <div className='items-center my-4 sm:-my-px w-full flex justify-between sm:space-x-8 md:flex'>
            {navigation.map((item) => (
              <div className='group' key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    item.current
                      ? 'text-gray-900'
                      : 'text-gray-600 group-hover:text-gray-700',
                    ' flex flex-col items-center gap-y-2 px-1 text-sm font-medium transition-colors duration-150',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <item.icon className='h-6 w-6' />
                  {item.name}
                </Link>
                {hoverBar(item.href, true)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
