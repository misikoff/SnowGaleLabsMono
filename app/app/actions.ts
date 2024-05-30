'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { eq, asc } from 'drizzle-orm'

import { db } from 'db'
import {
  users,
  sessions,
  User,
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
} from 'db/test/schema'

export async function createUser({ name }: { name: User['name'] }) {
  await db.insert(users).values({ name })
  // ...
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
  // ...
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
  await db.insert(microcycles).values({ name, programId, userId, order })
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
  await db
    .insert(sessions)
    .values({ name, programId, userId, microcycleId, order })
}

export async function deleteSession(id: Session['id']) {
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
  await db
    .insert(setGroups)
    .values({ programId, userId, microcycleId, order, sessionId, exerciseId })
}

export async function deleteSetGroup(id: SetGroup['id']) {
  noStore()
  await db.delete(setGroups).where(eq(setGroups.id, id))
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
  await db.insert(sets).values({
    programId,
    userId,
    microcycleId,
    order,
    sessionId,
    exerciseId,
    setGroupId,
  })
}

export async function deleteSet(id: Set['id']) {
  noStore()
  await db.delete(sets).where(eq(sets.id, id))
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

  // return (
  //   await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
  // )[0]
  return await db.query.sessions.findFirst({
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

  await db.insert(exercises).values({ id, name, equipmentType: equipment })
  // ...
}
