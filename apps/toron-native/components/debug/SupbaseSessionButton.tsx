import { useState } from 'react'

import { Button } from 'react-native'

import { supabase } from '@/utils/supabase'

export default function DebugSupabaseSessionButton() {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      title={loading ? 'Loading Supabase Session' : 'Get Supabase Session'}
      onPress={async () => {
        console.log('getting Supabase session')
        setLoading(true)
        await supabase.auth.getSession().then(({ data: { session } }) => {
          console.log('session', session)
          if (session) {
            console.log('session', session)
          } else {
            console.log('no session')
          }
        })
        setLoading(false)
      }}
      disabled={loading}
    />
  )
}
