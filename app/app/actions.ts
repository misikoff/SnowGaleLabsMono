'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { eq, asc } from 'drizzle-orm'

import { db } from 'db/index'
import {
  users,
  User,
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
} from 'db/schema'

export async function createUser() {
  const clerkUser = await currentUser()

  // store the user in the main database
  await db.insert(users).values({
    name: clerkUser?.fullName,
    clerkId: clerkUser?.id || '',
  })
}

export async function deleteUser(id: User['id']) {
  noStore()
  await db.delete(users).where(eq(users.id, id))
}

export async function getUsers() {
  noStore()
  return await db.select().from(users)
}

export async function createProgram({
  name,
  description,
}: {
  name: Program['name']
  description: Program['description']
}) {
  await db.insert(programs).values({ name, description })
}

export async function getPrograms() {
  noStore()
  return await db.select().from(programs)
}

export async function getProgram(id: Program['id']) {
  noStore()
  return (
    await db.select().from(programs).where(eq(programs.id, id)).limit(1)
  )[0]
}

export async function getProgramWithMicrocycles(id: Program['id']) {
  noStore()
  return await db.query.programs.findFirst({
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
  // get user id from clerk id

  const user = await currentUser()
  if (!user) {
    throw new Error('No user found')
  }
  const fullUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  })
  if (!fullUser) {
    throw new Error('No user found')
  }

  await db
    .insert(microcycles)
    .values({ userId: fullUser.id, name, programId, order })
}

export async function deleteMicrocycle(id: Microcycle['id']) {
  noStore()
  await db.delete(microcycles).where(eq(microcycles.id, id))
}

export async function getMicrocycleWithSessions(
  microcycleId: Microcycle['id'],
) {
  noStore()
  return await db.query.microcycles.findFirst({
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
  const session = await db
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

  // return (
  //   await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
  // )[0]
  return await db.query.sessions.findFirst({
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
  return await db
    .update(sessions)
    .set({ name, order, completed })
    .where(eq(sessions.id, id))
    .returning()
}

export async function deleteSession(id: Session['id']) {
  // deletes all set groups and sets associated with the session
  noStore()
  await db.delete(sessions).where(eq(sessions.id, id))
}

export async function getSessionWithSetGroups(sessionId: Session['id']) {
  noStore()
  return await db.query.sessions.findFirst({
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
  return await db.query.setGroups.findMany({
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
  return await db.query.setGroups.findFirst({
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
  return await db
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
  return await db
    .update(setGroups)
    .set({ exerciseId, order })
    .where(eq(setGroups.id, id))
    .returning()
}

export async function deleteSetGroup(id: SetGroup['id']) {
  noStore()
  // delete all sets associated with the set group
  return await db
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
  programId?: Set['programId']
  microcycleId?: Set['microcycleId']
  sessionId: Set['sessionId']
  exerciseId: Set['exerciseId']
  setGroupId: Set['setGroupId']
}) {
  noStore()
  return await db
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
  return await db
    .delete(sets)
    .where(eq(sets.id, id))
    .returning({ deletedId: sets.id })
}

export async function getSessions() {
  noStore()
  return await db.select().from(sessions)
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
  return await db
    .update(sets)
    .set({ reps, RPE, RIR, weight, exerciseId })
    .where(eq(sets.id, id))
    .returning()
}

export async function getSessionsForProgram(programId: Program['id']) {
  noStore()
  return await db
    .select()
    .from(sessions)
    .where(eq(sessions.programId, programId))
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

  return (await db.select().from(exercises)) as Exercise[]
}

export async function deleteAllExercises() {
  noStore()
  await db.delete(exercises) //.where(ne(exercises.id, 0))
}

export async function deleteAllMainExercises() {
  // TODO: test for admin authorization to delete main exercises
  noStore()
  await db.delete(exercises) //.where(ne(exercises.id, 0))
}

export async function createExercise({
  name,
  equipmentType,
}: {
  name: Exercise['name']
  equipmentType: Exercise['equipmentType']
}) {
  console.log('adding exercise', name)
  noStore()
  await db.insert(exercises).values({ name, equipmentType })
}

export async function createMainExercise({
  name,
  equipmentType,
}: {
  name: Exercise['name']
  equipmentType: Exercise['equipmentType']
}) {
  // TODO: test for admin authorization to create main exercises
  noStore()
  console.log('adding exercise', name)
  await db
    .insert(exercises)
    .values({ name, equipmentType, isMainExercise: true })
}
