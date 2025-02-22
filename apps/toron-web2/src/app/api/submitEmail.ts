import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = body

  resend.contacts.create({
    // @ts-expect-error
    email,
    firstName: 'SampleFirst',
    lastName: 'SampleLast',
    unsubscribed: false,
    audienceId: process.env.RESEND_AUDIENCE_ID as string,
  });

  // @ts-expect-error
  console.log(email)
  return new Response('Thank you for signing up!')
}

