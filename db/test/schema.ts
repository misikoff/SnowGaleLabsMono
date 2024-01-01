import { relations } from 'drizzle-orm'
import {
  real,
  text,
  pgTable,
  serial,
  varchar,
  integer,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  clerkId: integer('clerk_id'),
})

export const usersRelations = relations(users, ({ many }) => ({
  exercises: many(exercises),
  programs: many(programs),
  sessions: many(sessions),
  setGroups: many(setGroups),
  sets: many(sets),
}))

export const exercises = pgTable(
  'exercises',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    description: varchar('description', { length: 256 }),
    // only for the user who created it
    userId: integer('user_id'),
  },
  // (programs) => {
  //   return {
  //     nameIndex: uniqueIndex('program_name_idx').on(programs.name),
  //   }
  // },
)

export const exercisesRelations = relations(exercises, ({ one }) => ({
  user: one(users, {
    fields: [exercises.userId],
    references: [users.id],
  }),
}))

// // create a table or Programs with a name and a description and a user column for the user who created it
export const programs = pgTable(
  'programs',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    description: varchar('description', { length: 256 }),
    userId: integer('user_id'),
  },
  // (programs) => {
  //   return {
  //     nameIndex: uniqueIndex('program_name_idx').on(programs.name),
  //   }
  // },
)

export const programsRelations = relations(programs, ({ one }) => ({
  user: one(users, {
    fields: [programs.userId],
    references: [users.id],
  }),
}))

export const sessions = pgTable(
  'sessions',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    userId: integer('user_id'),
    programId: integer('program_id'),
    order: integer('order'),
  },
  // (exercises) => {
  //   return {
  //     nameIndex: uniqueIndex('exercise_name_idx').on(exercises.name),
  //   }
  // },
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  program: one(programs, {
    fields: [sessions.programId],
    references: [programs.id],
  }),
}))

export const setGroups = pgTable(
  'setGroups',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id'),
    sessionId: integer('session_id'),
    programId: integer('program_id'),
    // assuming a set group is a single exercise -- does not handle supersets
    exerciseId: integer('excercise_id'),
    order: integer('order'),
  },
  // (setGroups) => {
  //   return {
  //     nameIndex: uniqueIndex('setGroup_name_idx').on(setGroups.name),
  //   }
  // },
)

export const setGroupsRelation = relations(setGroups, ({ one }) => ({
  user: one(users, {
    fields: [setGroups.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [setGroups.sessionId],
    references: [sessions.id],
  }),
  program: one(programs, {
    fields: [setGroups.programId],
    references: [programs.id],
  }),
  exercise: one(exercises, {
    fields: [setGroups.exerciseId],
    references: [exercises.id],
  }),
}))

// export const setGroupsRelation = relations(setGroups, ({ many }) => ({
//   sets: many(sets),
// }));

export const sets = pgTable(
  'sets',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id'),
    sessionId: integer('session_id'),
    programId: integer('program_id'),
    exerciseId: integer('excercise_id'),
    setGroupId: integer('set_group_id'),
    prescribedReps: integer('prescribed_reps').default(0),
    prescribedRPE: real('prescribed_RPE').default(0),
    prescribedRIR: real('prescribed_RIR').default(0),
    prescribedWeight: real('prescribed_weight').default(0),
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

export const setsRelation = relations(sets, ({ one }) => ({
  user: one(users, {
    fields: [sets.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [sets.sessionId],
    references: [sessions.id],
  }),
  program: one(programs, {
    fields: [sets.programId],
    references: [programs.id],
  }),
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
  setGroup: one(setGroups, {
    fields: [sets.setGroupId],
    references: [setGroups.id],
  }),
}))

export type User = typeof users.$inferSelect
export type Exercise = typeof exercises.$inferSelect
export type Program = typeof programs.$inferSelect
export type Session = typeof sessions.$inferSelect
export type SetGroup = typeof setGroups.$inferSelect
export type Set = typeof sets.$inferSelect
