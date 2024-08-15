'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@tursodatabase/api'
import { eq, asc } from 'drizzle-orm'

import { buildDbClient as mainClient } from 'db/main/client'
import { users, User } from 'db/main/schema'
import {
  buildDbClient as userClient,
  buildSchemaDbClient,
} from 'db/users/client'
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
  EquipmentType,
} from 'db/users/schema'

async function getUserClient() {
  const clerkUser = await currentUser()
  const user = await mainClient().query.users.findFirst({
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
    org: org as string,
    token: token as string,
  })

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
  const client = await getUserClient()
  await client.insert(programs).values({ name, description })
}

export async function getPrograms() {
  noStore()
  const client = await getUserClient()
  return await client.select().from(programs)
}

export async function getProgram(id: Program['id']) {
  noStore()
  const client = await getUserClient()
  return (
    await client.select().from(programs).where(eq(programs.id, id)).limit(1)
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
  order,
  name,
}: {
  programId: Program['id']
  order: number
  name?: string
}) {
  noStore()
  const client = await getUserClient()
  await client.insert(microcycles).values({ name, programId, order })
}

export async function deleteMicrocycle(id: Microcycle['id']) {
  noStore()
  const client = await getUserClient()
  await client.delete(microcycles).where(eq(microcycles.id, id))
}

export async function getMicrocycleWithSessions(
  microcycleId: Microcycle['id'],
) {
  noStore()
  const client = await getUserClient()
  return await client.query.microcycles.findFirst({
    where: eq(microcycles.id, microcycleId),
    with: {
      sessions: {
        orderBy: [asc(microcycles.order)],
      },
    },
  })
}

export async function createSession({
  name,
  order,
  programId,
  microcycleId,
}: {
  name?: Session['name']
  order?: Session['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
}) {
  noStore()
  const client = await getUserClient()
  const session = await client
    .insert(sessions)
    .values({ name, order, programId, microcycleId })
    // .returning()
    .returning({ insertedId: sessions.id })
  console.log({ session })
  if (session.length > 0) {
    return session[0].insertedId
  }
  return null
}

export async function getSession(id: Session['id']) {
  noStore()
  const client = await getUserClient()

  // return (
  //   await client.select().from(sessions).where(eq(sessions.id, id)).limit(1)
  // )[0]
  return await client.query.sessions.findFirst({
    where: eq(sessions.id, id),
    with: {
      setGroups: {
        with: {
          sets: { orderBy: [asc(sets.order)] },
          exercise: true,
        },
        orderBy: [asc(setGroups.order)],
      },
    },
  })
}

export async function updateSession({
  id,
  name,
  order,
  completed,
}: {
  id: Session['id']
  name?: Session['name']
  order?: Session['order']
  completed?: Session['completed']
}) {
  noStore()
  const client = await getUserClient()
  return await client
    .update(sessions)
    .set({ name, order, completed })
    .where(eq(sessions.id, id))
    .returning()
}

export async function deleteSession(id: Session['id']) {
  noStore()
  const client = await getUserClient()
  await client.delete(sets).where(eq(sets.sessionId, id))
  await client.delete(setGroups).where(eq(setGroups.sessionId, id))
  await client.delete(sessions).where(eq(sessions.id, id))
}

export async function getSessionWithSetGroups(sessionId: Session['id']) {
  noStore()
  const client = await getUserClient()
  return await client.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      setGroups: {
        with: { exercise: true },
        orderBy: [asc(setGroups.order)],
      },
    },
  })
}

export async function getSetGroupsForSession(sessionId: Session['id']) {
  noStore()
  const client = await getUserClient()
  return await client.query.setGroups.findMany({
    where: eq(sessions.id, sessionId),
    with: {
      sets: { orderBy: [asc(sets.order)] },
      exercise: true,
    },
    orderBy: [asc(setGroups.order)],
  })
}

export async function getSetGroupWithSets(setGroupId: SetGroup['id']) {
  noStore()
  const client = await getUserClient()
  return await client.query.setGroups.findFirst({
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
  microcycleId,
  sessionId,
  exerciseId,
}: {
  order?: SetGroup['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
}) {
  noStore()
  const client = await getUserClient()

  return await client
    .insert(setGroups)
    .values({ programId, microcycleId, order, sessionId, exerciseId })
    .returning()
}

export async function updateSetGroup({
  id,
  // sessionId,
  // microcycleId,
  // programId,
  exerciseId,
  order,
}: {
  id: Set['id']
  // sessionId?: Session['id']
  // microcycleId?: Microcycle['id']
  // programId?: Program['id']
  exerciseId?: Exercise['id']
  order?: SetGroup['order']
}) {
  noStore()
  const client = await getUserClient()
  return await client
    .update(setGroups)
    .set({ exerciseId, order })
    .where(eq(setGroups.id, id))
    .returning()
}

export async function deleteSetGroup(id: SetGroup['id']) {
  noStore()
  const client = await getUserClient()

  await client.delete(sets).where(eq(sets.setGroupId, id))

  return await client
    .delete(setGroups)
    .where(eq(setGroups.id, id))
    .returning({ deletedId: setGroups.id })
}

// Set Functions
export async function createSet({
  order,
  programId,
  microcycleId,
  sessionId,
  exerciseId,
  setGroupId,
}: {
  order?: Set['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
  setGroupId?: SetGroup['id']
}) {
  noStore()
  const client = await getUserClient()
  return await client
    .insert(sets)
    .values({
      programId,
      microcycleId,
      order,
      sessionId,
      exerciseId,
      setGroupId,
    })
    .returning()
}

export async function deleteSet(id: Set['id']) {
  noStore()
  const client = await getUserClient()
  return await client
    .delete(sets)
    .where(eq(sets.id, id))
    .returning({ deletedId: sets.id })
}

export async function getSessions() {
  noStore()
  const client = await getUserClient()
  return await client.select().from(sessions)
}

export async function updateSet({
  id,
  reps,
  RPE,
  RIR,
  weight,
  exerciseId,
}: {
  id: Set['id']
  reps?: Set['reps']
  RPE?: Set['RPE']
  RIR?: Set['RIR']
  weight?: Set['weight']
  exerciseId?: Set['exerciseId']
}) {
  noStore()
  const client = await getUserClient()
  return await client
    .update(sets)
    .set({ reps, RPE, RIR, weight, exerciseId })
    .where(eq(sets.id, id))
    .returning()
}

export async function getSessionsForProgram(programId: Program['id']) {
  noStore()
  const client = await getUserClient()
  return await client
    .select()
    .from(sessions)
    .where(eq(sessions.programId, programId))
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
  const client = await getUserClient()
  return (await client.select().from(exercises)) as Exercise[]
}

export async function deleteAllExercises() {
  noStore()
  const client = await getUserClient()
  await client.delete(exercises) //.where(ne(exercises.id, 0))
}

export async function deleteAllSchemaExercises() {
  noStore()

  await buildSchemaDbClient().delete(exercises) //.where(ne(exercises.id, 0))
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
  console.log('adding exercise', id)
  noStore()

  await buildSchemaDbClient()
    .insert(exercises)
    .values({ id, name, equipmentType: equipment })
}

export async function createSchemaExercise({
  id,
  name,
  equipment,
}: {
  id: number
  name: string
  equipment: EquipmentType
}) {
  console.log('adding exercise', id)
  noStore()

  await buildSchemaDbClient()
    .insert(exercises)
    .values({ id, name, equipmentType: equipment })
}
