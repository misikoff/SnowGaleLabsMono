import { relations, sql } from 'drizzle-orm'
import {
  AnyPgColumn,
  boolean,
  date,
  index,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const weightUnitsEnum = ['lbs', 'kg'] as const
export type WeightUnits = (typeof weightUnitsEnum)[number]

export const equipmentEnum = [
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'bodyweight',
  'band',
  'other',
] as const
export type EquipmentType = (typeof equipmentEnum)[number]

export const users = pgTable(
  'users',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    name: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    prod: boolean().default(false),
  },
  (table) => [index('usersClerkIdIndex').on(table.id)],
)

export const exercises = pgTable(
  'exercises',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid().references(() => users.id, { onDelete: 'cascade' }),
    clonedFromId: uuid().references((): AnyPgColumn => exercises.id),
    name: text(),
    description: text(),
    equipmentType: text({ enum: equipmentEnum }),
    weightIncrement: real().default(5),
    weightUnits: text({
      enum: weightUnitsEnum,
    }).default('lbs'),
    notes: text(),
  },
  (table) => [
    index('exercisesUserIdIndex').on(table.userId),
    index('exercisesClonedFromIdIndex').on(table.clonedFromId),
  ],
)

export const programs = pgTable(
  'programs',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid().references(() => users.id, {
      onDelete: 'cascade',
    }),
    name: text(),
    description: text(),
    rirTarget: smallint().default(0),
  },
  (table) => [index('programsUserIdIndex').on(table.userId)],
)

export const programsRelations = relations(programs, ({ one, many }) => ({
  user: one(users),
  templates: many(templates),
}))

// a program is made up of several, ordered workout templates which consist of a list of exercises, as well as the desired RIR, and a name
export const templates = pgTable(
  'templates',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid().references(() => users.id, {
      onDelete: 'cascade',
    }),
    programId: uuid().references(() => programs.id, {
      onDelete: 'cascade',
    }),
    name: text(),
    description: text(),
    order: smallint().default(0),
  },
  (table) => [
    index('templatesUserIdIndex').on(table.userId),
    index('templatesProgramIdIndex').on(table.programId),
  ],
)

// TODO: handle how templates each have multiple, ordered exercises

export const templatesRelations = relations(templates, ({ one, many }) => ({
  user: one(users),
  program: one(programs),
  exercises: many(exercises),
}))

export const sessions = pgTable(
  'sessions',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid().references(() => users.id, {
      onDelete: 'cascade',
    }),
    name: text(),
    programId: uuid().references(() => programs.id),
    templateId: uuid().references(() => templates.id),
    order: smallint().default(0),
    completed: boolean().default(false),
    date: date().notNull().defaultNow(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    // set completed at when completed becomes true
    completedAt: timestamp(),
  },
  (table) => [index('sessionsUserIdIndex').on(table.userId)],
)

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users),
  sets: many(sets),
  setGroups: many(setGroups),
  program: one(programs, {
    fields: [sessions.programId],
    references: [programs.id],
  }),
  template: one(templates, {
    fields: [sessions.templateId],
    references: [templates.id],
  }),
}))

export const setGroups = pgTable(
  'setGroups',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid().references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid().references(() => sessions.id, {
      onDelete: 'cascade',
    }),
    exerciseId: uuid().references(() => exercises.id),
    order: smallint().default(0),
  },
  (table) => [
    index('setGroupsUserIdIndex').on(table.userId),
    index('setGroupsSessionIdIndex').on(table.sessionId),
  ],
)

export const setGroupsRelation = relations(setGroups, ({ one, many }) => ({
  user: one(users),
  exercise: one(exercises, {
    fields: [setGroups.exerciseId],
    references: [exercises.id],
  }),
  session: one(sessions, {
    fields: [setGroups.sessionId],
    references: [sessions.id],
  }),
  sets: many(sets),
}))

export const sets = pgTable(
  'sets',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    // relations
    userId: uuid().references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid()
      .notNull()
      .references(() => sessions.id, {
        onDelete: 'cascade',
      }),
    programId: uuid().references(() => programs.id),
    templateId: uuid().references(() => templates.id),
    exerciseId: uuid()
      .notNull()
      .references(() => exercises.id, {
        onDelete: 'cascade',
      }),
    // TODO: think about this. Should we delete the set if the exercise is deleted?
    setGroupId: uuid()
      .notNull()
      .references(() => setGroups.id, {
        onDelete: 'cascade',
      }),
    // attributes
    reps: smallint(),
    rir: smallint(),
    weight: real(),
    order: smallint().default(0),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('setsUserIdIndex').on(table.userId),
    index('setsSessionIdIndex').on(table.sessionId),
    index('setsExerciseIdIndex').on(table.exerciseId),
    index('setsSetGroupIdIndex').on(table.setGroupId),
  ],
)

export const setsRelation = relations(sets, ({ one }) => ({
  user: one(users),
  session: one(sessions, {
    fields: [sets.sessionId],
    references: [sessions.id],
  }),
  template: one(templates, {
    fields: [sets.templateId],
    references: [templates.id],
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

export const quotes = pgTable(
  'quotes',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    text: text().notNull(),
    author: text(),
    category: text(),
  },
  (table) => [index('quotesCategoryIndex').on(table.category)],
)

export type User = typeof users.$inferSelect
export type Exercise = typeof exercises.$inferSelect
export type Template = typeof templates.$inferSelect
export type Session = typeof sessions.$inferSelect
export type SetGroup = typeof setGroups.$inferSelect
export type Set = typeof sets.$inferSelect
export type Quote = typeof quotes.$inferSelect

export interface SetGroupWithExerciseAndSets extends SetGroup {
  exercise: Exercise
  sets: Set[]
}

export interface SessionWithSetGroupWithExerciseAndSets extends Session {
  setGroups: SetGroupWithExerciseAndSets[]
}

// TODO: determine if all relations can be removed because they are redundant for dribble query
// https://orm.drizzle.team/docs/rqb
