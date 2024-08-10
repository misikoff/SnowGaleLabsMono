'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@tursodatabase/api'
import { eq, asc } from 'drizzle-orm'

import { buildDbClient as mainClient } from 'db/main/client'
import { users, User } from 'db/main/schema'
import { buildDbClient as userClient, Env } from 'db/users/client'
import {
  sessions,
  microcycles,
  Microcycle,
  Session,
  Program,
  setGroups,
  sets,
  Set,
  Exercise,
  exercises,
  programs,
  SetGroup,
} from 'db/users/schema'

// hardcoded for now
// const userEnv = { url: 'user-yqviba-misikoff.turso.io' } as Env

async function getUserClient() {
  const clerkUser = await currentUser()
  console.log({ clerkUser })
  const user = await mainClient().query.users.findFirst({
    // hardcoding for now
    // this should be based on the user's session with clerk
    where: eq(users.clerkId, clerkUser?.id || ''),
  })
  return userClient({ url: user?.dbUrl as string })
}

export async function createUser({ name }: { name: User['name'] }) {
  // create a new database for the user
  const org = process.env.TURSO_ORG
  const token = process.env.TURSO_PLATFORM_API_TOKEN
  const userSchema = process.env.TURSO_USER_SCHEMA
  const group = process.env.TURSO_GROUP

  const turso = createClient({
    org: org as string, // Your personal account or organization slug
    token: token as string, // Your personal access token
  })

  //make the user name a random string
  // const user = Math.random().toString(36).substring(7)
  const clerkUser = await currentUser()
  // TODO: consider hashing this to make it all lowercase instead
  const newDatabaseName = `user-${clerkUser?.id.replace('user_', '').toLowerCase() || ''}`
  console.log({ newDatabaseName })
  const database = await turso.databases.create(newDatabaseName, {
    group: group as string,
    schema: userSchema as string,
  })

  console.log({ database })

  // store the user in the main database
  await mainClient()
    .insert(users)
    .values({
      name: clerkUser?.fullName,
      clerkId: clerkUser?.id || '',
      dbUrl: database.hostname,
    })

  // need to handle database creation working and main client insert failing
  // maybe delete created database
  // maybe change order of operations
}

export async function getUsers() {
  noStore()
  return await mainClient().select().from(users)
}

export async function createProgram({
  name,
  description,
}: {
  name: Program['name']
  description: Program['description']
}) {
  await (await getUserClient()).insert(programs).values({ name, description })
}

export async function getPrograms() {
  noStore()
  return await (await getUserClient()).select().from(programs)
}

export async function getProgram(id: Program['id']) {
  noStore()
  return (
    await (await getUserClient())
      .select()
      .from(programs)
      .where(eq(programs.id, id))
      .limit(1)
  )[0]
}

export async function getProgramWithMicrocycles(id: Program['id']) {
  noStore()
  return await (
    await getUserClient()
  ).query.programs.findFirst({
    where: eq(programs.id, id),

    with: {
      // microcycles: true,
      microcycles: {
        with: { sessions: { orderBy: [asc(sessions.order)] } },
        orderBy: [asc(microcycles.order)],
      },
    },
  })
}

export async function createMicrocycle({
  programId,
  userId,
  order,
  name,
}: {
  programId: Program['id']
  userId: User['id']
  order: number
  name?: string
}) {
  noStore()
  await (await getUserClient())
    .insert(microcycles)
    .values({ name, programId, order })
}

export async function deleteMicrocycle(id: Microcycle['id']) {
  noStore()
  await (await getUserClient())
    .delete(microcycles)
    .where(eq(microcycles.id, id))
}

export async function getMicrocycleWithSessions(
  microcycleId: Microcycle['id'],
) {
  noStore()
  return await (
    await getUserClient()
  ).query.microcycles.findFirst({
    where: eq(microcycles.id, microcycleId),
    with: {
      sessions: {
        orderBy: [asc(microcycles.order)],
      },
    },
  })
}

export async function createSession({
  order,
  programId,
  userId,
  microcycleId,
  name,
}: {
  order: number
  programId?: Program['id']
  userId?: User['id']
  microcycleId?: Microcycle['id']
  name?: string
}) {
  noStore()
  await (await getUserClient())
    .insert(sessions)
    .values({ name, programId, microcycleId, order })
}

export async function deleteSession(id: Session['id']) {
  noStore()
  await (await getUserClient()).delete(sessions).where(eq(sessions.id, id))
}

export async function getSessionWithSetGroups(sessionId: Session['id']) {
  noStore()
  return await (
    await getUserClient()
  ).query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      setGroups: {
        with: { exercise: true },
        orderBy: [asc(setGroups.order)],
      },
    },
  })
}

export async function getSetGroupWithSets(setGroupId: SetGroup['id']) {
  noStore()
  return await (
    await getUserClient()
  ).query.setGroups.findFirst({
    where: eq(setGroups.id, setGroupId),
    with: {
      exercise: true,
      sets: {
        orderBy: [asc(sets.order)],
      },
    },
  })
}

export async function createSetGroup({
  order,
  programId,
  userId,
  microcycleId,
  sessionId,
  exerciseId,
}: {
  order: number
  programId?: Program['id']
  userId?: User['id']
  microcycleId?: Microcycle['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
}) {
  noStore()
  await (await getUserClient())
    .insert(setGroups)
    .values({ programId, microcycleId, order, sessionId, exerciseId })
}

export async function deleteSetGroup(id: SetGroup['id']) {
  noStore()
  await (await getUserClient()).delete(setGroups).where(eq(setGroups.id, id))
}

// Set Functions
export async function createSet({
  order,
  programId,
  userId,
  microcycleId,
  sessionId,
  exerciseId,
  setGroupId,
}: {
  order: number
  programId?: Program['id']
  userId?: User['id']
  microcycleId?: Microcycle['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
  setGroupId?: SetGroup['id']
}) {
  noStore()
  await (await getUserClient()).insert(sets).values({
    programId,
    microcycleId,
    order,
    sessionId,
    exerciseId,
    setGroupId,
  })
}

export async function deleteSet(id: Set['id']) {
  noStore()
  await (await getUserClient()).delete(sets).where(eq(sets.id, id))
}

export async function getSessionsForProgram(programId: Program['id']) {
  noStore()
  return await (await getUserClient())
    .select()
    .from(sessions)
    .where(eq(sessions.programId, programId))
}

export async function getSession(id: Session['id']) {
  noStore()

  // return (
  //   await (await getUserClient()).select().from(sessions).where(eq(sessions.id, id)).limit(1)
  // )[0]
  return await (
    await getUserClient()
  ).query.sessions.findFirst({
    where: eq(sessions.id, id),

    with: {
      setGroups: {
        with: { sets: { orderBy: [asc(sets.order)] }, exercise: true },
        orderBy: [asc(setGroups.order)],
      },
    },
  })
}

export async function getSetsForSession(sessionId: Session['id']) {
  noStore()
  const rows = await (await getUserClient())
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
  let result2 = Object.values(result).sort((a: any, b: any) => {
    return a.setGroup.order - b.setGroup.order
  })

  result2 = result2.map((x: any) => {
    x.sets = x.sets.sort((a: any, b: any) => {
      return a.order - b.order
    })
    return x
  })

  return result2
}

export async function getExercises(force = false) {
  if (force) {
    noStore()
  }
  return (await (await getUserClient()).select().from(exercises)) as Exercise[]
}

export async function deleteAllExercises() {
  noStore()
  await (await getUserClient()).delete(exercises) //.where(ne(exercises.id, 0))
}

export async function createExercise({
  id,
  name,
  equipment,
}: {
  id: number
  name: string
  equipment:
    | 'barbell'
    | 'dumbbell'
    | 'cable'
    | 'machine'
    | 'bodyweight'
    | 'band'
    | 'other'
}) {
  console.log('adding exercise ', id)
  noStore()

  await (await getUserClient())
    .insert(exercises)
    .values({ id, name, equipmentType: equipment })
  // ...
}
