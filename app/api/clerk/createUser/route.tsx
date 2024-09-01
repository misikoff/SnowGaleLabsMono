import { UserJSON, UserWebhookEvent } from '@clerk/nextjs/server'

import { createUser } from '@/app/app/actions'

export async function POST(request: Request) {
  const payload: UserWebhookEvent = await request.json()
  console.log(payload)
  const data = payload.data as UserJSON

  const id = data.id
  if (!id) {
    return new Response('Missing user ID', { status: 400 })
  }
  const name = [data.first_name, data.last_name].join(' ')

  const user = await createUser(id, name)
  console.log({ user })
  if (!user) {
    return new Response('Failed to create user', { status: 500 })
  } else {
    return new Response('New user created', { status: 200 })
  }
}
