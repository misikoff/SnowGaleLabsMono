'use client'

import { useEffect, useState } from 'react'

import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import {
  createSchemaExercise,
  createUser,
  deleteAllSchemaExercises,
  getUsers,
} from 'app/app/actions'
import { User } from 'db/main/schema'
import { exercisesArray } from 'db/seedData'
import { EquipmentType } from 'db/users/schema'

export default function Home() {
  const [userName, setUserName] = useState('')
  const [users, setUsers] = useState<User[]>([])

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
          await createUser({ name: userName })
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
          await deleteAllSchemaExercises()
          alert('deleted all schema exercises')
        }}
      >
        delete all exercises
      </Button>

      <Button
        onClick={async () => {
          exercisesArray.forEach(async ({ id, name, equipment }) => {
            await createSchemaExercise({
              id,
              name,
              equipment: equipment as EquipmentType,
            })
          })

          alert('created all exercises')
        }}
      >
        add all exercises to schema / user template
      </Button>
    </div>
  )
}
