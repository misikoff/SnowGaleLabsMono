'use server'

// NOT USED ANYWHERE

import { and, asc, eq } from 'drizzle-orm'

import { db } from './index'
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
  SessionWithSetGroupWithExerciseAndSets,
} from './schema'

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
  return await db.select().from(programs)
}

export async function getProgram({ id }: { id: Program['id'] }) {
  return (
    await db.select().from(programs).where(eq(programs.id, id)).limit(1)
  )[0]
}

export async function getProgramWithMicrocycles({ id }: { id: Program['id'] }) {
  return await db.query.programs.findFirst({
    where: and(eq(programs.id, id)),
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
  await db.insert(microcycles).values({
    name,
    programId,
    order,
  })
}

export async function deleteMicrocycle({ id }: { id: Microcycle['id'] }) {
  await db.delete(microcycles).where(eq(microcycles.id, id))
}

export async function getMicrocycleWithSessions({
  microcycleId,
}: {
  microcycleId: Microcycle['id']
}) {
  return await db.query.microcycles.findFirst({
    where: and(eq(microcycles.id, microcycleId)),
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
  const session = await db
    .insert(sessions)
    .values({
      id,
      name,
      order,
      programId,
      microcycleId,
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

export async function getSession({ id }: { id: Session['id'] }) {
  console.log({ id })
  // return (
  //   await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
  // )[0]
  // TODO: why is explicit type needed here?
  return (await db.query.sessions.findFirst({
    where: and(eq(sessions.id, id)),
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
  return await db
    .update(sessions)
    .set({ name, order, completed })
    .where(and(eq(sessions.id, id)))
    .returning()
}

export async function deleteSession(id: Session['id']) {
  // deletes all set groups and sets associated with the session

  await db.delete(sessions).where(eq(sessions.id, id))
}

export async function getSessionWithSetGroups({
  sessionId,
}: {
  sessionId: Session['id']
}) {
  return await db.query.sessions.findFirst({
    where: and(eq(sessions.id, sessionId)),
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
}: {
  sessionId: Session['id']
}) {
  return await db.query.setGroups.findMany({
    where: and(eq(sessions.id, sessionId)),
    with: {
      sets: { orderBy: [asc(sets.order)] },
      exercise: true,
    },
    orderBy: [asc(setGroups.order)],
  })
}

export async function getSetGroupWithSets({
  setGroupId,
}: {
  setGroupId: SetGroup['id']
}) {
  return await db.query.setGroups.findFirst({
    where: and(eq(setGroups.id, setGroupId)),
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
  return await db
    .insert(setGroups)
    .values({
      id,
      programId,
      microcycleId,
      order,
      sessionId,
      exerciseId,
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
  return await db
    .update(setGroups)
    .set({ exerciseId, order })
    .where(and(eq(setGroups.id, id)))
    .returning()
}

export async function deleteSetGroup({ id }: { id: SetGroup['id'] }) {
  // delete all sets associated with the set group
  return await db
    .delete(setGroups)
    .where(and(eq(setGroups.id, id)))
    .returning({ deletedId: setGroups.id })
}

// Set Functions
export async function createSet({
  id,
  order,
  programId,
  microcycleId,
  sessionId,
  exerciseId,
  setGroupId,
}: {
  id?: Set['id']
  order?: Set['order']
  programId?: Set['programId']
  microcycleId?: Set['microcycleId']
  sessionId: Set['sessionId']
  exerciseId: Set['exerciseId']
  setGroupId: Set['setGroupId']
}) {
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
    })
    .returning()
}

export async function deleteSet({ id }: { id: Set['id'] }) {
  return await db
    .delete(sets)
    .where(and(eq(sets.id, id)))
    .returning({ deletedId: sets.id })
}

export async function getSessions() {
  return await db.select().from(sessions).orderBy(asc(sessions.createdAt))
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
  return await db
    .update(sets)
    .set({ reps, rpe, rir, weight, exerciseId })
    .where(and(eq(sets.id, id)))
    .returning()
}

export async function getSessionsForProgram({
  programId,
}: {
  programId: Program['id']
}) {
  return await db
    .select()
    .from(sessions)
    .where(eq(sessions.programId, programId))
}

export async function getSetsForSession({
  sessionId,
}: {
  sessionId: SetGroup['sessionId']
}) {
  const rows = await db
    .select()
    .from(setGroups)
    .where(eq(setGroups.sessionId, sessionId as string))
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
}: {
  name: Exercise['name']
  equipmentType: Exercise['equipmentType']
}) {
  await db.insert(exercises).values({ name, equipmentType })
}
