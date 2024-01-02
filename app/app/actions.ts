'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { eq, lt, gte, ne } from 'drizzle-orm'

import { db } from 'db'
import {
  users,
  sessions,
  User,
  Session,
  Program,
  setGroups,
  sets,
  Set,
  Exercise,
  exercises,
} from 'db/test/schema'

export async function createUser(name: string) {
  await db.insert(users).values({ name })
  // ...
}

export async function getUsers() {
  noStore()
  return (await db.select().from(users)) as User[]
}

export async function getSessionsForProgram(programId: Program['id']) {
  noStore()
  return await db
    .select()
    .from(sessions)
    .where(eq(sessions.programId, programId))
}

export async function getSession(id: Session['id']) {
  noStore()
  return (
    await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
  )[0]
}

export async function getSetsForSession(sessionId: Session['id']) {
  noStore()
  const rows = await db
    .select()
    .from(setGroups)
    .where(eq(setGroups.sessionId, sessionId))
    .leftJoin(sets, eq(setGroups.id, sets.setGroupId))

  console.log(rows)

  const result = {} as any

  rows.forEach((row) => {
    const setGroup = row.setGroups
    const set = row.sets
    if (!result[setGroup.id]) {
      result[setGroup.id] = { setGroup, sets: [] }
    }
    if (set) {
      result[setGroup.id].sets.push(set)
    }
  })

  // convert result into an array ordered by setGroup.order
  let result2 = Object.values(result).sort((a, b) => {
    return a.setGroup.order - b.setGroup.order
  })

  result2 = result2.map((x) => {
    x.sets = x.sets.sort((a: Set, b: Set) => {
      return a.order - b.order
    })
    return x
  })

  return result2
}

export async function getExercises() {
  noStore()
  return (await db.select().from(exercises)) as Exercise[]
}
