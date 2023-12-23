import {
  real,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
  uuid,
  integer,
} from 'drizzle-orm/pg-core'

// create a user table with a unique id and a name
export const users = pgTable(
  'users',
  {
    // id: serial('id').primaryKey(),
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }),
  },
  // (users) => {
  //   return {
  //     nameIndex: uniqueIndex('user_name_idx').on(users.name),
  //   }
  // },
)

export const exercises = pgTable(
  'exercises',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }),
    description: varchar('description', { length: 256 }),
    // only for the user who created it
    userId: uuid('userId').references(() => users.id),
  },
  // (programs) => {
  //   return {
  //     nameIndex: uniqueIndex('program_name_idx').on(programs.name),
  //   }
  // },
)

// create a table or Programs with a name and a description and a user column for the user who created it
export const programs = pgTable(
  'programs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }),
    description: varchar('description', { length: 256 }),
    userId: uuid('userId').references(() => users.id),
  },
  // (programs) => {
  //   return {
  //     nameIndex: uniqueIndex('program_name_idx').on(programs.name),
  //   }
  // },
)

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }),
    userId: uuid('userId').references(() => users.id),
    programId: uuid('programId').references(() => programs.id),
    order: integer('order'),
  },
  // (exercises) => {
  //   return {
  //     nameIndex: uniqueIndex('exercise_name_idx').on(exercises.name),
  //   }
  // },
)

export const setGroups = pgTable(
  'setGroups',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId').references(() => users.id),
    sessionId: uuid('sessionId').references(() => sessions.id),
    programId: uuid('programId').references(() => programs.id),
    // assuming a set group is a single exercise -- does not handle supersets
    exerciseId: uuid('exerciseId').references(() => exercises.id),
    order: integer('order'),
  },
  // (setGroups) => {
  //   return {
  //     nameIndex: uniqueIndex('setGroup_name_idx').on(setGroups.name),
  //   }
  // },
)

export const sets = pgTable(
  'sets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId').references(() => users.id),
    sessionId: uuid('sessionId').references(() => sessions.id),
    programId: uuid('programId').references(() => programs.id),
    exerciseId: uuid('exerciseId').references(() => exercises.id),
    setGroupId: uuid('setGroupId').references(() => setGroups.id),
    prescribedReps: integer('prescribedReps').default(0),
    prescribedRPE: real('prescribedRPE').default(0),
    prescribedRIR: real('prescribedRIR').default(0),
    prescribedWeight: real('prescribedWeight').default(0),
    reps: integer('reps').default(0),
    RPE: real('RPE').default(0),
    RIR: integer('RIR').default(0),
    weight: real('weight').default(0),
    order: integer('order'),
  },
  // (sets) => {
  //   return {
  //     nameIndex: uniqueIndex('set_name_idx').on(sets.name),
  //   }
  // },
)

export type User = typeof users.$inferSelect
export type Exercise = typeof exercises.$inferSelect
export type Program = typeof programs.$inferSelect
export type Session = typeof sessions.$inferSelect
export type SetGroup = typeof setGroups.$inferSelect
export type Set = typeof sets.$inferSelect
