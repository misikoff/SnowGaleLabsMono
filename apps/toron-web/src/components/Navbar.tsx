import { Sora } from 'next/font/google'
import Link from 'next/link'
import clsx from 'clsx'

import { createClient } from '@/lib/supabase/server'

import { Logo } from './Logo'
import { LogoutButton } from './logout-button'
import { Button } from './ui/button'

const sora = Sora({ subsets: ['latin'] })
export default async function Navbar({ className }: { className?: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  return (
    <nav
      className={clsx(
        className,
        'flex h-16 items-center justify-between bg-gray-100/30 p-4 px-6 text-slate-900 shadow-md backdrop-blur-lg',
      )}
    >
      <div className='group flex items-center space-x-2'>
        {/* scale-x-[-1] */}
        <Logo className='h-8 fill-blue-400 transition-colors duration-500 ease-in-out group-hover:fill-amber-800' />
        <div
          className={clsx(
            sora.className,
            'text-3xl font-bold tracking-tight text-blue-400 lowercase transition-colors duration-500 ease-in-out group-hover:text-amber-800',
          )}
        >
          Toron
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        {/* <Link href='/' className='hover:text-gray-400'>
          Home
        </Link>
        <Link href='/about' className='hover:text-gray-400'>
          About
        </Link>
        <Link href='/contact' className='hover:text-gray-400'>
          Contact
        </Link> */}
        {error || !data?.user ? (
          <Link href='auth/login' className=''>
            <Button>Login</Button>
          </Link>
        ) : (
          <LogoutButton />
        )}
      </div>
    </nav>
  )
}
