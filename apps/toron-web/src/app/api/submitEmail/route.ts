import { Resend } from 'resend'

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = body
  const resend = new Resend(process.env.RESEND_API_KEY as string)

  return resend.contacts
    .create({
      email,
      firstName: 'SampleFirst',
      lastName: 'SampleLast',
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
    })
    .then((response) => {
      console.log(response)
      return new Response('Thank you for signing up!', { status: 200 })
    })
    .catch((error) => {
      console.error(error)
      return new Response('Something went wrong. Please try again.', {
        status: 500,
      })
    })
}
