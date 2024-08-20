'use client'

import { createUser, getPrograms } from './app/actions'

async function test() {
  console.log('test')
  const res = await fetch('/api/createUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'test' }),
  })
  console.log(await res.text())
}

export default function TestButton() {
  return (
    <>
      <button onClick={test}>Test</button>
      <button
        onClick={async () => {
          await createUser()
        }}
      >
        create user
      </button>
      <button
        onClick={async () => {
          const programs = await getPrograms()
          console.log({ programs })
        }}
      >
        get programs for user
      </button>
    </>
  )
}
