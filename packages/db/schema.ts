import { relations, sql } from 'drizzle-orm'
import {
  AnyPgColumn,
  boolean,
  date,
  index,
  integer,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const repStyleEnum = ['high', 'medium', 'low'] as const
export type RepStyle = (typeof repStyleEnum)[number]

export const weightUnitsEnum = ['lbs', 'kg'] as const
export type WeightUnits = (typeof weightUnitsEnum)[number]

export const distanceUnitsEnum = ['yards', 'meters'] as const
export type DistanceUnits = (typeof distanceUnitsEnum)[number]

export const exerciseType = ['compound', 'isolation'] as const
export type ExerciseType = (typeof exerciseType)[number]

export const setGroupType = ['superset', 'circuit', 'normal'] as const

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

export const exercises = pgTable(
  'exercises',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid().references(() => users.id, { onDelete: 'cascade' }),
    isMainExercise: boolean().default(false),
    clonedFromId: uuid().references((): AnyPgColumn => exercises.id),
    name: text(),
    description: text(),
    equipmentType: text({ enum: equipmentEnum }),
    defaultRepRange: text({ enum: repStyleEnum }).default('medium'),
    weightIncrement: real().default(5),
    weightUnits: text({
      enum: weightUnitsEnum,
    }).default('lbs'),
    useWeight: boolean().default(true),
    useDistance: boolean().default(false),
    distanceIncrement: real().default(5),
    distanceUnits: text({
      enum: distanceUnitsEnum,
    }).default('yards'),
    notes: text(),
  },
  (table) => [
    index('exercisesIsMainExerciseIndex').on(table.isMainExercise),
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
  },
  (table) => [index('programsUserIdIndex').on(table.userId)],
)

export const programsRelations = relations(programs, ({ one, many }) => ({
  user: one(users),
  macrocycles: many(macrocycles),
  microcycles: many(microcycles),
}))

export const macrocycles = pgTable(
  'macrocycles',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // TODO: should deletes cascade?,
    programId: uuid().references(() => programs.id),
    name: text(),
    order: smallint('order').default(0),
  },
  (table) => [index('macrocyclesUserIdIndex').on(table.userId)],
)

export const macrocyclesRelations = relations(macrocycles, ({ one, many }) => ({
  user: one(users),
  program: one(programs),
  microcycles: many(microcycles),
  sessions: many(sessions),
  many: many(setGroups),
}))

export const microcycles = pgTable(
  'microcycles',
  {
    id: uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // TODO: should deletes cascade?,
    programId: uuid().references(() => programs.id),
    macrocycleId: uuid().references(() => macrocycles.id),
    name: text(),
    order: smallint().default(0),
  },
  (table) => [index('microcyclesUserIdIndex').on(table.userId)],
)

export const microcyclesRelations = relations(microcycles, ({ one, many }) => ({
  user: one(users),
  program: one(programs),
  macrocycle: one(macrocycles),
  sessions: many(sessions),
  many: many(setGroups),
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
    macrocycleId: uuid().references(() => macrocycles.id),
    microcycleId: uuid().references(() => microcycles.id),
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
  macrocycle: one(macrocycles, {
    fields: [sessions.macrocycleId],
    references: [macrocycles.id],
  }),
  microcycle: one(microcycles, {
    fields: [sessions.microcycleId],
    references: [microcycles.id],
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
    microcycleId: uuid().references(() => microcycles.id),
    programId: uuid().references(() => programs.id),
    type: text({ enum: setGroupType }).default('normal'),
    // if type is not normal then set exerciseId to null, but dont generate the id automatically
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
  microcycle: one(microcycles, {
    fields: [setGroups.microcycleId],
    references: [microcycles.id],
  }),
  program: one(programs, {
    fields: [setGroups.programId],
    references: [programs.id],
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
    microcycleId: uuid().references(() => microcycles.id),
    programId: uuid().references(() => programs.id),
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
    prescribedReps: integer(),
    prescribedRpe: real(),
    prescribedRir: real(),
    prescribedWeight: real(),
    reps: integer(),
    rpe: real(),
    rir: integer(),
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
  microcycle: one(microcycles, {
    fields: [sets.microcycleId],
    references: [microcycles.id],
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
export type Macrocycle = typeof macrocycles.$inferSelect
export type Microcycle = typeof microcycles.$inferSelect
export type Session = typeof sessions.$inferSelect
export type SetGroup = typeof setGroups.$inferSelect
export type Set = typeof sets.$inferSelect

export interface SetGroupWithExerciseAndSets extends SetGroup {
  exercise: Exercise
  sets: Set[]
}

export interface SessionWithSetGroupWithExerciseAndSets extends Session {
  setGroups: SetGroupWithExerciseAndSets[]
}

export interface ProgramWithMicrocycles extends Program {
  microcycles: Microcycle[]
}

// TODO: determine if all relations can be removed because they are redundant for dribble query
// https://orm.drizzle.team/docs/rqb
