'use client'

import { useEffect, useState } from 'react'

import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import {
  createMainExercise,
  createUser,
  deleteAllMainExercises,
  getUsers,
} from 'app/app/actions'
import { User } from 'db/schema'
import { EquipmentType } from 'db/schema'
import { exercisesArray } from 'db/seedData'

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
          await createUser()
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
          await deleteAllMainExercises()
          alert('deleted all schema exercises')
        }}
      >
        delete all exercises
      </Button>

      <Button
        onClick={async () => {
          exercisesArray.forEach(async ({ name, equipment }) => {
            await createMainExercise({
              name,
              equipment: equipment as EquipmentType,
            })
          })

          alert('created all exercises')
        }}
      >
        add main exercises
      </Button>
    </div>
  )
}
