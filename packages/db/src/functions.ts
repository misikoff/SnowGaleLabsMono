'use server'

// NOT USED ANYWHERE

import { and, asc, eq } from 'drizzle-orm'

import { db } from './index'
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
} from './schema'

async function validateUser(clerkId: string | null) {
  console.log('checking')
  console.log({ clerkId })
  if (!clerkId) {
    throw new Error('No clerkId provided')
  } else {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    })
    if (!user) {
      throw new Error('No user found')
    } else {
      return user.id
    }
  }
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
  const userId = await validateUser(clerkId)
  return await db.delete(users).where(eq(users.clerkId, userId))
}

export async function updateUser(clerkId: User['clerkId'], name: User['name']) {
  const userId = await validateUser(clerkId)
  return await db
    .update(users)
    .set({ name })
    .where(eq(users.id, userId))
    .returning()
}

export async function createProgram({
  name,
  description,
  clerkId,
}: {
  name: Program['name']
  description: Program['description']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  await db.insert(programs).values({ name, description, userId })
}

export async function getPrograms({ clerkId }: { clerkId: User['clerkId'] }) {
  const userId = await validateUser(clerkId)
  return await db.select().from(programs).where(eq(programs.userId, userId))
}

export async function getProgram({
  id,
  clerkId,
}: {
  id: Program['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  return (
    await db
      .select()
      .from(programs)
      .where((eq(programs.id, id), eq(programs.userId, userId)))
      .limit(1)
  )[0]
}

export async function getProgramWithMicrocycles({
  id,
  clerkId,
}: {
  id: Program['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
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
  clerkId,
}: {
  programId: Program['id']
  order: number
  name?: string
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  await db.insert(microcycles).values({
    name,
    programId,
    order,
    userId,
  })
}

export async function deleteMicrocycle({
  id,
  clerkId,
}: {
  id: Microcycle['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  await db
    .delete(microcycles)
    .where((eq(microcycles.id, id), eq(programs.userId, userId)))
}

export async function getMicrocycleWithSessions({
  microcycleId,
  clerkId,
}: {
  microcycleId: Microcycle['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
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
  clerkId,
}: {
  id?: Session['id']
  name?: Session['name']
  order?: Session['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  createdAt?: Session['createdAt']
  updatedAt?: Session['updatedAt']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  const session = await db
    .insert(sessions)
    .values({
      id,
      name,
      order,
      programId,
      microcycleId,
      userId,
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

export async function getSession({
  id,
  clerkId,
}: {
  id: Session['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  console.log({ id })
  // return (
  //   await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
  // )[0]
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
  clerkId,
}: {
  id: Session['id']
  name?: Session['name']
  order?: Session['order']
  completed?: Session['completed']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  return await db
    .update(sessions)
    .set({ name, order, completed })
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
    .returning()
}

export async function deleteSession(id: Session['id']) {
  // deletes all set groups and sets associated with the session

  await db.delete(sessions).where(eq(sessions.id, id))
}

export async function getSessionWithSetGroups({
  sessionId,
  clerkId,
}: {
  sessionId: Session['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
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

export async function getSetGroupsForSession({
  sessionId,
  clerkId,
}: {
  sessionId: Session['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  return await db.query.setGroups.findMany({
    where: and(eq(sessions.id, sessionId), eq(sessions.userId, userId)),
    with: {
      sets: { orderBy: [asc(sets.order)] },
      exercise: true,
    },
    orderBy: [asc(setGroups.order)],
  })
}

export async function getSetGroupWithSets({
  setGroupId,
  clerkId,
}: {
  setGroupId: SetGroup['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
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
  clerkId,
}: {
  id?: SetGroup['id']
  order?: SetGroup['order']
  programId?: Program['id']
  microcycleId?: Microcycle['id']
  sessionId?: Session['id']
  exerciseId?: Exercise['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  return await db
    .insert(setGroups)
    .values({
      id,
      programId,
      microcycleId,
      order,
      sessionId,
      exerciseId,
      userId,
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
  clerkId,
}: {
  id: Set['id']
  // sessionId?: Session['id']
  // microcycleId?: Microcycle['id']
  // programId?: Program['id']
  exerciseId?: Exercise['id']
  order?: SetGroup['order']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  return await db
    .update(setGroups)
    .set({ exerciseId, order })
    .where(and(eq(setGroups.id, id), eq(setGroups.userId, userId)))
    .returning()
}

export async function deleteSetGroup({
  id,
  clerkId,
}: {
  id: SetGroup['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  // delete all sets associated with the set group
  return await db
    .delete(setGroups)
    .where(and(eq(setGroups.id, id), eq(setGroups.userId, userId)))
    .returning({ deletedId: setGroups.id })
}

// Set Functions
export async function createSet({
  id,
  order,
  clerkId,
  programId,
  microcycleId,
  sessionId,
  exerciseId,
  setGroupId,
}: {
  id?: Set['id']
  order?: Set['order']
  clerkId: User['clerkId']
  programId?: Set['programId']
  microcycleId?: Set['microcycleId']
  sessionId: Set['sessionId']
  exerciseId: Set['exerciseId']
  setGroupId: Set['setGroupId']
}) {
  const userId = await validateUser(clerkId)
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

export async function deleteSet({
  id,
  clerkId,
}: {
  id: Set['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  return await db
    .delete(sets)
    .where(and(eq(sets.id, id), eq(sets.userId, userId)))
    .returning({ deletedId: sets.id })
}

export async function getSessions({ clerkId }: { clerkId: User['clerkId'] }) {
  const userId = await validateUser(clerkId)
  return await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(asc(sessions.createdAt))
}

export async function updateSet({
  id,
  reps,
  rpe,
  rir,
  weight,
  exerciseId,
  clerkId,
}: {
  id: Set['id']
  reps?: Set['reps']
  rpe?: Set['rpe']
  rir?: Set['rir']
  weight?: Set['weight']
  exerciseId?: Set['exerciseId']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  return await db
    .update(sets)
    .set({ reps, rpe, rir, weight, exerciseId })
    .where(and(eq(sets.id, id), eq(sets.userId, userId)))
    .returning()
}

export async function getSessionsForProgram({
  programId,
  clerkId,
}: {
  programId: Program['id']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  return await db
    .select()
    .from(sessions)
    .where((eq(sessions.programId, programId), eq(sessions.userId, userId)))
}

export async function getSetsForSession({
  sessionId,
  clerkId,
}: {
  sessionId: SetGroup['sessionId']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  const rows = await db
    .select()
    .from(setGroups)
    .where(
      (eq(setGroups.sessionId, sessionId as string),
      eq(setGroups.userId, userId)),
    )
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

export async function getExercises() {
  return await db.select().from(exercises)
}

export async function createExercise({
  name,
  equipmentType,
  clerkId,
}: {
  name: Exercise['name']
  equipmentType: Exercise['equipmentType']
  clerkId: User['clerkId']
}) {
  const userId = await validateUser(clerkId)
  await db.insert(exercises).values({ name, equipmentType, userId })
}
