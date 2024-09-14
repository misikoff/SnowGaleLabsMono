'use client'

import Link from 'next/link'
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignOutButton,
  SignUp,
  SignUpButton,
  useSignUp,
} from '@clerk/nextjs'

import { Button } from 'components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function Home() {
  const { isLoaded, signUp } = useSignUp()
  console.log({ isLoaded, signUp })
  return (
    <div className='flex flex-col w-full items-center'>
      <div className='mt-12 text-4xl text-blue-400 font-bold font-serif'>
        Centurion
      </div>
      <div className='mt-12 text-3xl text-gray-900 font-mono text-center'>
        Open Source Exercise
      </div>

      <div className='flex space-x-4 mt-12'>
        <SignedIn>
          <Link href={'/app'}>
            <Button>Go To App</Button>
          </Link>
        </SignedIn>

        <SignedOut>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Sign In</Button>
            </DialogTrigger>
            {/* classes to center children within */}
            <DialogContent className='flex flex-col items-center'>
              <DialogHeader className='flex flex-col items-center'>
                <DialogTitle>Sign In</DialogTitle>
                <DialogDescription>
                  Access an existing account
                </DialogDescription>
              </DialogHeader>
              <SignIn />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Sign Up</Button>
            </DialogTrigger>
            {/* classes to center children within */}
            <DialogContent className='flex flex-col items-center'>
              <DialogHeader className='flex flex-col items-center'>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogDescription>Create a new account</DialogDescription>
              </DialogHeader>
              <SignUp />
            </DialogContent>
          </Dialog>
        </SignedOut>
      </div>
    </div>
  )
}
