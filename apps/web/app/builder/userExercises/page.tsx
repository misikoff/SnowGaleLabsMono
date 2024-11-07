'use client'

import { useEffect, useState } from 'react'

import { User } from '@repo/db/schema'
import { EquipmentType } from '@repo/db/schema'
import { exercisesArray } from '@repo/db/seedData'
import {
  createMainExercise,
  deleteAllMainExercises,
  getUsers,
} from '@/app/app/adminActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

      {users.map((u) => (
        <div key={u.name}>{u.name}</div>
      ))}

      <Button
        onClick={async () => {
          await deleteAllMainExercises()
          alert('deleted all main exercises')
        }}
      >
        delete all main exercises
      </Button>

      <Button
        onClick={async () => {
          exercisesArray.forEach(async ({ name, equipmentType }) => {
            await createMainExercise({
              name,
              equipmentType: equipmentType as EquipmentType,
            })
          })

          alert('created all exercises')
        }}
      >
        add main exercises
      </Button>

      <Button
        onClick={async () => {
          const x = await getUsers()
        }}
      >
        get users
      </Button>
    </div>
  )
}
