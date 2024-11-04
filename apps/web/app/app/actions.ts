'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { and, asc, eq } from 'drizzle-orm'

import { db } from '@repo/db/index'
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
  SessionWithSetGroupWithExerciseAndSets,
} from '@repo/db/schema'

const currentUserId = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) {
    throw new Error('No clerk user found')
  }
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  })
  if (!user) {
    throw new Error('No user found')
  }
  return user.id
}

export async function createUser(
  clerkId: User['clerkId'],
  name: User['name'],
  prod: User['prod'],
) {
  return await db
    .insert(users)
    .values({
      name,
      clerkId,
      prod,
    })
    .returning()
}

export async function deleteUser(clerkId: User['clerkId']) {
  return await db.delete(users).where(eq(users.clerkId, clerkId as string))
}

export async function updateUser(clerkId: User['clerkId'], name: User['name']) {
  return await db
    .update(users)
    .set({ name })
    .where(eq(users.clerkId, clerkId as string))
    .returning()
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
  await db
    .insert(programs)
    .values({ name, description, userId: await currentUserId() })
}

export async function getPrograms() {
  noStore()
  return await db
    .select()
    .from(programs)
    .where(eq(programs.userId, await currentUserId()))
}

export async function getProgram(id: Program['id']) {
  noStore()
  return (
    await db
      .select()
      .from(programs)
      .where((eq(programs.id, id), eq(programs.userId, await currentUserId())))
      .limit(1)
  )[0]
}

export async function getProgramWithMicrocycles(id: Program['id']) {
  noStore()
  const userId = await currentUserId()
  return await db.query.programs.findFirst({
    where: and(eq(programs.id, id), eq(programs.userId, userId)),
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
  await db.insert(microcycles).values({
    name,
    programId,
    order,
    userId: await currentUserId(),
  })
}

export async function deleteMicrocycle(id: Microcycle['id']) {
  noStore()
  await db
    .delete(microcycles)
    .where((eq(microcycles.id, id), eq(programs.userId, await currentUserId())))
}

export async function getMicrocycleWithSessions(
  microcycleId: Microcycle['id'],
) {
  noStore()
  const userId = await currentUserId()
  return await db.query.microcycles.findFirst({
    where: and(
      eq(microcycles.id, microcycleId),
      eq(microcycles.userId, userId),
    ),
    with: {
      sessions: {
        orderBy: [asc(microcycles.order)],
      },
    },
  })
}

export async function createSession({
  id,
  name,
  order,
  programId,
  microcycleId,
  createdAt,
  updatedAt,
}: {
  id?: Session['id']
  name?: Session['name']
  order?: Session['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  createdAt?: Session['createdAt']
  updatedAt?: Session['updatedAt']
}) {
  noStore()
  const session = await db
    .insert(sessions)
    .values({
      id,
      name,
      order,
      programId,
      microcycleId,
      userId: await currentUserId(),
      createdAt,
      updatedAt,
    })
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
  console.log({ id })
  // return (
  //   await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
  // )[0]
  const userId = await currentUserId()
  // TODO: why is explicit type needed here?
  return (await db.query.sessions.findFirst({
    where: and(eq(sessions.id, id), eq(sessions.userId, userId)),
    with: {
      setGroups: {
        with: {
          sets: { orderBy: [asc(sets.order)] },
          exercise: true,
        },
        orderBy: [asc(setGroups.order)],
      },
    },
  })) as SessionWithSetGroupWithExerciseAndSets
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
    .where(and(eq(sessions.id, id), eq(sessions.userId, await currentUserId())))
    .returning()
}

export async function deleteSession(id: Session['id']) {
  // deletes all set groups and sets associated with the session
  noStore()
  await db.delete(sessions).where(eq(sessions.id, id))
}

export async function getSessionWithSetGroups(sessionId: Session['id']) {
  noStore()
  const userId = await currentUserId()
  return await db.query.sessions.findFirst({
    where: and(eq(sessions.id, sessionId), eq(sessions.userId, userId)),
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
  const userId = await currentUserId()
  return await db.query.setGroups.findMany({
    where: and(eq(sessions.id, sessionId), eq(sessions.userId, userId)),
    with: {
      sets: { orderBy: [asc(sets.order)] },
      exercise: true,
    },
    orderBy: [asc(setGroups.order)],
  })
}

export async function getSetGroupWithSets(setGroupId: SetGroup['id']) {
  noStore()
  const userId = await currentUserId()
  return await db.query.setGroups.findFirst({
    where: and(eq(setGroups.id, setGroupId), eq(setGroups.userId, userId)),
    with: {
      exercise: true,
      sets: {
        orderBy: [asc(sets.order)],
      },
    },
  })
}

export async function createSetGroup({
  id,
  order,
  programId,
  microcycleId,
  sessionId,
  exerciseId,
}: {
  id?: SetGroup['id']
  order?: SetGroup['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
}) {
  noStore()
  return await db
    .insert(setGroups)
    .values({
      id,
      programId,
      microcycleId,
      order,
      sessionId,
      exerciseId,
      userId: await currentUserId(),
    })
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
    .where(
      and(eq(setGroups.id, id), eq(setGroups.userId, await currentUserId())),
    )
    .returning()
}

export async function deleteSetGroup(id: SetGroup['id']) {
  noStore()
  // delete all sets associated with the set group
  return await db
    .delete(setGroups)
    .where(
      and(eq(setGroups.id, id), eq(setGroups.userId, await currentUserId())),
    )
    .returning({ deletedId: setGroups.id })
}

// Set Functions
export async function createSet({
  id,
  order,
  userId,
  programId,
  microcycleId,
  sessionId,
  exerciseId,
  setGroupId,
}: {
  id?: Set['id']
  order?: Set['order']
  userId?: Set['userId']
  programId?: Set['programId']
  microcycleId?: Set['microcycleId']
  sessionId: Set['sessionId']
  exerciseId: Set['exerciseId']
  setGroupId: Set['setGroupId']
}) {
  // only chose to add user id to give function the same signature as the dummy function
  // check that userId matches current user
  if (userId && userId !== (await currentUserId())) {
    throw new Error('UserId does not match current user')
  }
  if (!userId) {
    userId = await currentUserId()
  }
  noStore()
  return await db
    .insert(sets)
    .values({
      id,
      programId,
      microcycleId,
      order,
      sessionId,
      exerciseId,
      setGroupId,
      userId,
    })
    .returning()
}

export async function deleteSet(id: Set['id']) {
  noStore()
  return await db
    .delete(sets)
    .where(and(eq(sets.id, id), eq(sets.userId, await currentUserId())))
    .returning({ deletedId: sets.id })
}

export async function getSessions() {
  console.log('getting sessions')
  noStore()
  return await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, await currentUserId()))
    .orderBy(asc(sessions.createdAt))
}

export async function updateSet({
  id,
  reps,
  rpe,
  rir,
  weight,
  exerciseId,
}: {
  id: Set['id']
  reps?: Set['reps']
  rpe?: Set['rpe']
  rir?: Set['rir']
  weight?: Set['weight']
  exerciseId?: Set['exerciseId']
}) {
  noStore()
  return await db
    .update(sets)
    .set({ reps, rpe, rir, weight, exerciseId })
    .where(and(eq(sets.id, id), eq(sets.userId, await currentUserId())))
    .returning()
}

export async function getSessionsForProgram(programId: Program['id']) {
  noStore()
  return await db
    .select()
    .from(sessions)
    .where(
      (eq(sessions.programId, programId),
      eq(sessions.userId, await currentUserId())),
    )
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
  // TODO: test for admin authorization to delete exercises
  noStore()
  await db.delete(exercises)
}

export async function deleteAllMainExercises() {
  // TODO: test for admin authorization to delete main exercises
  noStore()
  await db.delete(exercises).where(eq(exercises.isMainExercise, true))
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
  await db
    .insert(exercises)
    .values({ name, equipmentType, userId: await currentUserId() })
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
