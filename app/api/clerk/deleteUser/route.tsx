import { DeletedObjectJSON, UserWebhookEvent } from '@clerk/nextjs/server'

import { deleteUser } from '@/app/app/actions'

export async function POST(request: Request) {
  const payload: UserWebhookEvent = await request.json()
  console.log(payload)
  const data = payload.data as DeletedObjectJSON

  const id = data.id
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
