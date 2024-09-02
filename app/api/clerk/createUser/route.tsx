import { UserJSON, UserWebhookEvent } from '@clerk/nextjs/server'

import { createUser } from '@/app/app/actions'
import { validateRequest } from '@/lib/webhookUtils'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_CREATE_USER || ``

export async function POST(request: Request) {
  const payload = (await validateRequest(
    request,
    webhookSecret,
  )) as UserWebhookEvent

  console.log(payload)
  const data = payload.data as UserJSON

  const id = data.id
  if (!id) {
    return new Response('Missing user ID', { status: 400 })
  }
  const name = [data.first_name, data.last_name].join(' ')

  // This is a custom header that we added to the webhook in Clerk
  const prod = request.headers.get('prod') === 'true'

  const user = await createUser(id, name, prod)
  console.log({ user })
  if (!user) {
    return new Response('Failed to create user', { status: 500 })
  } else {
    return new Response('New user created', { status: 200 })
  }
}
