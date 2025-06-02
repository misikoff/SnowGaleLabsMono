import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'

import Chassis from './chassis'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-2'>
      {/* <p>
        Hello <span>{data.user.email}</span>
      </p>
      <LogoutButton /> */}
      {/* workouts will appear here along with a button to add more exercises */}
      {/*  */}
      <Chassis />
    </div>
  )
}
