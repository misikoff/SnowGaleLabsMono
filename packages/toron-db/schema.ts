import { sql } from 'drizzle-orm'
import {
  AnyPgColumn,
  boolean,
  date,
  index,
  pgPolicy,
  pgSchema,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { authenticatedRole } from 'drizzle-orm/supabase'

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

const authSchema = pgSchema('auth')

const usersOnlyPolicy = pgPolicy('Only Users can do anything', {
  as: 'permissive',
  to: authenticatedRole,
  for: 'all',
  using: sql`(( SELECT auth.uid() AS uid) = user_id)`,
  withCheck: sql`true`,
})

const readOnlyPolicy = pgPolicy('Read Only Policy', {
  as: 'permissive',
  to: 'public',
  for: 'select',
  using: sql`true`,
  withCheck: sql``,
})

const userDef = sql`auth.uid()`
const primaryKeyDef = sql`gen_random_uuid()`
const id = uuid().default(primaryKeyDef).primaryKey()
const userId = uuid()
  .default(userDef)
  .references(() => users.id, {
    onDelete: 'cascade',
  })

// existing supabase auth table
const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
})

// https://supabase.com/docs/guides/auth/managing-user-data
// Links to auth.users creation (via trigger) and deletion (via cascade)
// TODO: handle updates with triggers
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    firstName: text(),
    lastName: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    prod: boolean().default(false),
    currentSplitId: uuid().references(() => splits.id, {
      onDelete: 'set null',
    }),
    activeSessionId: uuid().references(() => sessions.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    pgPolicy('Only Users can do anything', {
      as: 'permissive',
      to: authenticatedRole,
      for: 'all',
      using: sql`(( SELECT auth.uid() AS uid) = id)`,
      withCheck: sql`true`,
    }),
  ],
)

export const quotes = pgTable(
  'quotes',
  {
    id,
    text: text().notNull(),
    author: text(),
    category: text(),
  },
  (table) => [index('quotesCategoryIndex').on(table.category), readOnlyPolicy],
)

// 🔹 Muscle Groups (e.g., "Chest", "Back", "Quads")
export const muscleGroups = pgTable(
  'muscle_groups',
  {
    id,
    name: text('name').notNull().unique(),
  },
  (table) => [readOnlyPolicy],
)

export const exercises = pgTable(
  'exercises',
  {
    id,
    muscleGroupId: uuid().references(() => muscleGroups.id, {
      onDelete: 'set null',
    }),
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
    index('exercisesMuscleGroupIdIndex').on(table.muscleGroupId),
    readOnlyPolicy,
  ],
)

// 🔹 Splits (e.g., "Push/Pull/Legs")
export const splits = pgTable(
  'splits',
  {
    id,
    userId,
    name: text(),
    description: text(),
    rirTarget: smallint().default(0),
    plannedRestDays: boolean().default(true),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('splitsUserIdIndex').on(table.userId), usersOnlyPolicy],
)

// 🔹 Exercises for Each Muscle Group in a Session
export const sessionExercises = pgTable(
  'session_exercises',
  {
    id,
    userId,
    sessionId: uuid()
      .references(() => sessions.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    muscleGroupId: uuid()
      .references(() => muscleGroups.id, {
        onDelete: 'set null',
      })
      .notNull(),
    exerciseId: uuid().references(() => exercises.id, {
      onDelete: 'set null',
    }),
    order: smallint('order').notNull(),
  },
  (table) => [usersOnlyPolicy],
)

export const sessions = pgTable(
  'sessions',
  {
    id,
    userId,
    name: text(),
    // only set if this session is a template
    splitTemplateId: uuid().references(() => splits.id, {
      onDelete: 'cascade',
    }),
    isRestDay: boolean().default(false),
    // indicates what split this session was created from
    // may delete this if we don't use it
    splitId: uuid().references(() => splits.id, {
      onDelete: 'set null',
    }),
    clonedFromSessionId: uuid().references((): AnyPgColumn => sessions.id, {
      onDelete: 'set null',
    }),
    description: text(),
    // for use with templates only
    order: smallint(),
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
  (table) => [
    index('sessionsUserIdIndex').on(table.userId),
    index('sessionsSplitTemplateIdIndex').on(table.splitTemplateId),
    index('sessionsSplitIdIndex').on(table.splitId),
    usersOnlyPolicy,
  ],
)

export const sets = pgTable(
  'sets',
  {
    id,
    userId,
    sessionExerciseId: uuid()
      .notNull()
      .references(() => sessionExercises.id, {
        onDelete: 'cascade',
      }),
    sessionId: uuid()
      .notNull()
      .references(() => sessions.id, {
        onDelete: 'cascade',
      }),
    // TODO: think about this. Should we delete the set if the exercise is deleted?
    exerciseId: uuid()
      .notNull()
      .references(() => exercises.id, {
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
    index('setsSessionExerciseIdIndex').on(table.sessionExerciseId),
    usersOnlyPolicy,
  ],
)

export const feedback = pgTable(
  'feedback',
  {
    id: uuid('id').default(primaryKeyDef).primaryKey(),
    userId,
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('feedbackUserIdIndex').on(table.userId),
    usersOnlyPolicy, // Apply the "Only Users can do anything" policy
  ],
)

// project minotaur
export const miniExercises = pgTable(
  'mini_exercises',
  {
    id,
    userId,
    muscleGroupId: uuid().references(() => muscleGroups.id, {
      onDelete: 'set null',
    }),
    date: date().notNull().defaultNow(),
    //
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('miniExercisesUserIdIndex').on(table.userId),
    usersOnlyPolicy,
  ],
)

export type User = typeof users.$inferSelect
export type Profile = typeof profiles.$inferSelect
export type Exercise = typeof exercises.$inferSelect
export type Session = typeof sessions.$inferSelect
export type Set = typeof sets.$inferSelect
export type Quote = typeof quotes.$inferSelect
export type MuscleGroup = typeof muscleGroups.$inferSelect
export type Split = typeof splits.$inferSelect
export type SessionExercise = typeof sessionExercises.$inferSelect
export type Feedback = typeof feedback.$inferSelect

// project minotaur
export type MiniExercise = typeof miniExercises.$inferSelect
