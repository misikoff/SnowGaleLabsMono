'use client'

import { useEffect, useState } from 'react'

import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import {
  createExercise,
  createUser,
  deleteAllExercises,
  getUsers,
} from 'app/app/actions'
import { exercisesArray } from 'db/seedData'

export default function Home() {
  const [userName, setUserName] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    console.log({ users })
  }, [users])
  return (
    <div>
      <div>Users</div>
      <Label>name</Label>
      <Input
        type='name'
        placeholder='name'
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
      />
      {userName}
      <Button
        onClick={async () => {
          await createUser(userName)
          setUserName('')
          setUsers((await getUsers()) as any)
        }}
      >
        create user
      </Button>

      {users.map((u) => (
        <div key={u.name}>{u.name}</div>
      ))}

      <Button
        onClick={async () => {
          await deleteAllExercises()
          alert('deleted all exercises')
        }}
      >
        delete all exercises
      </Button>

      <Button
        onClick={async () => {
          exercisesArray.forEach(async ({ id, name, equipment }) => {
            await createExercise({ id, name, equipment: equipment as any })
          })

          alert('created all exercises')
        }}
      >
        add all exercises
      </Button>
    </div>
  )
}
