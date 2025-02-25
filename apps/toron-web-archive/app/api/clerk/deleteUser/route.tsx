import { deleteUser } from '@/app/app/actions'
import { validateRequest } from '@/lib/webhookUtils'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_UPDATE_USER || ``

export async function POST(request: Request) {
  const payload = await validateRequest(request, webhookSecret)
  console.log(payload)

  if (payload.type !== 'user.deleted') {
    return new Response('Not a user deleted event', { status: 400 })
  }

  const id = payload.data.id
  if (!id) {
    return new Response('Missing user ID', { status: 400 })
  }

  const user = await deleteUser(id)
  console.log({ user })
  if (!user) {
    return new Response('Failed to delete user', { status: 500 })
  } else {
    return new Response('Deleted user', { status: 200 })
  }
}
