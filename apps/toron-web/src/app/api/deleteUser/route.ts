import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

export async function DELETE() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const headersList = await headers()
  const authorization = headersList.get('authorization')
  console.log('authorization', authorization)

  const token = authorization?.split(' ')[1]
  console.log('token', token)

  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Verify the JWT using the Supabase JWT secret
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET || '')

    const userId = decoded.sub
    console.log('userId', userId)

    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Delete the user using Supabase Admin API
    const { error } = await supabaseAdmin.auth.admin.deleteUser(
      userId as string,
    )

    if (error) {
      throw error
    }

    return new Response('User deleted successfully', { status: 200 })
  } catch (error: any) {
    console.error('Error deleting user:', error.message)
    return new Response('User deleted successfully', { status: 500 })
  }
}
