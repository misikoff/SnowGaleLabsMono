import Link from 'next/link'
import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className='mt-12 flex h-full w-full flex-col items-center justify-center gap-4'>
      <p>
        Hello <span>{data.user.email}</span>
      </p>
      <LogoutButton />
      <Link
        href='/protected/training'
        className='text-blue-500 hover:underline'
      >
        Go to Training
      </Link>
    </div>
  )
}
